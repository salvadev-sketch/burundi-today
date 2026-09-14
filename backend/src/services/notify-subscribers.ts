import { NewsletterSubscriber } from "../models/Newsletter";
import { sendMailBatch } from "../config/mail";
import { articlePublishedEmail } from "./mail-templates";

export function unsubscribeUrlFor(email: string) {
  const base = process.env.BACKEND_ORIGIN || "http://localhost:4000";
  return `${base}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
}

export interface PublishedArticleInfo {
  title: string;
  dek: string;
  slug: string;
  categoryName?: string;
}

/**
 * Fire-and-forget: emails every active newsletter subscriber that a new
 * article is live. Each subscriber gets their own unsubscribe link, but
 * the whole list still goes out in batches of up to 100 via Resend's
 * /emails/batch endpoint (one HTTP request per 100 subscribers, not one
 * per subscriber).
 */
export async function notifySubscribersOfPublish(article: PublishedArticleInfo): Promise<void> {
  const subscribers = await NewsletterSubscriber.find({ active: true }).select("email");
  if (subscribers.length === 0) return;

  const items = subscribers.map((s) => {
    const { subject, html } = articlePublishedEmail({
      ...article,
      unsubscribeUrl: unsubscribeUrlFor(s.email),
    });
    return { to: s.email, subject, html };
  });

  await sendMailBatch(items);
}
