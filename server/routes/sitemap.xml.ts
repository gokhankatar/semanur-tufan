/**
 * Sitemap - Google aramada görünürlük için
 * Dinamik içerik için: build sırasında veya cron ile güncellenebilir
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string) || "https://semanur-tufan.vercel.app";

  const pages = [
    { url: "/", changefreq: "weekly", priority: 1 },
    { url: "/dergiler", changefreq: "weekly", priority: 0.9 },
    { url: "/bloglar", changefreq: "weekly", priority: 0.9 },
    { url: "/calismalar", changefreq: "weekly", priority: 0.9 },
    { url: "/abone-ol", changefreq: "monthly", priority: 0.7 },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of pages) {
    xml += `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  xml += "\n</urlset>";

  setHeader(event, "Content-Type", "application/xml");
  setHeader(event, "Cache-Control", "public, max-age=3600");
  return xml;
});
