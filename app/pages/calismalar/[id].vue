<template>
  <div class="calisma-detail pa-4 pa-md-8">
    <div v-if="loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <template v-else-if="work">
      <NuxtLink to="/calismalar" class="calisma-detail__back mb-6 d-inline-flex align-center">
        <v-icon icon="mdi-arrow-left" size="small" />
        <span class="ml-2">Çalışmalara dön</span>
      </NuxtLink>

      <article class="calisma-detail__article">
        <v-img
          v-if="work.cover_img"
          :src="work.cover_img"
          :alt="work.work_title"
          aspect-ratio="2"
          cover
          class="calisma-detail__cover rounded-xl mb-6"
        />
        <div v-else class="calisma-detail__cover-placeholder rounded-xl mb-6">
          <v-icon icon="mdi-briefcase" size="80" class="text-medium-emphasis" />
        </div>

        <h1 class="text-headline-large mb-4">{{ work.work_title }}</h1>

        <div v-if="work.work_keywords?.length" class="d-flex flex-wrap ga-2 mb-6">
          <v-chip
            v-for="kw in work.work_keywords"
            :key="kw"
            size="small"
            variant="tonal"
          >
            {{ kw }}
          </v-chip>
        </div>

        <div class="calisma-detail__content text-body-large" v-html="formattedContent" />
      </article>
    </template>

    <v-alert v-else type="error" class="ma-4">Çalışma bulunamadı.</v-alert>
  </div>
</template>

<script setup lang="ts">
import type { Work } from "~/interfaces";

const route = useRoute();
const id = route.params.id as string;

const { fetchWorkById } = useWorks();
const work = ref<Work | null>(null);
const loading = ref(true);

const formattedContent = computed(() => {
  if (!work.value?.work_content) return "";
  return work.value.work_content.replace(/\n/g, "<br />");
});

const config = useRuntimeConfig();
const siteUrl = (config.public.siteUrl as string) || "https://semanur-tufan.vercel.app";

useHead({
  title: () => work.value?.work_title ?? "Çalışma",
  meta: () => {
    const w = work.value;
    const raw = w?.work_content?.replace(/<[^>]+>/g, "").replace(/\n/g, " ").trim() || "";
    const desc = raw ? raw.slice(0, 160) + (raw.length > 160 ? "…" : "") : `${w?.work_title} - Gökgerdan Dergisi Çalışmalar`;
    const img = w?.cover_img || `${siteUrl}/images/logo_big.png`;
    const url = `${siteUrl}/calismalar/${id}`;
    return [
      { name: "description", content: desc },
      { property: "og:title", content: w?.work_title ?? "Çalışma" },
      { property: "og:description", content: desc },
      { property: "og:image", content: img },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: w?.work_title ?? "Çalışma" },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: img },
    ];
  },
  link: () => [{ rel: "canonical", href: `${siteUrl}/calismalar/${id}` }],
});

onMounted(async () => {
  try {
    work.value = await fetchWorkById(id);
  } catch (e) {
    console.error("Çalışma yüklenemedi:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.calisma-detail__back {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-size: 0.9375rem;
}
.calisma-detail__back:hover {
  opacity: 0.9;
}
.calisma-detail__cover {
  max-height: 400px;
  object-fit: cover;
}
.calisma-detail__cover-placeholder {
  aspect-ratio: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface));
}
.calisma-detail__content {
  line-height: 1.8;
  max-width: 720px;
}
.calisma-detail__content :deep(br) {
  display: block;
  content: "";
  margin-top: 0.5em;
}
</style>
