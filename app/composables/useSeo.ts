/**
 * Gökgerdan Dergisi - SEO composable
 * Türkçe içerik, Open Graph, Twitter Cards, JSON-LD
 */
const SITE_NAME = "Gökgerdan Dergisi";
const DEFAULT_DESC =
  "Gökgerdan Dergisi - Dergi yazarlığı, blog ve sanatsal çalışmalar. Semanur Tufan'ın edebiyat ve sanat dünyası.";
const DEFAULT_IMAGE = "/images/logo_big.png";

export function useSeo(options?: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
}) {
  const config = useRuntimeConfig();
  const route = useRoute();
  const siteUrl = (config.public.siteUrl as string) || "https://semanur-tufan.vercel.app";
  const fullUrl = options?.url ? `${siteUrl}${options.url}` : `${siteUrl}${route.path}`;
  const imageUrl = options?.image?.startsWith("http")
    ? options.image
    : `${siteUrl}${options?.image || DEFAULT_IMAGE}`;

  const meta = {
    title: options?.title,
    description: options?.description || DEFAULT_DESC,
    image: imageUrl,
    url: fullUrl,
    type: options?.type || "website",
    keywords: options?.keywords?.join(", ") || "Gökgerdan Dergisi, dergi, blog, edebiyat, sanat, Semanur Tufan",
  };

  useHead({
    title: meta.title,
    meta: [
      { name: "description", content: meta.description },
      { name: "keywords", content: meta.keywords },
      { name: "robots", content: options?.noIndex ? "noindex, nofollow" : "index, follow" },
      // Open Graph
      { property: "og:type", content: meta.type },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: meta.title || SITE_NAME },
      { property: "og:description", content: meta.description },
      { property: "og:image", content: meta.image },
      { property: "og:url", content: meta.url },
      { property: "og:locale", content: "tr_TR" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: meta.title || SITE_NAME },
      { name: "twitter:description", content: meta.description },
      { name: "twitter:image", content: meta.image },
    ],
    link: [{ rel: "canonical", href: meta.url }],
  });

  return meta;
}
