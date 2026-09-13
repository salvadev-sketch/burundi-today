"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import AuthModal from "@/components/AuthModal";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { LangKey } from "@/lib/i18n/translations";

const NAV_LINKS: { href: string; key: LangKey }[] = [
  { href: "/", key: "home" },
  { href: "/category/politics", key: "politics" },
  { href: "/category/business", key: "business" },
  { href: "/category/culture", key: "culture" },
  { href: "/category/sport", key: "sport" },
];

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function SiteHeader() {
  const { profile, loading } = useAuthUser();
  const { t } = useLanguage();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isSignedIn = !loading && !!profile;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <div className="flex items-center justify-between bg-ink px-4 py-1.5 text-[12.5px] text-[#EDE9DD] sm:px-6">
        <span className="font-mono opacity-80">{today}</span>
        <span className="hidden font-mono text-[11px] text-[#B9B4A2] sm:inline">
          {t("tagline")}
        </span>
      </div>

      <header className="relative flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-ink px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" width={36} height={36} alt="Burundi Today" className="shrink-0 rounded-full" />
          <span className="font-display text-[32px] italic font-semibold sm:text-[38px]">Burundi Today</span>
        </Link>

        <div className="hidden items-center gap-3 sm:flex">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="flex items-center gap-1.5">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-52 rounded border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="text-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t("searchButton")}
              className="text-charcoal hover:text-amber-deep"
            >
              <Search size={19} strokeWidth={2} />
            </button>
          )}
          <LanguageSwitcher />
        </div>

        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute left-0 right-0 top-full z-20 flex-col gap-0 border-t border-line border-b-[3px] border-b-ink bg-white px-4 py-2 sm:static sm:z-auto sm:flex sm:flex-row sm:items-center sm:gap-7 sm:border-0 sm:bg-transparent sm:p-0`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="w-full border-b border-line py-2.5 text-sm font-semibold text-charcoal hover:text-amber-deep sm:w-auto sm:border-0 sm:border-b-2 sm:border-transparent sm:py-0 sm:pb-1 sm:hover:border-amber"
            >
              {t(link.key)}
            </Link>
          ))}

          <form onSubmit={submitSearch} className="flex w-full items-center gap-2 border-b border-line py-2.5 sm:hidden">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent text-sm text-ink outline-none"
            />
          </form>

          <div className="w-full border-b border-line py-2.5 sm:hidden">
            <LanguageSwitcher />
          </div>

          {isSignedIn ? (
            <Link
              href="/bookmarks"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-full bg-papyrus py-1.5 pl-1.5 pr-3 text-[13px] font-semibold text-ink sm:mt-0"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal font-display text-[11px] font-semibold text-white">
                {initials(profile?.name)}
              </span>
              {profile?.name || t("account")}
            </Link>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                setAuthOpen(true);
              }}
              className="mt-2 rounded border border-ink px-4 py-2 text-[13px] font-semibold text-ink hover:bg-ink hover:text-white sm:mt-0"
            >
              {t("signIn")}
            </button>
          )}
        </nav>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          className="rounded border border-ink px-3 py-2 font-mono text-[13px] font-bold text-ink sm:hidden"
        >
          {menuOpen ? t("closeMenu") : t("menu")}
        </button>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthenticated={() => setAuthOpen(false)} />
    </>
  );
}
