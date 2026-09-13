"use client";

import SiteChrome from "@/components/site/SiteChrome";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { aboutContent } from "@/lib/i18n/pageContent";

export default function AboutPage() {
  const { settings } = useSiteSettings();
  const { language } = useLanguage();
  const c = aboutContent[language];
  const email = settings?.contactEmail || "hello@amakuru.news";

  return (
    <SiteChrome>
      <div className="mx-auto max-w-[760px] px-4 py-9 sm:px-8">
        <div className="mb-7 border-b-[3px] border-ink pb-4">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">{c.label}</span>
          <h1 className="font-display text-[34px] font-semibold text-ink">
            {c.headingPrefix} {settings?.siteName || "Burundi Today"}
          </h1>
        </div>

        <div className="space-y-5 text-[15px] leading-relaxed text-charcoal">
          <p>{settings?.tagline || c.introFallback}</p>
          <p>{c.body1}</p>
          <p>{c.body2}</p>
          <p>
            <a href="/ethics" className="font-semibold text-teal hover:text-brand-dark">
              {c.ethicsLinkLabel}
            </a>
          </p>
          <p>{c.body3}</p>
          <p>
            <a href={`mailto:${email}`} className="font-semibold text-teal hover:text-brand-dark">
              {c.contactLinkLabel}
            </a>
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}
