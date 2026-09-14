/**
 * Minimal transactional email integration using Resend's plain HTTP API.
 * We deliberately avoid the `resend` npm SDK — this is a thin wrapper
 * around a single POST request, same philosophy as config/cloudinary.ts.
 *
 * Get an API key at https://resend.com (free tier: 3,000 emails/month,
 * 100/day). You'll also need to verify a sending domain there — until you
 * do, Resend only lets you send to the email address on your own account,
 * which is fine for local testing but not for real subscribers.
 */

const RESEND_API_URL = "https://api.resend.com/emails";

function getEnv(name: string): string | undefined {
  return process.env[name];
}

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends a transactional email. Returns true on success, false on any
 * failure (missing config, network error, non-2xx response) — callers
 * should treat email delivery as best-effort and never let a failure here
 * break the underlying action (e.g. a newsletter signup should still
 * succeed even if the confirmation email doesn't send).
 */
export async function sendMail({ to, subject, html }: SendMailInput): Promise<boolean> {
  const apiKey = getEnv("RESEND_API_KEY");
  const from = getEnv("MAIL_FROM");

  if (!apiKey || !from) {
    console.warn("[mail] RESEND_API_KEY or MAIL_FROM not set — skipping email send");
    return false;
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[mail] Resend send failed (${res.status}): ${body}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[mail] Resend send threw:", err);
    return false;
  }
}

const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";
const BATCH_CHUNK_SIZE = 100; // Resend's per-request batch cap

/**
 * Sends a distinct email per item (e.g. each with its own unsubscribe
 * link), batched via Resend's /batch endpoint so N recipients costs
 * ceil(N/100) HTTP requests instead of N. Best-effort per chunk: one
 * failed chunk doesn't stop the others.
 */
export async function sendMailBatch(items: SendMailInput[]): Promise<void> {
  const apiKey = getEnv("RESEND_API_KEY");
  const from = getEnv("MAIL_FROM");

  if (!apiKey || !from) {
    console.warn("[mail] RESEND_API_KEY or MAIL_FROM not set — skipping batch send");
    return;
  }

  for (let i = 0; i < items.length; i += BATCH_CHUNK_SIZE) {
    const chunk = items.slice(i, i + BATCH_CHUNK_SIZE);
    try {
      const res = await fetch(RESEND_BATCH_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk.map((item) => ({ from, ...item }))),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(`[mail] Resend batch send failed (${res.status}): ${body}`);
      }
    } catch (err) {
      console.error("[mail] Resend batch send threw:", err);
    }
  }
}
