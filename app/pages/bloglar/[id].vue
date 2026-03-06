<template>
  <div class="blog-detail pa-4 pa-md-8">
    <div v-if="loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <template v-else-if="blog">
      <NuxtLink to="/bloglar" class="blog-detail__back mb-6 d-inline-flex align-center">
        <v-icon icon="mdi-arrow-left" size="small" />
        <span class="ml-2">Bloglara dön</span>
      </NuxtLink>

      <article class="blog-detail__article">
        <v-img
          v-if="blog.cover_img"
          :src="blog.cover_img"
          :alt="blog.blog_title"
          aspect-ratio="2"
          cover
          class="blog-detail__cover rounded-xl mb-6"
        />
        <div v-else class="blog-detail__cover-placeholder rounded-xl mb-6">
          <v-icon icon="mdi-post" size="80" class="text-medium-emphasis" />
        </div>

        <h1 class="text-headline-large mb-4">{{ blog.blog_title }}</h1>

        <div v-if="blog.blog_keywords?.length" class="d-flex flex-wrap ga-2 mb-6">
          <v-chip
            v-for="kw in blog.blog_keywords"
            :key="kw"
            size="small"
            variant="tonal"
          >
            {{ kw }}
          </v-chip>
        </div>

        <div class="blog-detail__content text-body-large" v-html="formattedContent" />
      </article>
    </template>

    <v-alert v-else type="error" class="ma-4">Blog yazısı bulunamadı.</v-alert>
  </div>
</template>

<script setup lang="ts">
import type { Blog } from "~/interfaces";

const route = useRoute();
const id = route.params.id as string;

const { fetchBlogById } = useBlogs();
const blog = ref<Blog | null>(null);
const loading = ref(true);

const formattedContent = computed(() => {
  if (!blog.value?.blog_content) return "";
  return blog.value.blog_content.replace(/\n/g, "<br />");
});

const config = useRuntimeConfig();
const siteUrl = (config.public.siteUrl as string) || "https://semanur-tufan.vercel.app";

useHead({
  title: () => blog.value?.blog_title ?? "Blog",
  meta: () => {
    const b = blog.value;
    const raw = b?.blog_content?.replace(/<[^>]+>/g, "").replace(/\n/g, " ").trim() || "";
    const desc = raw ? raw.slice(0, 160) + (raw.length > 160 ? "…" : "") : `${b?.blog_title} - Gökgerdan Dergisi Blog`;
    const img = b?.cover_img || `${siteUrl}/images/logo_big.png`;
    const url = `${siteUrl}/bloglar/${id}`;
    return [
      { name: "description", content: desc },
      { property: "og:title", content: b?.blog_title ?? "Blog" },
      { property: "og:description", content: desc },
      { property: "og:image", content: img },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: b?.blog_title ?? "Blog" },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: img },
    ];
  },
  link: () => [{ rel: "canonical", href: `${siteUrl}/bloglar/${id}` }],
});

onMounted(async () => {
  try {
    blog.value = await fetchBlogById(id);
  } catch (e) {
    console.error("Blog yüklenemedi:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.blog-detail__back {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-size: 0.9375rem;
}
.blog-detail__back:hover {
  opacity: 0.9;
}
.blog-detail__cover {
  max-height: 400px;
  object-fit: cover;
}
.blog-detail__cover-placeholder {
  aspect-ratio: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface));
}
.blog-detail__content {
  line-height: 1.8;
  max-width: 720px;
}
.blog-detail__content :deep(br) {
  display: block;
  content: "";
  margin-top: 0.5em;
}
</style>
