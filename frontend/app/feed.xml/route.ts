import { apiUrl } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import type { ArticleSummary } from "@/lib/types";

export const revalidate = 900; // regenerate at most every 15 minutes

const FEED_ITEM_COUNT = 30;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchLatestArticles(): Promise<ArticleSummary[]> {
  try {
    const res = await fetch(apiUrl(`/api/articles?limit=${FEED_ITEM_COUNT}&page=1`), {
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return []; // backend unreachable — ship an empty-but-valid feed rather than error
  }
}

export async function GET() {
  const articles = await fetchLatestArticles();

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/articles/${a.slug}`;
      const pubDate = new Date(a.publishedAt || a.createdAt).toUTCString();
      const author = a.author?.name ? `<dc:creator>${escapeXml(a.author.name)}</dc:creator>` : "";
      const image = a.coverImage?.secureUrl
        ? `<enclosure url="${escapeXml(a.coverImage.secureUrl)}" type="image/jpeg" />`
        : "";
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(a.dek)}</description>
      ${author}
      ${image}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Burundi Today</title>
    <link>${SITE_URL}</link>
    <description>Independent news for the Great Lakes region, reported in English, French, and Kirundi.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
