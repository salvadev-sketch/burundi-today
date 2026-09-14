import type { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../config/firebase";
import { User, type UserRole, type IUser } from "../models/User";

export interface AuthedRequest extends Request {
  user?: IUser;
}

/**
 * Reads the Firebase ID token from the Authorization header
 * ("Bearer <token>"), verifies it against Firebase, and loads the matching
 * Mongo user (by firebaseUid) onto req.user. Replaces the old app-issued
 * JWT check — RBAC below this point (requireRole, role checks) is
 * unchanged.
 *
 * A verified Firebase token with no matching Mongo user yet is NOT an
 * error here — POST /api/auth/sync (called right after sign-in/sign-up on
 * the frontend) is what creates that record. Routes that need an existing
 * profile should check req.user themselves and 404 if it's missing.
 */
export async function authenticate(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return res.status(404).json({ error: "User profile not found. Call /api/auth/sync first." });
    }
    if (user.status === "deactivated") {
      return res.status(403).json({ error: "Account deactivated" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Same token check as authenticate(), but never blocks the request if the
 * token is missing/invalid — it just leaves req.user undefined. Used for
 * routes that behave differently for signed-in staff vs. the public (e.g.
 * GET /articles showing drafts to staff, published-only to everyone else)
 * without requiring sign-in.
 */
export async function optionalAuthenticate(req: AuthedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return next();

  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (user && user.status !== "deactivated") {
      req.user = user;
    }
  } catch {
    // Invalid/expired token on an optional-auth route: proceed as anonymous
    // rather than failing the request.
  }
  next();
}

/**
 * Express middleware factory equivalent to the old requireRole(req, roles).
 * Usage: router.post("/", ...requireRole("Admin", "Editor"), handler)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return [
    authenticate,
    (req: AuthedRequest, res: Response, next: NextFunction) => {
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user!.role)) {
        return res.status(403).json({ error: `Requires one of: ${allowedRoles.join(", ")}` });
      }
      next();
    },
  ];
}
