import type { Request, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import { firebaseAuth } from "../config/firebase";
import { User } from "../models/User";
import { authenticate, type AuthedRequest } from "../middleware/auth";

const router = Router();

function serializeUser(user: any) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    language: user.language,
    notificationPreferences: user.notificationPreferences,
  };
}

const SyncSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatarUrl: z.string().url().optional(),
});

// POST /api/auth/sync
// Called by the frontend right after Firebase sign-in or sign-up
// (createUserWithEmailAndPassword / signInWithEmailAndPassword /
// signInWithPopup for Google), with a verified Firebase ID token in the
// Authorization header. Creates the Mongo profile on first sign-in,
// otherwise just returns (and lightly refreshes name/avatar on) the
// existing one. This is the only place a User document gets created.
router.post("/sync", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  let decoded;
  try {
    decoded = await firebaseAuth.verifyIdToken(token);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const parsed = SyncSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  }
  const { name, avatarUrl } = parsed.data;

  let user = await User.findOne({ firebaseUid: decoded.uid });

  if (!user) {
    // Also check by email in case this Firebase account corresponds to a
    // pre-migration Mongo user that hasn't been linked yet for some reason
    // (the bulk migration script should normally handle this, but this is
    // a safety net so a real person is never silently duplicated).
    if (decoded.email) {
      user = await User.findOne({ email: decoded.email.toLowerCase() });
    }
  }

  if (user) {
    if (!user.firebaseUid) user.firebaseUid = decoded.uid;
    if (name && name !== user.name) user.name = name;
    if (avatarUrl && avatarUrl !== user.avatarUrl) user.avatarUrl = avatarUrl;
    await user.save();
  } else {
    if (!decoded.email) {
      return res.status(400).json({ error: "Account has no email on file" });
    }
    user = await User.create({
      firebaseUid: decoded.uid,
      email: decoded.email,
      name: name || decoded.name || decoded.email.split("@")[0],
      avatarUrl: avatarUrl || decoded.picture,
      role: "Subscriber",
      language: "en",
    });
  }

  if (user.status === "deactivated") {
    return res.status(403).json({ error: "Account deactivated" });
  }

  res.json({ user: serializeUser(user) });
});

// GET /api/auth/me
// Used by the frontend to hydrate the signed-in profile on page load,
// given a valid Firebase ID token from the current session.
router.get("/me", authenticate, async (req: AuthedRequest, res: Response) => {
  res.json({ user: serializeUser(req.user) });
});

export default router;
