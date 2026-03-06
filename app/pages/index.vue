<template>
  <HomeHero />

  <section id="dergiler" class="pa-4 pa-md-6">
    <HomeDergilerSectionHeader
      :count="journals.length"
      :total-views="totalViews"
      :journals="journals"
    />
    <v-row v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="6" md="4" lg="3">
        <v-skeleton-loader type="image" class="journal-skeleton" />
      </v-col>
    </v-row>
    <div v-else-if="journals.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey">mdi-book-open-variant</v-icon>
      <p class="text-body-large mt-4 text-medium-emphasis">Henüz dergi yok</p>
    </div>
    <v-row v-else>
      <v-col v-for="journal in displayJournals" :key="journal.id" cols="6" md="4" lg="3">
        <CommonJournal_Card :journal="journal" />
      </v-col>
    </v-row>
    <div v-if="journals.length > 0" class="d-flex justify-center mt-6">
      <v-btn
        v-if="journals.length > HOME_MAX_ITEMS"
        to="/dergiler"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-right"
        rounded="lg"
      >
        Daha fazla
      </v-btn>
    </div>
  </section>

  <section v-if="blogs.length > 0" id="bloglar" class="pa-4 pa-md-6">
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
      <h2 class="text-headline-small mb-0">Bloglar</h2>
      <v-chip
        v-if="blogs.length > 0"
        size="small"
        variant="tonal"
        color="primary"
        density="compact"
      >
        {{ blogs.length }} blog
      </v-chip>
    </div>
    <v-row v-if="blogsLoading" dense>
      <v-col v-for="n in 4" :key="n" cols="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" class="blog-skeleton" />
      </v-col>
    </v-row>
    <div v-else-if="blogs.length === 0" class="text-center py-12">
      <v-icon icon="mdi-post" size="64" color="grey" />
      <p class="text-body-large mt-4 text-medium-emphasis">Henüz blog yok</p>
    </div>
    <v-row v-else dense>
      <v-col v-for="blog in displayBlogs" :key="blog.id" cols="6" md="4" lg="3">
        <NuxtLink :to="`/bloglar/${blog.id}`" class="blog-card-link">
          <v-card variant="tonal" class="blog-card h-100">
            <div class="blog-card__img-wrap">
              <v-img
                v-if="blog.cover_img"
                :src="blog.cover_img"
                :alt="blog.blog_title"
                aspect-ratio="1"
                cover
                class="blog-card__img rounded-lg"
              />
              <div v-else class="blog-card__placeholder rounded-lg">
                <v-icon icon="mdi-post" size="48" class="text-medium-emphasis" />
              </div>
            </div>
            <v-card-title class="blog-card__title">{{ blog.blog_title }}</v-card-title>
            <p v-if="blog.blog_keywords?.length" class="blog-card__keywords">
              <v-chip
                v-for="kw in blog.blog_keywords.slice(0, 3)"
                :key="kw"
                size="x-small"
                variant="flat"
                class="mr-1 mb-1"
              >
                {{ kw }}
              </v-chip>
            </p>
          </v-card>
        </NuxtLink>
      </v-col>
    </v-row>
    <div v-if="blogs.length > 0" class="d-flex justify-center mt-6">
      <v-btn
        v-if="blogs.length > HOME_MAX_ITEMS"
        to="/bloglar"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-right"
        rounded="lg"
      >
        Daha fazla
      </v-btn>
    </div>
  </section>

  <section v-if="works.length > 0" id="calismalar" class="pa-4 pa-md-6">
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
      <h2 class="text-headline-small mb-0">Çalışmalar</h2>
      <v-chip
        v-if="works.length > 0"
        size="small"
        variant="tonal"
        color="primary"
        density="compact"
      >
        {{ works.length }} çalışma
      </v-chip>
    </div>
    <v-row v-if="worksLoading" dense>
      <v-col v-for="n in 4" :key="n" cols="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" class="work-skeleton" />
      </v-col>
    </v-row>
    <div v-else-if="works.length === 0" class="text-center py-12">
      <v-icon icon="mdi-briefcase" size="64" color="grey" />
      <p class="text-body-large mt-4 text-medium-emphasis">Henüz çalışma yok</p>
    </div>
    <v-row v-else dense>
      <v-col v-for="work in displayWorks" :key="work.id" cols="6" md="4" lg="3">
        <NuxtLink :to="`/calismalar/${work.id}`" class="work-card-link">
          <v-card variant="outlined" class="work-card h-100">
            <div class="work-card__img-wrap">
              <v-img
                v-if="work.cover_img"
                :src="work.cover_img"
                :alt="work.work_title"
                aspect-ratio="1.2"
                cover
                class="work-card__img rounded-lg"
              />
              <div v-else class="work-card__placeholder rounded-lg">
                <v-icon icon="mdi-briefcase" size="48" class="text-medium-emphasis" />
              </div>
            </div>
            <v-card-title class="work-card__title">{{ work.work_title }}</v-card-title>
            <p v-if="work.work_keywords?.length" class="work-card__keywords">
              <v-chip
                v-for="kw in work.work_keywords.slice(0, 3)"
                :key="kw"
                size="x-small"
                variant="outlined"
                class="mr-1 mb-1"
              >
                {{ kw }}
              </v-chip>
            </p>
          </v-card>
        </NuxtLink>
      </v-col>
    </v-row>
    <div v-if="works.length > 0" class="d-flex justify-center mt-6">
      <v-btn
        v-if="works.length > HOME_MAX_ITEMS"
        to="/calismalar"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-right"
        rounded="lg"
      >
        Daha fazla
      </v-btn>
    </div>
  </section>

  <section id="iletisim" class="my-5 my-lg-10 my-xl-15">
    <HomeContactSection />
  </section>
</template>

<script setup lang="ts">
import type { Journal } from "~/interfaces";
import type { Blog } from "~/interfaces";
import type { Work } from "~/interfaces";

useHead({ title: "" });

const HOME_MAX_ITEMS = 8;

const { fetchJournals } = useJournals();
const { fetchBlogs } = useBlogs();
const { fetchWorks } = useWorks();
const journals = ref<Journal[]>([]);
const blogs = ref<Blog[]>([]);
const works = ref<Work[]>([]);
const loading = ref(true);
const blogsLoading = ref(true);
const worksLoading = ref(true);

const displayJournals = computed(() => journals.value.slice(0, HOME_MAX_ITEMS));
const displayBlogs = computed(() => blogs.value.slice(0, HOME_MAX_ITEMS));
const displayWorks = computed(() => works.value.slice(0, HOME_MAX_ITEMS));

const totalViews = computed(() =>
  journals.value.reduce((sum, j) => sum + (j.view_count ?? 0), 0)
);

onMounted(async () => {
  try {
    journals.value = await fetchJournals();
  } catch (e) {
    console.error("Dergiler yüklenemedi:", e);
  } finally {
    loading.value = false;
  }
  try {
    blogs.value = await fetchBlogs();
  } catch (e) {
    console.error("Bloglar yüklenemedi:", e);
  } finally {
    blogsLoading.value = false;
  }
  try {
    works.value = await fetchWorks();
  } catch (e) {
    console.error("Çalışmalar yüklenemedi:", e);
  } finally {
    worksLoading.value = false;
  }
});
</script>

<style scoped>
.journal-skeleton {
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  overflow: hidden;
}
.journal-skeleton :deep(.v-skeleton-loader__image) {
  height: 100%;
}
.blog-card-link,
.work-card-link {
  text-decoration: none;
  display: block;
  height: 100%;
}

/* Blog kartları - yumuşak, tonal, kare görsel */
.blog-card {
  border-radius: 20px;
  overflow: visible;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: none;
}
.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgb(var(--v-theme-primary) / 0.15);
}
.blog-card__img-wrap {
  padding: 12px 12px 0;
}
.blog-card__img {
  border-radius: 12px;
  overflow: hidden;
}
.blog-card__placeholder {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-primary) / 0.08);
}
.blog-card__title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  padding: 12px 16px 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.blog-card__keywords {
  padding: 0 16px 16px;
  margin: 0;
}

/* Çalışma kartları - çerçeveli, geniş görsel, farklı hover */
.work-card {
  border: 2px solid rgb(var(--v-theme-primary) / 0.25);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.work-card:hover {
  border-color: rgb(var(--v-theme-primary) / 0.5);
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.12);
}
.work-card__img-wrap {
  padding: 12px 12px 0;
}
.work-card__img {
  border-radius: 12px;
  overflow: hidden;
}
.work-card__placeholder {
  aspect-ratio: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface));
  border: 1px dashed rgb(var(--v-theme-primary) / 0.3);
}
.work-card__title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.work-card__keywords {
  padding: 0 16px 16px;
  margin: 0;
}
.blog-skeleton,
.work-skeleton {
  border-radius: 16px;
  overflow: hidden;
}
</style>
