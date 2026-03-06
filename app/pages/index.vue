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
      <v-col v-for="journal in journals" :key="journal.id" cols="6" md="4" lg="3">
        <CommonJournal_Card :journal="journal" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import type { Journal } from "~/interfaces";

const { fetchJournals } = useJournals();
const journals = ref<Journal[]>([]);
const loading = ref(true);

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
</style>
