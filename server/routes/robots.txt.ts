/**
 * Dinamik robots.txt - siteUrl'e göre sitemap
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string) || "https://semanur-tufan.vercel.app";

  const robots = `User-Agent: *
Allow: /

# Sitemap - Google'ın tüm sayfaları bulması için
Sitemap: ${siteUrl}/sitemap.xml
`;

  setHeader(event, "Content-Type", "text/plain");
  setHeader(event, "Cache-Control", "public, max-age=86400");
  return robots;
});
