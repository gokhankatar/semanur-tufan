<template>
  <div class="dergi-viewer pa-4 pa-md-6">
    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <template v-else-if="journal">
      <div class="dergi-header-wrapper mb-5">
        <div class="dergi-header" :class="{ 'dergi-header--mobile': isMobile }">
          <v-btn
            variant="text"
            prepend-icon="mdi-arrow-left"
            text="Geri dön"
            size="small"
            color="primary"
            class="dergi-header__back mb-3 mb-md-0"
            @click="router.back()"
          />
          <div class="dergi-header__main">
            <div class="dergi-header__info">
              <h1 class="dergi-header__title">{{ journal.journal_title }}</h1>
              <p class="dergi-header__meta text-medium-emphasis">
                {{ journal.publisher_name }} · Sayı {{ journal.journal_volume_number }}
              </p>
            </div>
            <div class="dergi-header__actions">
              <v-btn
                class="dergi-action-btn dergi-action-btn--download"
                variant="flat"
                :icon="display.mdAndDown.value ? 'mdi-download' : undefined"
                :prepend-icon="!display.mdAndDown.value ? 'mdi-download' : undefined"
                :href="pdfDisplayUrl"
                target="_blank"
                download
                :block="display.xs.value"
                :text="display.mdAndDown.value ? undefined : 'İndir'"
                rounded="lg"
                size="default"
              />
              <v-menu location="bottom" :close-on-content-click="true">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="dergi-action-btn dergi-action-btn--share"
                    variant="flat"
                    :block="display.xs.value"
                    :icon="display.mdAndDown.value ? 'mdi-share-variant' : undefined"
                    :prepend-icon="
                      !display.mdAndDown.value ? 'mdi-share-variant' : undefined
                    "
                    :text="display.mdAndDown.value ? undefined : 'Paylaş'"
                    rounded="lg"
                    size="default"
                  />
                </template>
                <v-card min-width="220" rounded="lg" class="share-menu-card">
                  <v-card-text class="pa-3">
                    <p class="text-body-small text-medium-emphasis mb-3">
                      Platformda paylaş
                    </p>
                    <div class="d-flex flex-wrap ga-2">
                      <v-btn
                        icon
                        variant="tonal"
                        size="small"
                        title="X (Twitter)"
                        @click="shareTo('twitter')"
                      >
                        <v-icon>mdi-twitter</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        variant="tonal"
                        size="small"
                        title="Facebook"
                        @click="shareTo('facebook')"
                      >
                        <v-icon>mdi-facebook</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        variant="tonal"
                        size="small"
                        title="WhatsApp"
                        @click="shareTo('whatsapp')"
                      >
                        <v-icon>mdi-whatsapp</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        variant="tonal"
                        size="small"
                        title="LinkedIn"
                        @click="shareTo('linkedin')"
                      >
                        <v-icon>mdi-linkedin</v-icon>
                      </v-btn>
                    </div>
                    <v-divider class="my-2" />
                    <v-btn
                      block
                      variant="text"
                      size="small"
                      prepend-icon="mdi-link-variant"
                      @click="copyShareLink"
                    >
                      Linki kopyala
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </div>
        </div>
      </div>

      <v-card
        variant="elevated"
        class="pdf-container rounded-lg overflow-hidden"
        elevation="0"
      >
        <div
          class="pdf-viewer-wrapper"
          @touchstart="onSwipeStart"
          @touchend="onSwipeEnd"
          @mousedown="onSwipeStart"
        >
          <ClientOnly>
            <div class="pdf-spread-wrap">
              <div
                v-show="pdfDisplayUrl && !pdfLoaded"
                class="pdf-skeleton"
                :class="{ 'pdf-skeleton--mobile': isMobile }"
              >
                <v-skeleton-loader type="image" class="pdf-skeleton__page" />
                <v-skeleton-loader
                  v-if="!isMobile"
                  type="image"
                  class="pdf-skeleton__page"
                />
              </div>
              <div
                class="pdf-spread"
                :class="{
                  'pdf-spread--flipping': isFlipping,
                  'pdf-spread--single': !rightPage,
                  'pdf-spread--mobile': isMobile,
                  'pdf-spread--hidden': pdfDisplayUrl && !pdfLoaded,
                }"
              >
                <div class="pdf-spread__page">
                  <VuePdfEmbed
                    v-if="pdfDisplayUrl && leftPage"
                    :source="pdfDisplayUrl"
                    :page="leftPage"
                    class="pdf-page"
                    @loaded="onPdfLoaded"
                  />
                </div>
                <div class="pdf-spread__page">
                  <VuePdfEmbed
                    v-if="pdfDisplayUrl && rightPage"
                    :source="pdfDisplayUrl"
                    :page="rightPage"
                    class="pdf-page"
                    @loaded="onPdfLoaded"
                  />
                </div>
              </div>
            </div>
            <template #fallback>
              <div class="pdf-skeleton pdf-skeleton--mobile">
                <v-skeleton-loader type="image" class="pdf-skeleton__page" />
              </div>
            </template>
          </ClientOnly>
        </div>
        <div class="pdf-controls pa-4" :class="{ 'pdf-controls--mobile': isMobile }">
          <div
            class="d-flex align-center justify-space-between flex-wrap ga-3 pdf-controls__row"
          >
            <div
              class="d-flex align-center ga-1 pdf-controls__nav pdf-controls__nav--prev"
            >
              <v-btn
                icon="mdi-page-first"
                variant="tonal"
                :size="isMobile ? 'default' : 'small'"
                rounded="lg"
                :disabled="!canGoPrev"
                title="İlk sayfa"
                class="pdf-control-btn"
                @click="goToFirstPage"
              />
              <v-btn
                icon="mdi-chevron-left"
                variant="tonal"
                :size="isMobile ? 'default' : 'small'"
                rounded="lg"
                :disabled="!canGoPrev"
                title="Önceki"
                class="pdf-control-btn"
                @click="goToPrevSpread"
              />
            </div>

            <div class="d-flex align-center ga-2 pdf-controls__center">
              <span class="text-body-small text-medium-emphasis pdf-controls__label">
                {{ rightPage ? `Sayfa ${leftPage}-${rightPage}` : `Sayfa ${leftPage}` }} /
                {{ pageCount || "..." }}
              </span>
              <div v-if="!isMobile" class="d-flex align-center ga-1">
                <v-text-field
                  v-model.number="pageInput"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details
                  label="Sayfa"
                  class="pdf-page-input text-label-small"
                  :min="1"
                  :max="pageCount || 1"
                  @keydown.enter="goToPageInput"
                />
                <v-btn
                  variant="tonal"
                  size="small"
                  rounded="lg"
                  append-icon="mdi-arrow-right"
                  @click="goToPageInput"
                >
                  Git
                </v-btn>
              </div>
            </div>

            <div
              class="d-flex align-center ga-1 pdf-controls__nav pdf-controls__nav--next"
            >
              <v-btn
                icon="mdi-chevron-right"
                variant="tonal"
                :size="isMobile ? 'default' : 'small'"
                rounded="lg"
                :disabled="!canGoNext"
                title="Sonraki"
                class="pdf-control-btn"
                @click="goToNextSpread"
              />
              <v-btn
                icon="mdi-page-last"
                variant="tonal"
                :size="isMobile ? 'default' : 'small'"
                rounded="lg"
                :disabled="!canGoNext"
                title="Son sayfa"
                class="pdf-control-btn"
                @click="goToLastPage"
              />
            </div>
          </div>
          <p
            class="text-caption text-medium-emphasis text-center mt-2 mb-0 pdf-keyboard-hint"
          >
            <template v-if="isMobile">Sürükleyerek sayfa değiştir</template>
            <template v-else>
              Klavye:
              <v-hotkey keys="arrowleft" variant="elevated" inline />
              <v-hotkey keys="arrowright" variant="elevated" inline />
              önceki/sonraki ·
              <v-hotkey keys="home" variant="elevated" inline />
              ilk ·
              <v-hotkey keys="end" variant="elevated" inline />
              son · Sürükle
            </template>
          </p>

          <div
            v-if="display.mdAndUp.value && pdfLoaded && pageThumbnails.length > 0"
            class="pdf-thumbnails pa-3"
          >
            <p class="text-caption text-medium-emphasis mb-2">Yakın sayfalar</p>
            <div class="pdf-thumbnails__strip">
              <button
                v-for="p in pageThumbnails"
                :key="p"
                type="button"
                class="pdf-thumbnail"
                :class="{
                  'pdf-thumbnail--active':
                    currentPage === p || (rightPage && rightPage === p),
                }"
                @click="goToPage(p)"
              >
                <VuePdfEmbed
                  :source="pdfDisplayUrl"
                  :page="p"
                  :width="72"
                  class="pdf-thumbnail__canvas"
                />
                <span class="pdf-thumbnail__label">{{ p }}</span>
              </button>
            </div>
          </div>
        </div>
      </v-card>

      <!-- Yorumlar -->
      <div v-if="journal" class="dergi-yorumlar mt-6" style="max-width: 1200px; margin-inline: auto">
        <DergiYorumBolumu
          :comments="journal.comments ?? []"
          :journal-id="journal.id!"
          :journal-title="journal.journal_title"
          @success="onYorumSuccess"
          @error="onYorumError"
        />
      </div>
    </template>

    <v-alert v-else type="error" class="ma-4"> Dergi bulunamadı. </v-alert>

    <v-snackbar
      v-model="copySnackbar"
      color="success"
      :timeout="2500"
      location="bottom"
      rounded="lg"
    >
      Link panoya kopyalandı
    </v-snackbar>
    <v-snackbar
      v-model="yorumSnackbar"
      :color="yorumSnackbarError ? 'error' : 'success'"
      :timeout="3500"
      location="bottom"
      rounded="lg"
      @update:model-value="(v) => !v && (yorumSnackbarError = false)"
    >
      {{ yorumSnackbarMsg }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { Journal } from "~/interfaces";

// pdf.js document kullanıyor - sunucuda yüklenmemesi için sadece client'ta lazy import
const VuePdfEmbed = defineAsyncComponent(() => import("vue-pdf-embed"));

definePageMeta({ ssr: false });

const route = useRoute();
const router = useRouter();
const display = useDisplay();
const { fetchJournalById, incrementJournalView } = useJournals();
const { playPageTurnSound } = usePageTurnSound();

const journal = ref<Journal | null>(null);
const loading = ref(true);
const currentPage = ref(1); // sol sayfa (spread'in başı)
const pageCount = ref<number | null>(null);
const isFlipping = ref(false);

const isMobile = computed(() => display.smAndDown.value);
const leftPage = computed(() => currentPage.value);
const rightPage = computed(() => {
  if (isMobile.value) return null;
  const max = pageCount.value || 1;
  const right = currentPage.value + 1;
  return right <= max ? right : null;
});

const pdfLoaded = ref(false);
const onPdfLoaded = (pdf: { numPages: number }) => {
  pageCount.value = pdf.numPages;
  pdfLoaded.value = true;
};

const goToPage = (page: number) => {
  const max = pageCount.value || 1;
  const next = Math.max(1, Math.min(max, page));
  if (next !== currentPage.value) {
    isFlipping.value = true;
    playPageTurnSound();
    currentPage.value = next;
    setTimeout(() => {
      isFlipping.value = false;
    }, 400);
  }
};

const goToPrevSpread = () => {
  const step = isMobile.value ? 1 : 2;
  goToPage(Math.max(1, currentPage.value - step));
};
const goToNextSpread = () => {
  const max = pageCount.value || 1;
  const step = isMobile.value ? 1 : 2;
  goToPage(Math.min(max, currentPage.value + step));
};
const goToFirstPage = () => goToPage(1);
const goToLastPage = () => {
  const max = pageCount.value || 1;
  const target = isMobile.value ? max : max % 2 === 1 ? max : max - 1;
  goToPage(target);
};
const canGoPrev = computed(() => currentPage.value > 1);
const canGoNext = computed(() => {
  const max = pageCount.value || 1;
  return isMobile.value ? currentPage.value < max : currentPage.value + 2 <= max;
});

/** Önceki 10 + mevcut + sonraki 10 (max 21) — sayfa değiştikçe güncellenir, alt alan daha dolu */
const pageThumbnails = computed(() => {
  const max = pageCount.value || 0;
  const cur = currentPage.value;
  if (max < 1) return [];
  const start = Math.max(1, cur - 10);
  const end = Math.min(max, cur + 10);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const SWIPE_THRESHOLD = 50;

const swipeStart = ref<{ x: number; y: number } | null>(null);

const getPointerCoords = (e: TouchEvent | MouseEvent): { x: number; y: number } => {
  if ("touches" in e) {
    const t = (e as TouchEvent).changedTouches?.[0] ?? (e as TouchEvent).touches[0];
    return t ? { x: t.clientX, y: t.clientY } : { x: 0, y: 0 };
  }
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
};

const onSwipeStart = (e: TouchEvent | MouseEvent) => {
  if ("touches" in e && e.touches.length > 1) return;
  swipeStart.value = getPointerCoords(e);
  if (!("touches" in e)) {
    document.addEventListener("mouseup", (ev: MouseEvent) => onSwipeEnd(ev), {
      once: true,
    });
  }
};

const onSwipeEnd = (e: TouchEvent | MouseEvent) => {
  if (!swipeStart.value) return;
  const end = getPointerCoords(e);
  const deltaX = end.x - swipeStart.value.x;
  const deltaY = end.y - swipeStart.value.y;
  swipeStart.value = null;

  if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
  if (Math.abs(deltaX) < Math.abs(deltaY)) return;

  if (deltaX > 0 && canGoPrev.value) goToPrevSpread();
  else if (deltaX < 0 && canGoNext.value) goToNextSpread();
};

const pageInput = ref<number | string>("");
const goToPageInput = () => {
  const max = pageCount.value || 1;
  const num =
    typeof pageInput.value === "number"
      ? pageInput.value
      : parseInt(String(pageInput.value), 10);
  if (!Number.isNaN(num) && num >= 1 && num <= max) {
    goToPage(num);
    pageInput.value = "";
  }
};

const config = useRuntimeConfig();
const siteUrl = (config.public.siteUrl as string) || "https://semanur-tufan.vercel.app";

useHead({
  title: () => journal.value?.journal_title ?? "Dergi",
  meta: () => {
    const j = journal.value;
    const desc =
      j?.journal_summary ||
      `${j?.journal_title} - Gökgerdan Dergisi Sayı ${j?.journal_volume_number}`;
    const img = j?.journal_cover_img || `${siteUrl}/images/logo_big.png`;
    const url = `${siteUrl}/dergi/${route.params.id}`;
    return [
      { name: "description", content: desc },
      { property: "og:title", content: j?.journal_title ?? "Dergi" },
      { property: "og:description", content: desc },
      { property: "og:image", content: img },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: j?.journal_title ?? "Dergi" },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: img },
    ];
  },
  link: () => [{ rel: "canonical", href: `${siteUrl}/dergi/${route.params.id}` }],
});

const pdfDisplayUrl = computed(() => {
  const url = journal.value?.pdf_url || "";
  if (!url) return "";
  if (url.startsWith("file://")) {
    return "";
  }
  if (url.startsWith("/")) {
    return url;
  }
  return url;
});

watch(pdfDisplayUrl, (url) => {
  if (!url) pdfLoaded.value = false;
});

onMounted(async () => {
  const id = route.params.id as string;
  try {
    journal.value = await fetchJournalById(id);
    if (journal.value && !pdfDisplayUrl.value) {
      console.warn("PDF URL geçersiz (file:// yolları tarayıcıda çalışmaz)");
    }
    if (journal.value?.id) {
      const viewedKey = `dergi-viewed-${id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, "1");
        await incrementJournalView(id);
        journal.value = {
          ...journal.value!,
          view_count: (journal.value.view_count ?? 0) + 1,
        };
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

  const keyHandler = (e: KeyboardEvent) => {
    if (!journal.value) return;
    if (e.key === "ArrowLeft") goToPrevSpread();
    else if (e.key === "ArrowRight") goToNextSpread();
    else if (e.key === "Home") goToFirstPage();
    else if (e.key === "End") goToLastPage();
  };
  window.addEventListener("keydown", keyHandler);
  onUnmounted(() => window.removeEventListener("keydown", keyHandler));
});

const shareData = computed(() => {
  if (!journal.value) return { url: "", title: "", text: "" };
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = journal.value.journal_title;
  const text = journal.value.journal_summary || `${title} - Gökgerdan Dergisi`;
  return { url, title, text };
});

const shareTo = (platform: "twitter" | "facebook" | "whatsapp" | "linkedin") => {
  const { url, title } = shareData.value;
  if (!url) return;
  const encodedUrl = encodeURIComponent(url);
  const whatsappText = encodeURIComponent(`${title}\n\n${url}`);
  const urls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(
      title
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${whatsappText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
  window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=500");
};

const copySnackbar = ref(false);
const yorumSnackbar = ref(false);
const yorumSnackbarError = ref(false);
const yorumSnackbarMsg = ref("");

const onYorumSuccess = () => {
  yorumSnackbarMsg.value = "Yorumunuz gönderildi. Onay sonrası yayınlanacaktır.";
  yorumSnackbar.value = true;
};
const onYorumError = (msg: string) => {
  yorumSnackbarMsg.value = msg;
  yorumSnackbarError.value = true;
  yorumSnackbar.value = true;
};

const copyShareLink = async () => {
  await copyToClipboard(shareData.value.url);
  copySnackbar.value = true;
};

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
};
</script>

<style scoped>
.share-menu-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.dergi-header-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}
.dergi-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.dergi-header__back {
  align-self: flex-start;
}
.dergi-header__main {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.dergi-header__info {
  flex: 1;
  min-width: 0;
}
.dergi-header__title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.35;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}
.dergi-header__meta {
  font-size: 0.875rem;
  margin: 0;
}
.dergi-header__actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}
.dergi-header__actions .dergi-action-btn {
  flex: 1 1 0;
  min-width: 110px;
}
.dergi-header--mobile .dergi-header__main {
  flex-direction: column;
  padding: 1rem;
}
.dergi-header--mobile .dergi-header__title {
  font-size: 1.125rem;
}
.dergi-header--mobile .dergi-header__actions {
  width: 100%;
  justify-content: stretch;
}
.dergi-header--mobile .dergi-header__actions .v-btn {
  flex: 1;
  min-height: 48px;
}

/* xs: butonlar tam genişlik */
@media (max-width: 599px) {
  .dergi-header__actions {
    flex-direction: column;
    width: 100%;
  }
  .dergi-header__actions .dergi-action-btn {
    width: 100% !important;
    flex: 1 1 auto;
    min-width: 100%;
  }
}

.dergi-action-btn {
  min-height: 44px !important;
  padding-inline: 1.25rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  color: rgb(255, 255, 255) !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15) !important;
  transition: transform 0.2s, box-shadow 0.2s !important;
}
.dergi-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
}
.dergi-action-btn--download {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%) !important;
}
.dergi-action-btn--download:hover {
  background: linear-gradient(135deg, #5558e3 0%, #7c3aed 50%, #9333ea 100%) !important;
}
.dergi-action-btn--share {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%) !important;
}
.dergi-action-btn--share:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0891b2 50%, #0d9488 100%) !important;
}
.dergi-action-btn :deep(.v-icon) {
  color: inherit !important;
}

.pdf-container {
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px;
}
.pdf-viewer-wrapper {
  min-height: 120px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 0 0 16px 16px;
  cursor: grab;
  user-select: none;
}
.pdf-viewer-wrapper:active {
  cursor: grabbing;
}
@media (max-width: 960px) {
  .dergi-viewer {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
  .pdf-container {
    max-width: 100%;
    border-radius: 12px;
  }
  .pdf-viewer-wrapper {
    padding: 0.75rem;
    min-height: 120px;
    border-radius: 0 0 12px 12px;
  }
  .pdf-spread {
    width: 100%;
    max-width: 100%;
  }
  .pdf-spread--mobile .pdf-spread__page {
    width: 100%;
    max-width: 100%;
  }
  .pdf-spread--mobile .pdf-page {
    width: 100% !important;
  }
  .pdf-controls--mobile {
    padding: 1rem !important;
  }
  .pdf-controls--mobile .pdf-controls__row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
  .pdf-controls--mobile .pdf-controls__center {
    flex: 1 1 auto;
    min-width: 0;
    justify-content: center;
  }
  .pdf-controls--mobile .pdf-control-btn {
    min-width: 48px !important;
    min-height: 48px !important;
  }
  .pdf-controls--mobile .pdf-controls__label {
    font-size: 0.875rem;
    white-space: nowrap;
  }
}
.pdf-controls {
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.pdf-controls__center {
  flex: 1;
  justify-content: center;
  min-width: 180px;
}
.pdf-page-input {
  max-width: 72px;
}
.pdf-page-input :deep(.v-field) {
  border-radius: 12px;
}
.pdf-spread-wrap {
  position: relative;
  width: 100%;
  min-height: 420px;
}
.pdf-skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: flex-start;
}
.pdf-skeleton--mobile {
  justify-content: center;
}
.pdf-skeleton--mobile .pdf-skeleton__page:last-child {
  display: none;
}
.pdf-skeleton__page {
  flex: 1;
  max-width: 50%;
  aspect-ratio: 3 / 4;
  min-width: 0;
  border-radius: 12px;
  overflow: hidden;
}
.pdf-skeleton__page :deep(.v-skeleton-loader__image) {
  height: 100%;
}
.pdf-skeleton--mobile .pdf-skeleton__page {
  max-width: 100%;
}
.pdf-spread--hidden {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.pdf-spread {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  perspective: 1200px;
}
.pdf-spread__page {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.pdf-spread--single .pdf-spread__page:first-child,
.pdf-spread--mobile .pdf-spread__page:first-child {
  flex: 1 1 100%;
}
.pdf-spread--single .pdf-spread__page:last-child,
.pdf-spread--mobile .pdf-spread__page:last-child {
  display: none;
}
.pdf-spread--mobile .pdf-spread__page:first-child .pdf-page {
  max-width: 100%;
  width: 100%;
}
.pdf-spread--mobile .pdf-page :deep(canvas) {
  width: 100% !important;
  max-width: 100% !important;
}
.pdf-page {
  width: 100%;
  max-width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.pdf-spread--flipping .pdf-page {
  animation: pageFlip 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.pdf-page :deep(canvas) {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  border-radius: 12px;
  display: block;
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

.pdf-thumbnails {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(0, 0, 0, 0.02);
}
.pdf-thumbnails__strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: thin;
}
.pdf-thumbnails__strip::-webkit-scrollbar {
  height: 6px;
}
.pdf-thumbnails__strip::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.pdf-thumbnail {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.pdf-thumbnail:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(var(--v-theme-primary), 0.4);
}
.pdf-thumbnail--active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}
.pdf-thumbnail__canvas {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.pdf-thumbnail__canvas :deep(canvas) {
  display: block;
  border-radius: 4px;
}
.pdf-thumbnail__label {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
}
</style>
