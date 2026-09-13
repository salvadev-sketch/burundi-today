"use client";

import Link from "next/link";
import { Twitter, Facebook, Instagram } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { LangKey } from "@/lib/i18n/translations";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

const SECTIONS: { href: string; key: LangKey }[] = [
  { href: "/category/politics", key: "politics" },
  { href: "/category/business", key: "business" },
  { href: "/category/culture", key: "culture" },
  { href: "/category/sport", key: "sport" },
];

export default function SiteFooter() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const social = settings?.socialLinks || {};
  const hasSocial = social.twitter || social.facebook || social.instagram;

  return (
    <footer className="bg-papyrus px-4 pb-6 pt-9 sm:px-6">
      <div className="mb-7 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-2.5 font-display text-2xl italic text-ink">Burundi Today</div>
          <p className="max-w-[32ch] text-[13px] leading-relaxed text-muted">{t("footerTagline")}</p>
        </div>
        <div>
          <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink">{t("footerSections")}</h4>
          <ul className="flex flex-col gap-2">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-[13px] text-charcoal hover:text-amber-deep">
                  {t(s.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink">{t("footerCompany")}</h4>
          <ul className="flex flex-col gap-2">
            <li><Link href="/about" className="text-[13px] text-charcoal hover:text-amber-deep">{t("footerAbout")}</Link></li>
            <li><Link href="/ethics" className="text-[13px] text-charcoal hover:text-amber-deep">{t("footerEthics")}</Link></li>
            <li><Link href="/careers" className="text-[13px] text-charcoal hover:text-amber-deep">{t("footerCareers")}</Link></li>
            <li><Link href="/contact" className="text-[13px] text-charcoal hover:text-amber-deep">{t("footerContact")}</Link></li>
            <li><a href="/feed.xml" className="text-[13px] text-charcoal hover:text-amber-deep">{t("footerRss")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink">{t("footerAccount")}</h4>
          <ul className="flex flex-col gap-2">
            <li><Link href="/bookmarks" className="text-[13px] text-charcoal hover:text-amber-deep">{t("bookmarks")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 font-mono text-[11px] text-muted">
        <span>© {new Date().getFullYear()} {t("footerCopyright")}</span>
        {hasSocial && (
          <div className="flex items-center gap-2">
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex h-7 w-7 items-center justify-center rounded-sm bg-black text-white transition-colors hover:bg-neutral-800"
              >
                <Twitter size={13} strokeWidth={2} />
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1877F2] text-white transition-colors hover:bg-[#1465CC]"
              >
                <Facebook size={13} strokeWidth={2} />
              </a>
            )}
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#E1306C] text-white transition-colors hover:bg-[#C22A5F]"
              >
                <Instagram size={13} strokeWidth={2} />
              </a>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
