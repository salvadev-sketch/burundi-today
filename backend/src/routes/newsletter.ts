import type { Request, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import { NewsletterSubscriber } from "../models/Newsletter";
import { requireRole } from "../middleware/auth";
import { sendMail } from "../config/mail";
import { newsletterWelcomeEmail } from "../services/mail-templates";
import { unsubscribeUrlFor } from "../services/notify-subscribers";

const router = Router();

const SubscribeInput = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
});

// POST /api/newsletter — public subscribe form (site footer)
router.post("/", async (req: Request, res: Response) => {
  const parsed = SubscribeInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email", details: parsed.error.flatten() });
  }

  const existing = await NewsletterSubscriber.findOne({ email: parsed.data.email });
  let subscriber = existing;
  let justResubscribed = false;

  if (existing) {
    if (!existing.active) {
      existing.active = true;
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      await existing.save();
      justResubscribed = true;
    }
  } else {
    subscriber = await NewsletterSubscriber.create(parsed.data);
    justResubscribed = true;
  }

  // Best-effort: a failed email should never fail the subscription itself.
  if (justResubscribed && subscriber) {
    const { subject, html } = newsletterWelcomeEmail({
      name: subscriber.name,
      unsubscribeUrl: unsubscribeUrlFor(subscriber.email),
    });
    void sendMail({ to: subscriber.email, subject, html });
  }

  res.status(existing ? 200 : 201).json({ subscriber });
});

// GET /api/newsletter — Admin/Editor only
router.get("/", requireRole("Admin", "Editor"), async (_req: Request, res: Response) => {
  const subscribers = await NewsletterSubscriber.find({}).sort({ subscribedAt: -1 });
  res.json({ subscribers, total: subscribers.length });
});

// DELETE /api/newsletter?email=<email> — unsubscribe (public, called from the site UI)
router.delete("/", async (req: Request, res: Response) => {
  const email = req.query.email as string | undefined;
  if (!email) {
    return res.status(400).json({ error: "Missing email query param" });
  }
  await NewsletterSubscriber.findOneAndUpdate({ email }, { active: false, unsubscribedAt: new Date() });
  res.json({ success: true });
});

// GET /api/newsletter/unsubscribe?email=<email> — public, clickable from an email
// link (mail clients only ever GET a plain <a href>, so DELETE above can't be
// used directly in the welcome/notification emails).
router.get("/unsubscribe", async (req: Request, res: Response) => {
  const email = req.query.email as string | undefined;
  if (!email) {
    return res.status(400).send("Missing email");
  }
  await NewsletterSubscriber.findOneAndUpdate({ email }, { active: false, unsubscribedAt: new Date() });
  res
    .status(200)
    .type("html")
    .send(
      `<html><body style="font-family:sans-serif;text-align:center;padding:40px;">
        <h2>You've been unsubscribed</h2>
        <p>${email} will no longer receive the Burundi Today newsletter.</p>
      </body></html>`
    );
});

export default router;
