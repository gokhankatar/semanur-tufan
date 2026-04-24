<template>
  <HomeHero />

  <section id="hakkimizda" class="home-about-teaser pa-4 pa-md-8" tabindex="-1">
    <div class="home-about-teaser__inner">
      <div class="home-about-teaser__head text-center">
        <div class="home-about-teaser__title-row">
          <span class="home-about-teaser__icon-wrap" aria-hidden="true">
            <v-icon icon="mdi-information-variant" size="22" class="home-about-teaser__icon" />
          </span>
          <h2 class="home-about-teaser__title">Hakkımızda</h2>
        </div>
        <div
          class="home-about-teaser__chips d-flex flex-wrap align-center justify-center ga-2 mb-3"
          role="list"
          aria-label="Dergi vizyonu"
        >
          <v-chip
            v-for="p in aboutPillars"
            :key="p.label"
            role="listitem"
            :prepend-icon="p.icon"
            variant="tonal"
            color="primary"
            size="small"
            density="comfortable"
            class="home-about-teaser__chip"
            rounded="pill"
          >
            {{ p.label }}
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mx-auto home-about-teaser__intro">
          Bu dört ilke üzerinde okuyucuyla buluşuyoruz. Editörden bir selam ve derginin ruhunu tam metinde
          okuyabilirsiniz.
        </p>
      </div>

      <div class="home-about-teaser__divider" aria-hidden="true" />

      <div class="home-about-teaser__actions">
        <NuxtLink to="/hakkimizda" class="home-about-teaser__cta home-about-teaser__cta--primary">
          <v-icon icon="mdi-book-open-page-variant" size="20" class="home-about-teaser__cta-ico" />
          <span class="home-about-teaser__cta-text">
            <span class="home-about-teaser__cta-line">Tam metni oku</span>
            <span class="home-about-teaser__cta-hint">Editör mektubu</span>
          </span>
          <v-icon icon="mdi-chevron-right" size="20" class="home-about-teaser__cta-arrow" />
        </NuxtLink>
        <NuxtLink to="/dergiler" class="home-about-teaser__cta home-about-teaser__cta--secondary">
          <v-icon icon="mdi-book-open-variant" size="18" class="home-about-teaser__cta-ico" />
          <span>Dergilere geç</span>
        </NuxtLink>
      </div>
    </div>
  </section>

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

const aboutPillars = [
  { label: "Orijinal", icon: "mdi-star-four-points" },
  { label: "Kalbe dokunan", icon: "mdi-heart-pulse" },
  { label: "İlham veren", icon: "mdi-weather-sunset" },
  { label: "Faydalı", icon: "mdi-hand-heart-outline" },
] as const;

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

/* Hero altı — #hakkimizda anchor (navbar / footer / #hakkimizda) */
.home-about-teaser {
  scroll-margin-top: 5.5rem;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.home-about-teaser__inner {
  position: relative;
  padding: 1.5rem 1.25rem 1.35rem;
  border-radius: 20px;
  border: 1px solid rgb(var(--v-theme-primary) / 0.18);
  background: linear-gradient(
    160deg,
    rgb(var(--v-theme-primary) / 0.08) 0%,
    rgb(var(--v-theme-surface) / 0.65) 38%,
    rgb(var(--v-theme-surface) / 0.4) 100%
  );
  box-shadow:
    0 1px 0 rgb(255 255 255 / 0.06) inset,
    0 20px 48px rgb(0 0 0 / 0.14);
  overflow: hidden;
}

.home-about-teaser__inner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 2px;
  border-radius: 0 0 4px 4px;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(var(--v-theme-primary) / 0.75),
    transparent
  );
  pointer-events: none;
}

.v-theme--light .home-about-teaser__inner {
  background: linear-gradient(
    165deg,
    rgb(var(--v-theme-primary) / 0.07) 0%,
    rgb(255 255 255 / 0.92) 45%,
    rgb(255 255 255 / 0.75) 100%
  );
  box-shadow:
    0 1px 0 rgb(255 255 255 / 0.9) inset,
    0 16px 40px rgb(49 86 250 / 0.07);
  border-color: rgb(var(--v-theme-primary) / 0.14);
}

.home-about-teaser__title-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.home-about-teaser__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgb(var(--v-theme-primary) / 0.12);
  border: 1px solid rgb(var(--v-theme-primary) / 0.22);
  box-shadow: 0 4px 14px rgb(var(--v-theme-primary) / 0.12);
}

.home-about-teaser__icon {
  color: rgb(var(--v-theme-primary));
}

.home-about-teaser__title {
  margin: 0;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
}

.home-about-teaser__intro {
  max-width: 32rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.home-about-teaser__chip {
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.01em;
  border: 1px solid rgb(var(--v-theme-primary) / 0.2) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.home-about-teaser__chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgb(var(--v-theme-primary) / 0.15);
}

.home-about-teaser__divider {
  height: 1px;
  margin: 1.15rem 0 1rem;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(var(--v-theme-on-surface) / 0.12) 20%,
    rgb(var(--v-theme-on-surface) / 0.12) 80%,
    transparent
  );
}

.home-about-teaser__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
}

@media (min-width: 480px) {
  .home-about-teaser__actions {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}

.home-about-teaser__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.home-about-teaser__cta:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.home-about-teaser__cta--primary {
  flex: 1;
  min-width: 0;
  padding: 0.65rem 1rem 0.65rem 0.85rem;
  border: 1px solid rgb(var(--v-theme-primary) / 0.45);
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary) / 0.22) 0%,
    rgb(var(--v-theme-primary) / 0.06) 100%
  );
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.1);
}

.v-theme--light .home-about-teaser__cta--primary {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary) / 0.2) 0%,
    rgb(var(--v-theme-primary) / 0.05) 100%
  );
  box-shadow: 0 4px 18px rgb(49 86 250 / 0.1);
}

.home-about-teaser__cta--primary:hover {
  transform: translateY(-1px);
  border-color: rgb(var(--v-theme-primary) / 0.65);
  box-shadow: 0 8px 24px rgb(var(--v-theme-primary) / 0.18);
}

.home-about-teaser__cta-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  flex: 1;
  min-width: 0;
}

.home-about-teaser__cta-line {
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.25;
}

.home-about-teaser__cta-hint {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.72;
  margin-top: 0.1rem;
}

.home-about-teaser__cta-ico {
  flex-shrink: 0;
  color: rgb(var(--v-theme-primary));
}

.home-about-teaser__cta-arrow {
  flex-shrink: 0;
  color: rgb(var(--v-theme-primary));
  opacity: 0.85;
  margin-left: auto;
}

.home-about-teaser__cta--secondary {
  padding: 0.5rem 0.9rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface) / 0.85);
  border: 1px solid rgb(var(--v-theme-on-surface) / 0.12);
  background: rgb(var(--v-theme-surface) / 0.35);
}

.home-about-teaser__cta--secondary:hover {
  transform: translateY(-1px);
  border-color: rgb(var(--v-theme-primary) / 0.35);
  color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary) / 0.06);
}

.home-about-teaser__cta--secondary .home-about-teaser__cta-ico {
  opacity: 0.75;
}

.home-about-teaser__cta--secondary:hover .home-about-teaser__cta-ico {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
}

@media (min-width: 480px) {
  .home-about-teaser__cta--primary {
    flex: 1 1 auto;
    max-width: 280px;
  }

  .home-about-teaser__cta--secondary {
    flex: 0 0 auto;
  }
}
</style>
