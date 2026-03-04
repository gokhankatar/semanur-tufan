<template>
  <div class="dergi-viewer pa-4">
    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <template v-else-if="journal">
      <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
        <div>
          <h1 class="text-h4 mb-1">{{ journal.journal_title }}</h1>
          <p class="text-body2 text-medium-emphasis">
            {{ journal.publisher_name }} · Sayı {{ journal.journal_volume_number }}
          </p>
        </div>
        <div class="d-flex gap-2">
          <v-btn
            variant="tonal"
            prepend-icon="mdi-download"
            :href="pdfDisplayUrl"
            target="_blank"
            download
          >
            İndir
          </v-btn>
          <v-btn
            variant="tonal"
            prepend-icon="mdi-share-variant"
            @click="shareJournal"
          >
            Paylaş
          </v-btn>
        </div>
      </div>

      <v-card variant="tonal" class="pdf-container">
        <div class="pdf-viewer-wrapper">
          <ClientOnly>
            <div class="pdf-page-wrapper" :class="{ 'pdf-page--flipping': isFlipping }">
              <VuePdfEmbed
                v-if="pdfDisplayUrl"
                :source="pdfDisplayUrl"
                :page="currentPage"
                class="pdf-page"
                @loaded="(pdf: { numPages: number }) => { pageCount = pdf.numPages }"
              />
            </div>
            <template #fallback>
              <v-progress-circular indeterminate color="primary" />
            </template>
          </ClientOnly>
        </div>
        <div class="pdf-controls pa-4 d-flex align-center justify-space-between flex-wrap gap-2">
          <v-btn
            icon
            variant="text"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="text-body2">
            Sayfa {{ currentPage }} / {{ pageCount || '...' }}
          </span>
          <v-btn
            icon
            variant="text"
            :disabled="currentPage >= (pageCount || 1)"
            @click="goToPage(currentPage + 1)"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-card>
    </template>

    <v-alert v-else type="error" class="ma-4">
      Dergi bulunamadı.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'
import type { Journal } from '~/interfaces'

const route = useRoute()
const { fetchJournalById } = useJournals()
const { playPageTurnSound } = usePageTurnSound()

const journal = ref<Journal | null>(null)
const loading = ref(true)
const currentPage = ref(1)
const pageCount = ref<number | null>(null)
const isFlipping = ref(false)

const goToPage = (page: number) => {
  const max = pageCount.value || 1
  const next = Math.max(1, Math.min(max, page))
  if (next !== currentPage.value) {
    isFlipping.value = true
    playPageTurnSound()
    currentPage.value = next
    setTimeout(() => { isFlipping.value = false }, 400)
  }
}

const pdfDisplayUrl = computed(() => {
  const url = journal.value?.pdf_url || ''
  if (!url) return ''
  if (url.startsWith('file://')) {
    return ''
  }
  if (url.startsWith('/')) {
    return url
  }
  return url
})

onMounted(async () => {
  const id = route.params.id as string
  try {
    journal.value = await fetchJournalById(id)
    if (journal.value && !pdfDisplayUrl.value) {
      console.warn('PDF URL geçersiz (file:// yolları tarayıcıda çalışmaz)')
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }

  const keyHandler = (e: KeyboardEvent) => {
    if (!journal.value) return
    if (e.key === 'ArrowLeft') goToPage(currentPage.value - 1)
    else if (e.key === 'ArrowRight') goToPage(currentPage.value + 1)
  }
  window.addEventListener('keydown', keyHandler)
  onUnmounted(() => window.removeEventListener('keydown', keyHandler))
})

const shareJournal = async () => {
  if (!journal.value) return
  const url = window.location.href
  const title = journal.value.journal_title
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        url,
        text: journal.value.journal_summary,
      })
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        await copyToClipboard(url)
      }
    }
  } else {
    await copyToClipboard(url)
  }
}

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
}
</script>

<style scoped>
.pdf-container {
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
}
.pdf-viewer-wrapper {
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.03);
}
.pdf-page-wrapper {
  perspective: 1200px;
  max-width: 100%;
}

.pdf-page {
  max-width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.pdf-page--flipping .pdf-page {
  animation: pageFlip 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.pdf-page :deep(canvas) {
  max-width: 100% !important;
  height: auto !important;
}

@keyframes pageFlip {
  0% {
    opacity: 1;
    transform: perspective(1200px) rotateY(0) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: perspective(1200px) rotateY(-15deg) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: perspective(1200px) rotateY(0) scale(1);
  }
}
</style>
