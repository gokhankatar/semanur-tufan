<template>
  <div ref="headerRef" class="dergiler-header">
    <div
      class="dergiler-header__top d-flex align-center justify-space-between flex-wrap ga-3"
    >
      <h2 class="dergiler-header__title">
        <span v-for="(char, i) in titleChars" :key="i" class="dergiler-header__char">
          {{ char }}
        </span>
      </h2>
      <v-btn
        v-if="count > 0 && hasPdfUrls && display.mdAndDown.value"
        icon="mdi-download"
        variant="tonal"
        color="primary"
        size="small"
        :loading="downloadingAll"
        @click="downloadAll"
      />
      <v-btn
        v-else-if="count > 0 && hasPdfUrls"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-download"
        size="small"
        :loading="downloadingAll"
        @click="downloadAll"
      >
        Tüm dergileri indir
      </v-btn>
    </div>
    <div class="dergiler-header__meta d-flex align-center flex-wrap ga-2">
      <v-chip
        v-if="count > 0"
        size="small"
        variant="tonal"
        color="primary"
        density="compact"
      >
        {{ count }} dergi
      </v-chip>
      <v-chip
        v-if="totalViews > 0"
        size="small"
        variant="flat"
        color="primary"
        density="compact"
      >
        <v-icon icon="mdi-eye-outline" size="14" start />
        {{ totalViews }} görüntülenme
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { animate, stagger } from "animejs";

const props = defineProps<{
  count: number;
  totalViews?: number;
  journals?: Array<{
    id?: string;
    pdf_url?: string;
    journal_title?: string;
    journal_volume_number?: number;
  }>;
}>();

const display = useDisplay();
const titleChars = "Dergiler".split("");
const headerRef = ref<HTMLElement | null>(null);
const downloadingAll = ref(false);

const totalViews = computed(() => props.totalViews ?? 0);
const hasPdfUrls = computed(() => props.journals?.some((j) => j.pdf_url) ?? false);

const downloadAll = async () => {
  const journals = props.journals?.filter((j) => j.pdf_url) ?? [];
  if (journals.length === 0) return;

  downloadingAll.value = true;
  try {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    let hasError = false;

    for (const j of journals) {
      if (!j.pdf_url) continue;
      try {
        const res = await fetch(j.pdf_url, { mode: "cors" });
        if (!res.ok) throw new Error("Fetch failed");
        const blob = await res.blob();
        const name = `dergi-sayi-${j.journal_volume_number ?? "x"}.pdf`;
        zip.file(name, blob);
      } catch {
        hasError = true;
        break;
      }
    }

    if (!hasError && Object.keys(zip.files).length > 0) {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gokgerdan-dergileri.zip";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      for (const j of journals) {
        if (j.pdf_url) {
          const a = document.createElement("a");
          a.href = j.pdf_url;
          a.download = `dergi-sayi-${j.journal_volume_number ?? "x"}.pdf`;
          a.target = "_blank";
          a.click();
          await new Promise((r) => setTimeout(r, 300));
        }
      }
    }
  } catch (e) {
    console.error(e);
    for (const j of props.journals ?? []) {
      if (j.pdf_url) window.open(j.pdf_url, "_blank");
    }
  } finally {
    downloadingAll.value = false;
  }
};

onMounted(() => {
  if (!headerRef.value) return;
  const chars = headerRef.value.querySelectorAll(".dergiler-header__char");
  if (chars.length === 0) return;

  animate(chars, {
    opacity: [0.3, 1],
    y: [12, 0],
    duration: 800,
    delay: stagger(50),
    ease: "outQuad",
  });

  setTimeout(() => {
    animate(chars, {
      opacity: [1, 0.7, 1],
      scale: [1, 1.02, 1],
      duration: 2500,
      delay: stagger(40),
      ease: "inOutQuad",
      loop: true,
      alternate: true,
    });
  }, 900);
});
</script>

<style scoped>
.dergiler-header {
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary) / 0.06) 0%,
    rgb(var(--v-theme-primary) / 0.02) 50%,
    transparent 100%
  );
  border-radius: 16px;
  border: 1px solid rgb(var(--v-theme-primary) / 0.12);
}

.dergiler-header__title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

.dergiler-header__char {
  display: inline-block;
  opacity: 0.3;
  will-change: opacity, transform;
}

.dergiler-header__top {
  margin-bottom: 0.5rem;
}

.dergiler-header__meta {
  margin: 0;
}
</style>
