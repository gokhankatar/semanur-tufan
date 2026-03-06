<script setup lang="ts">
const config = useRuntimeConfig();
const siteUrl = (config.public.siteUrl as string) || "https://semanur-tufan.vercel.app";

useHead({
  titleTemplate: (title?: string) =>
    title ? `${title} | 🦜 Gökgerdan Dergisi` : "🦜 Gökgerdan Dergisi",
  htmlAttrs: { lang: "tr" },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content:
        "Gökgerdan Dergisi - Dergi yazarlığı, blog ve sanatsal çalışmalar. Semanur Tufan'ın edebiyat ve sanat dünyası.",
    },
    {
      name: "keywords",
      content:
        "Gökgerdan Dergisi, dergi, blog, edebiyat, sanat, Semanur Tufan, Türk edebiyatı",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Gökgerdan Dergisi" },
    { property: "og:image", content: `${siteUrl}/images/logo_big.png` },
    { property: "og:locale", content: "tr_TR" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  link: [{ rel: "sitemap", type: "application/xml", href: "/sitemap.xml" }],
});

// JSON-LD - Organization & WebSite (Google için yapısal veri)
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: "Gökgerdan Dergisi",
            url: siteUrl,
            logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo_big.png` },
          },
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: "Gökgerdan Dergisi",
            description: "Dergi yazarlığı, blog ve sanatsal çalışmalar",
            publisher: { "@id": `${siteUrl}/#organization` },
            inLanguage: "tr-TR",
          },
        ],
      }),
    },
  ],
});
</script>

<template>
  <v-app>
    <v-container class="main-container">
      <NuxtLayout />
    </v-container>
  </v-app>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* Scrollbar - arka plan temayla aynı, thumb gri */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(128, 128, 128, 0.5) rgb(var(--v-theme-background));
}
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
*::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-background));
}
*::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.5);
  border-radius: 4px;
}
*::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.65);
}

@media (min-width: 1800px) {
  .main-container {
    padding: 0 13rem 2rem 13rem;
  }
}

@media (min-width: 1200px) and (max-width: 1799px) {
  .main-container {
    padding: 0 7rem 2rem 7rem;
  }
}

@media (min-width: 900px) and (max-width: 1199px) {
  .main-container {
    padding: 0 3rem 2rem 3rem;
  }
}

@media (min-width: 600px) and (max-width: 899px) {
  .main-container {
    padding: 0 2rem 1rem 2rem;
  }
}

@media (max-width: 599px) {
  .main-container {
    padding: 0 1rem 1rem 1rem;
  }
}
</style>
