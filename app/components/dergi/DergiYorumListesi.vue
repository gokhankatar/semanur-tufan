<template>
  <v-card v-if="comments.length > 0" variant="outlined" class="dergi-yorum-listesi rounded-lg overflow-hidden">
    <v-card-title class="text-body-large font-weight-medium py-3 d-flex align-center ga-2">
      <v-icon icon="mdi-comment-multiple-outline" size="20" />
      Yorumlar ({{ visibleCount }})
    </v-card-title>
    <v-card-text class="pt-0">
      <div class="dergi-yorum-listesi__items">
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
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { JournalComment } from "~/interfaces/journalComment";

const props = defineProps<{
  comments: JournalComment[];
}>();

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
.dergi-yorum-listesi {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.dergi-yorum-listesi__items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.dergi-yorum-item {
  padding: 0.75rem 1rem;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.dergi-yorum-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.dergi-yorum-item__author {
  font-weight: 600;
  font-size: 0.875rem;
}
.dergi-yorum-item__date {
  font-size: 0.75rem;
  opacity: 0.7;
}
.dergi-yorum-item__text {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}
</style>
