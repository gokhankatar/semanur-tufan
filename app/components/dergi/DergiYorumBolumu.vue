<template>
  <div class="dergi-yorum-bolumu">
    <div class="dergi-yorum-bolumu__header d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
      <h3 class="text-title-medium font-weight-medium d-flex align-center ga-2 mb-0">
        <v-icon icon="mdi-comment-multiple-outline" size="24" color="primary" />
        Yorumlar
        <span v-if="visibleCount > 0" class="text-body-small text-medium-emphasis">({{ visibleCount }})</span>
      </h3>
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-comment-plus"
        rounded="lg"
        @click="showForm = true"
      >
        Yorum Ekle
      </v-btn>
    </div>

    <!-- Yorum yok - boş durum -->
    <div
      v-if="!comments?.length"
      class="dergi-yorum-bolumu__empty"
      @click="showForm = true"
    >
      <v-icon icon="mdi-comment-outline" size="48" class="dergi-yorum-bolumu__empty-icon" />
      <p class="dergi-yorum-bolumu__empty-text">Henüz yorum yok</p>
      <p class="dergi-yorum-bolumu__empty-hint">İlk yorumu siz yapın!</p>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-comment-plus"
        rounded="lg"
        class="mt-2"
      >
        Yorum Ekle
      </v-btn>
    </div>

    <!-- Yorum listesi -->
    <div v-else class="dergi-yorum-listesi__items">
      <div
        v-for="c in visibleComments"
        :key="c.id"
        class="dergi-yorum-item"
      >
        <div class="dergi-yorum-item__header">
          <span class="dergi-yorum-item__author">{{ c.author_name }}</span>
          <span class="dergi-yorum-item__date">{{ formatDate(c.created_at) }}</span>
        </div>
        <p class="dergi-yorum-item__text">{{ c.comment_text }}</p>
      </div>
    </div>

    <!-- Yorum formu - mobilde dialog, masaüstünde inline -->
    <v-dialog
      v-if="isMobile"
      v-model="showForm"
      max-width="420"
      persistent
      scrollable
      transition="dialog-transition"
      content-class="dergi-yorum-dialog"
      @click:outside="showForm = false"
    >
      <v-card rounded="xl" class="overflow-hidden">
        <v-card-title class="d-flex align-center justify-space-between py-4">
          <span class="d-flex align-center ga-2">
            <v-icon icon="mdi-comment-plus-outline" color="primary" />
            Yorum Ekle
          </span>
          <v-btn icon variant="text" size="small" @click="showForm = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <DergiYorumForm
            :model-value="true"
            :journal-id="journalId"
            :journal-title="journalTitle"
            embedded
            @update:modelValue="showForm = false"
            @success="$emit('success'); showForm = false"
            @error="(msg: string) => $emit('error', msg)"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <DergiYorumForm
      v-else
      v-model="showForm"
      :journal-id="journalId"
      :journal-title="journalTitle"
      @success="$emit('success')"
      @error="(msg: string) => $emit('error', msg)"
    />
  </div>
</template>

<script setup lang="ts">
import type { JournalComment } from "~/interfaces/journalComment";

const props = defineProps<{
  comments: JournalComment[];
  journalId: string;
  journalTitle: string;
}>();

defineEmits<{
  success: [];
  error: [message: string];
}>();

const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);
const showForm = ref(false);

const visibleComments = computed(() =>
  (props.comments ?? []).filter((c) => c.visible)
);

const visibleCount = computed(() => visibleComments.value.length);

const formatDate = (iso: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};
</script>

<style scoped>
.dergi-yorum-bolumu {
  padding: 1.5rem 0;
}
.dergi-yorum-bolumu__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary) / 0.04) 0%, transparent 100%);
  border-radius: 16px;
  border: 1px dashed rgb(var(--v-theme-primary) / 0.2);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.dergi-yorum-bolumu__empty:hover {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary) / 0.08) 0%, rgb(var(--v-theme-primary) / 0.02) 100%);
  border-color: rgb(var(--v-theme-primary) / 0.35);
}
.v-theme--dark .dergi-yorum-bolumu__empty {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary) / 0.08) 0%, transparent 100%);
  border-color: rgb(var(--v-theme-primary) / 0.25);
}
.v-theme--dark .dergi-yorum-bolumu__empty:hover {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary) / 0.12) 0%, rgb(var(--v-theme-primary) / 0.04) 100%);
}
.dergi-yorum-bolumu__empty-icon {
  opacity: 0.5;
  margin-bottom: 0.5rem;
}
.dergi-yorum-bolumu__empty-text {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}
.dergi-yorum-bolumu__empty-hint {
  font-size: 0.875rem;
  opacity: 0.7;
  margin: 0;
}
.dergi-yorum-listesi__items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.dergi-yorum-item {
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary) / 0.18) 0%, rgb(var(--v-theme-primary) / 0.1) 100%);
  border-radius: 14px;
  border: 1px solid rgb(var(--v-theme-primary) / 0.3);
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.06);
}
.v-theme--dark .dergi-yorum-item {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary) / 0.28) 0%, rgb(var(--v-theme-primary) / 0.14) 100%);
  border-color: rgb(var(--v-theme-primary) / 0.35);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.3);
}
.dergi-yorum-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.dergi-yorum-item__author {
  font-weight: 600;
  font-size: 0.9375rem;
}
.dergi-yorum-item__date {
  font-size: 0.75rem;
  opacity: 0.65;
}
.dergi-yorum-item__text {
  font-size: 0.9375rem;
  line-height: 1.55;
  margin: 0;
  white-space: pre-wrap;
}

/* Mobil dialog - tam genişlik, sıkışmasın */
:deep(.dergi-yorum-dialog) {
  margin: 16px;
  max-width: calc(100% - 32px) !important;
}
</style>
