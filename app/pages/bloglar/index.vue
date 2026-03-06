<template>
  <div class="bloglar-page pa-4 pa-md-8">
    <h1 class="text-headline-large mb-6">Bloglar</h1>

    <v-row v-if="loading" dense>
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="image, article" class="blog-skeleton" />
      </v-col>
    </v-row>

    <div v-else-if="blogs.length === 0" class="text-center py-16">
      <v-icon icon="mdi-post" size="80" class="text-medium-emphasis mb-4" />
      <p class="text-body-large text-medium-emphasis">Henüz blog yazısı yok.</p>
    </div>

    <v-row v-else dense>
      <v-col v-for="blog in blogs" :key="blog.id" cols="12" sm="6" md="4" lg="3">
        <NuxtLink :to="`/bloglar/${blog.id}`" class="blog-card-link">
          <v-card variant="outlined" class="blog-card h-100">
            <v-img
              v-if="blog.cover_img"
              :src="blog.cover_img"
              :alt="blog.blog_title"
              aspect-ratio="1.5"
              cover
              class="blog-card__img"
            />
            <div v-else class="blog-card__placeholder">
              <v-icon icon="mdi-post" size="48" class="text-medium-emphasis" />
            </div>
            <v-card-title class="blog-card__title">{{ blog.blog_title }}</v-card-title>
            <p v-if="blog.blog_keywords?.length" class="blog-card__keywords">
              <v-chip
                v-for="kw in blog.blog_keywords.slice(0, 3)"
                :key="kw"
                size="x-small"
                variant="tonal"
                class="mr-1 mb-1"
              >
                {{ kw }}
              </v-chip>
            </p>
          </v-card>
        </NuxtLink>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Blog } from "~/interfaces";

useHead({ title: "Bloglar" });

const { fetchBlogs } = useBlogs();
const blogs = ref<Blog[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    blogs.value = await fetchBlogs();
  } catch (e) {
    console.error("Bloglar yüklenemedi:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.blog-card-link {
  text-decoration: none;
  display: block;
  height: 100%;
}
.blog-card {
  border: 1px solid rgb(var(--v-theme-primary) / 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.blog-card:hover {
  border-color: rgb(var(--v-theme-primary) / 0.4);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
}
.blog-card__img {
  border-radius: 0;
}
.blog-card__placeholder {
  aspect-ratio: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface));
}
.blog-card__title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.blog-card__keywords {
  padding: 0 16px 16px;
  margin: 0;
}
.blog-skeleton {
  border-radius: 16px;
  overflow: hidden;
}
</style>
