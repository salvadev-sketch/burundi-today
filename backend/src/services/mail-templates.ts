/**
 * Plain-HTML email templates. Kept intentionally simple (inline styles,
 * no build step, no MJML) since we're sending a handful of transactional
 * emails, not marketing campaigns.
 */

const SITE_NAME = "Burundi Today";
const SITE_URL = process.env.FRONTEND_ORIGIN || "https://burundi-today.vercel.app";

export function newsletterWelcomeEmail(opts: { name?: string; unsubscribeUrl: string }) {
  const greeting = opts.name ? `Hi ${opts.name},` : "Hi there,";

  const html = `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="margin-bottom: 8px;">You're subscribed 🎉</h2>
      <p>${greeting}</p>
      <p>
        Thanks for subscribing to the ${SITE_NAME} newsletter. You'll get an
        email whenever we publish something worth reading.
      </p>
      <p>
        <a href="${SITE_URL}" style="color: #1a56db;">Visit ${SITE_NAME}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6b7280;">
        Didn't sign up for this? You can
        <a href="${opts.unsubscribeUrl}" style="color: #6b7280;">unsubscribe here</a>.
      </p>
    </div>
  `.trim();

  return { subject: `You're subscribed to ${SITE_NAME}`, html };
}

export function articlePublishedEmail(opts: {
  title: string;
  dek: string;
  slug: string;
  categoryName?: string;
  unsubscribeUrl: string;
}) {
  const articleUrl = `${SITE_URL}/articles/${opts.slug}`;

  const html = `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      ${opts.categoryName ? `<p style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #b45309; margin-bottom: 8px;">${opts.categoryName}</p>` : ""}
      <h2 style="margin: 0 0 10px;">${opts.title}</h2>
      <p style="color: #4b5563; line-height: 1.5;">${opts.dek}</p>
      <p style="margin: 20px 0;">
        <a href="${articleUrl}" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 4px; font-size: 14px;">
          Read the full story
        </a>
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6b7280;">
        You're getting this because you subscribed to ${SITE_NAME}.
        <a href="${opts.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe</a>.
      </p>
    </div>
  `.trim();

  return { subject: `New on ${SITE_NAME}: ${opts.title}`, html };
}
