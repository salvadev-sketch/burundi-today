"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { STAFF_ROLES, getVisibleNavItems } from "@/lib/permissions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, isSignedIn, logout } = useAuthUser();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        {t("adminLoading")}
      </div>
    );
  }

  if (!isSignedIn || !profile) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-adminNavy">{t("adminSignInRequiredTitle")}</h1>
        <p className="mt-2 text-sm text-gray-500">{t("adminSignInRequiredBody")}</p>
        <Link href="/" className="mt-4 inline-block rounded bg-adminOrange px-4 py-2 text-sm font-semibold text-adminNavy">
          {t("adminGoToHomepage")}
        </Link>
      </div>
    );
  }

  if (!STAFF_ROLES.includes(profile.role)) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-adminNavy">{t("adminNotAuthorizedTitle")}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your account role (<strong>{profile.role}</strong>) {t("adminNotAuthorizedBody")}
        </p>
      </div>
    );
  }

  const navLinks = getVisibleNavItems(profile.role).map((item) => {
    const active = pathname?.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-adminOrange text-adminNavy font-semibold"
            : "text-white/70 hover:bg-adminNavyLight hover:text-white"
        }`}
      >
        {t(item.key)}
      </Link>
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile top bar — hidden on md+, where the sidebar is always visible */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-adminNavy px-4 py-3 md:hidden">
        <div className="font-display text-base font-semibold text-white">
          Burundi Today <span className="text-adminOrange">•</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="rounded p-1.5 text-white hover:bg-adminNavyLight"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Backdrop, mobile only, shown while the sidebar drawer is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 overflow-y-auto bg-adminNavy p-4 transition-transform duration-200 ease-in-out md:static md:z-auto md:w-56 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-start justify-between px-2">
          <div>
            <div className="font-display text-lg font-semibold text-white">
              Burundi Today <span className="text-adminOrange">•</span>
            </div>
            <div className="text-xs text-white/50">{t("adminDashboard")}</div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="rounded p-1 text-white/70 hover:bg-adminNavyLight hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {/* Admin sees every item here automatically (getVisibleNavItems
              grants Admin all access); other roles only see the pages
              their role is permitted to use, per lib/permissions.ts. */}
          {navLinks}
        </nav>
        <div className="mt-8 border-t border-white/10 px-2 pt-4 text-xs text-white/50">
          {t("adminSignedInAs")}
          <div className="mt-1 font-medium text-white">{profile.name}</div>
          <div className="text-adminOrange">{profile.role}</div>
          <button
            onClick={() => logout()}
            className="mt-3 w-full rounded border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-adminOrange hover:border-adminOrange hover:text-adminNavy"
          >
            {t("adminSignOut")}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8">{children}</main>
    </div>
  );
}
