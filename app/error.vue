<template>
  <div class="error-page">
    <div class="error-page__content">
      <div class="error-page__icon-wrap">
        <v-icon
          :icon="errorIcon"
          size="120"
          class="error-page__icon"
        />
      </div>
      <h1 class="error-page__code">{{ error?.statusCode || 500 }}</h1>
      <p class="error-page__title">{{ errorTitle }}</p>
      <p class="error-page__message">{{ error?.message || 'Beklenmeyen bir hata oluştu.' }}</p>
      <div class="error-page__actions">
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          prepend-icon="mdi-home"
          rounded="lg"
          @click="handleGoHome"
        >
          Ana Sayfaya Dön
        </v-btn>
        <v-btn
          variant="tonal"
          size="large"
          prepend-icon="mdi-refresh"
          rounded="lg"
          @click="handleRetry"
        >
          Tekrar Dene
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const errorIcon = computed(() => {
  const code = props.error?.statusCode ?? 500
  if (code === 404) return 'mdi-file-search-outline'
  if (code === 403) return 'mdi-lock-off-outline'
  if (code >= 500) return 'mdi-server-off'
  return 'mdi-alert-circle-outline'
})

const errorTitle = computed(() => {
  const code = props.error?.statusCode ?? 500
  if (code === 404) return 'Sayfa Bulunamadı'
  if (code === 403) return 'Erişim Engellendi'
  if (code >= 500) return 'Sunucu Hatası'
  return 'Bir Hata Oluştu'
})

const handleGoHome = () => {
  clearError({ redirect: '/' })
}

const handleRetry = () => {
  clearError()
  window.location.reload()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgb(var(--v-theme-background));
}

.error-page__content {
  text-align: center;
  max-width: 480px;
  animation: errorFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.error-page__icon-wrap {
  margin-bottom: 1.5rem;
  animation: errorIconPulse 2s ease-in-out infinite;
}

.error-page__icon {
  color: rgb(var(--v-theme-primary));
  opacity: 0.9;
}

.error-page__code {
  font-size: clamp(4rem, 15vw, 8rem);
  font-weight: 800;
  line-height: 1;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-primary) / 0.6)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.04em;
}

.error-page__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgb(var(--v-theme-on-surface));
}

.error-page__message {
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.75;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.error-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

@keyframes errorFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes errorIconPulse {
  0%, 100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}
</style>
