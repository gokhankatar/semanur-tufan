<template>
  <div class="calismalar-page pa-4 pa-md-8">
    <h1 class="text-headline-large mb-6">Çalışmalar</h1>

    <v-row v-if="loading" dense>
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="image, article" class="work-skeleton" />
      </v-col>
    </v-row>

    <div v-else-if="works.length === 0" class="text-center py-16">
      <v-icon icon="mdi-briefcase" size="80" class="text-medium-emphasis mb-4" />
      <p class="text-body-large text-medium-emphasis">Henüz çalışma yok.</p>
    </div>

    <v-row v-else dense>
      <v-col v-for="work in works" :key="work.id" cols="12" sm="6" md="4" lg="3">
        <NuxtLink :to="`/calismalar/${work.id}`" class="work-card-link">
          <v-card variant="outlined" class="work-card h-100">
            <v-img
              v-if="work.cover_img"
              :src="work.cover_img"
              :alt="work.work_title"
              aspect-ratio="1.5"
              cover
              class="work-card__img"
            />
            <div v-else class="work-card__placeholder">
              <v-icon icon="mdi-briefcase" size="48" class="text-medium-emphasis" />
            </div>
            <v-card-title class="work-card__title">{{ work.work_title }}</v-card-title>
            <p v-if="work.work_keywords?.length" class="work-card__keywords">
              <v-chip
                v-for="kw in work.work_keywords.slice(0, 3)"
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
import type { Work } from "~/interfaces";

useHead({ title: "Çalışmalar" });

const { fetchWorks } = useWorks();
const works = ref<Work[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    works.value = await fetchWorks();
  } catch (e) {
    console.error("Çalışmalar yüklenemedi:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.work-card-link {
  text-decoration: none;
  display: block;
  height: 100%;
}
.work-card {
  border: 1px solid rgb(var(--v-theme-primary) / 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.work-card:hover {
  border-color: rgb(var(--v-theme-primary) / 0.4);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
}
.work-card__img {
  border-radius: 0;
}
.work-card__placeholder {
  aspect-ratio: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface));
}
.work-card__title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.work-card__keywords {
  padding: 0 16px 16px;
  margin: 0;
}
.work-skeleton {
  border-radius: 16px;
  overflow: hidden;
}
</style>
