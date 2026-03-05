<template>  
    <section class="hero mb-12">
      <h1 class="text-h3 text-md-h2 font-weight-bold mb-2">
        Semanur Tufan
      </h1>
      <p class="text-title-large text-medium-emphasis">
        Kişisel dergi ve yazılar
      </p>
    </section>

    <section>
      <h2 class="text-h5 mb-4">Dergiler</h2>
      <div v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>
      <div v-else-if="journals.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey">mdi-book-open-variant</v-icon>
        <p class="text-body-large mt-4 text-medium-emphasis">Henüz dergi yok</p>
      </div>
      <v-row v-else>
        <v-col
          v-for="journal in journals"
          :key="journal.id"
          cols="6"
          md="4"
          lg="3"
        >
          <CommonJournal_Card :journal="journal" />
        </v-col>
      </v-row>
    </section>
</template>

<script setup lang="ts">
import type { Journal } from '~/interfaces'

const { fetchJournals } = useJournals()
const journals = ref<Journal[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    journals.value = await fetchJournals()
  } catch (e) {
    console.error('Dergiler yüklenemedi:', e)
  } finally {
    loading.value = false
  }
})
</script>
