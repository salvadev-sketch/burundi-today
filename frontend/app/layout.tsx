import type { Metadata } from "next";
import "./globals.css";
import { AuthUserProvider } from "@/lib/hooks/useAuthUser";
import LanguageProvider from "@/lib/i18n/LanguageProvider";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Burundi Today — Great Lakes region, in three voices",
    template: "%s · Burundi Today",
  },
  description:
    "Independent news for the Great Lakes region, reported in English, French, and Kirundi.",
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Burundi Today",
    title: "Burundi Today — Great Lakes region, in three voices",
    description:
      "Independent news for the Great Lakes region, reported in English, French, and Kirundi.",
    url: SITE_URL,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Burundi Today" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burundi Today — Great Lakes region, in three voices",
    description:
      "Independent news for the Great Lakes region, reported in English, French, and Kirundi.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthUserProvider>{children}</AuthUserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
