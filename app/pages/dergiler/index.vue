<template>
  <div class="dergiler-page pa-4 pa-md-8">
    <h1 class="text-headline-large mb-6">Dergiler</h1>

    <v-row v-if="loading" dense>
      <v-col v-for="n in 8" :key="n" cols="6" md="4" lg="3">
        <v-skeleton-loader type="image" class="journal-skeleton" />
      </v-col>
    </v-row>

    <div v-else-if="journals.length === 0" class="text-center py-16">
      <v-icon icon="mdi-book-open-variant" size="80" class="text-medium-emphasis mb-4" />
      <p class="text-body-large text-medium-emphasis">Henüz dergi yok.</p>
    </div>

    <v-row v-else dense>
      <v-col v-for="journal in journals" :key="journal.id" cols="6" md="4" lg="3">
        <CommonJournal_Card :journal="journal" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Journal } from "~/interfaces";

useHead({ title: "Dergiler" });

const { fetchJournals } = useJournals();
const journals = ref<Journal[]>([]);
const loading = ref(true);

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
