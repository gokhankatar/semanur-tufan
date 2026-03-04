<template>
  <v-card
    class="journal-card overflow-hidden"
    variant="tonal"
    :to="`/dergi/${journal.id}`"
    hover
  >
    <div class="cover-wrapper">
      <v-img
        :src="journal.journal_cover_img"
        :alt="journal.journal_title"
        cover
        aspect-ratio="3/4"
        class="journal-cover"
      >
        <template #placeholder>
          <v-skeleton-loader type="image" />
        </template>
      </v-img>
      <div class="volume-badge">
        <span>Sayı {{ journal.journal_volume_number }}</span>
      </div>
    </div>
    <v-card-title class="text-body1 font-weight-medium line-clamp-2 pt-3">
      {{ journal.journal_title }}
    </v-card-title>
    <v-card-subtitle class="text-caption">
      {{ journal.publisher_name }}
    </v-card-subtitle>
    <v-card-text class="text-caption line-clamp-3">
      {{ journal.journal_summary }}
    </v-card-text>
    <v-card-actions v-if="journal.journal_keywords?.length" class="pt-0">
      <v-chip
        v-for="kw in journal.journal_keywords.slice(0, 3)"
        :key="kw"
        size="x-small"
        variant="outlined"
      >
        {{ kw }}
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Journal } from '~/interfaces'

defineProps<{
  journal: Journal
}>()
</script>

<style scoped>
.journal-card {
  transition: transform 0.2s ease;
}
.journal-card:hover {
  transform: translateY(-4px);
}
.cover-wrapper {
  position: relative;
}
.volume-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
