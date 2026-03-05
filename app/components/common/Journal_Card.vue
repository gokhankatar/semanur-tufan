<template>
  <NuxtLink
    :to="`/dergi/${journal.id}`"
    class="journal-card"
    :class="{ 'journal-card--mobile': display.smAndDown.value }"
    @mouseenter="setHover(!display.smAndDown.value)"
    @mouseleave="setHover(false)"
  >
    <div class="journal-card__image">
      <v-img
        :src="journal.journal_cover_img"
        :alt="journal.journal_title"
        cover
        class="journal-card__img rounded-lg"
      >
        <template #placeholder>
          <v-skeleton-loader type="image" />
        </template>
      </v-img>

      <!-- Desktop: overlay content (gradient, badge, title, publisher, summary on hover, keywords) -->
      <template v-if="!display.smAndDown.value">
        <div class="journal-card__gradient" />
        <div class="journal-card__badge">Sayı {{ journal.journal_volume_number }}</div>
        <div class="journal-card__overlay">
          <p
            class="journal-card__title text-white text-body-small text-lg-body-medium text-capitalize"
          >
            {{ truncatedTitle }}
          </p>
          <p class="journal-card__publisher">{{ journal.publisher_name }}</p>
          <Transition name="summary-fade">
            <div v-show="isHovered" class="journal-card__summary">
              {{ journal.journal_summary }}
            </div>
          </Transition>
          <div v-if="journal.journal_keywords?.length" class="journal-card__keywords">
            <span
              v-for="kw in journal.journal_keywords.slice(0, 3)"
              :key="kw"
              class="journal-card__tag"
            >
              {{ kw }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Mobile: title below image -->
    <div v-if="display.smAndDown.value" class="journal-card__below pa-1">
      <span class="journal-card__number">Sayı {{ journal.journal_volume_number }}</span>
      <p class="journal-card__title text-body-small text-capitalize">
        {{ truncatedTitle }}
      </p>
      <p class="journal-card__title text-label-small text-capitalize">
        {{ journal.publisher_name }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Journal } from "~/interfaces";

const display = useDisplay();

const props = defineProps<{
  journal: Journal;
}>();

const TITLE_MAX_LENGTH = 45;

const truncatedTitle = computed(() => {
  const t = props.journal.journal_title;
  return t.length > TITLE_MAX_LENGTH ? t.slice(0, TITLE_MAX_LENGTH) + "…" : t;
});

const isHovered = ref(false);
const setHover = (v: boolean) => {
  isHovered.value = v;
};
</script>

<style scoped>
.journal-card {
  display: block;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.journal-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.journal-card--mobile {
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
}

.journal-card--mobile:hover {
  transform: none;
  box-shadow: none;
}

/* Desktop: full image card with overlay */
.journal-card:not(.journal-card--mobile) {
  aspect-ratio: 3 / 4;
}

.journal-card__image {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.journal-card:not(.journal-card--mobile) .journal-card__image {
  position: absolute;
  inset: 0;
}

.journal-card__img {
  width: 100%;
  height: 100%;
}

.journal-card__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.6) 35%,
    rgba(0, 0, 0, 0.2) 60%,
    transparent 100%
  );
  pointer-events: none;
}

.journal-card__badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(105, 240, 174, 0.95);
  color: #0d1421;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  z-index: 2;
}

.journal-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem 1rem;
  z-index: 2;
}

.journal-card__title {
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.journal-card__publisher {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 0.5rem 0;
}

.journal-card__summary {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin: 0.5rem 0 0 0;
  max-height: 4.5em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.journal-card__keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.75rem;
}

.journal-card__tag {
  font-size: 0.6875rem;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.95);
}

/* Mobile: title below image */

.journal-card__number {
  display: inline-block;
  font-size: 0.625rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary) / 0.2);
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 0.35rem;
}

.journal-card__title--mobile {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  text-shadow: none;
}

/* Summary hover animation */
.summary-fade-enter-active,
.summary-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.summary-fade-enter-from,
.summary-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.summary-fade-enter-to,
.summary-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
