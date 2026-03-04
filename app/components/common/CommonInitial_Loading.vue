<template>
  <Transition name="loading-fade">
    <div
      v-if="visible"
      class="loading-overlay"
      :class="{ 'loading--light': isLight }"
    >
      <div class="loading-content">
        <div class="loading-bars">
          <span v-for="i in 5" :key="i" class="loading-bar" :style="{ animationDelay: `${(i - 1) * 0.1}s` }" />
        </div>
        <p class="loading-text">Yükleniyor</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(true)
const isLight = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('semanur-tufan-theme')
  isLight.value = saved === 'light'

  setTimeout(() => {
    visible.value = false
  }, 450)
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0D1421;
  transition: background-color 0.3s ease;
}

.loading--light {
  background-color: #FFFFFF;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loading-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 40px;
}

.loading-bar {
  width: 6px;
  height: 20px;
  background: #69F0AE;
  border-radius: 3px;
  animation: bar-pulse 0.6s ease-in-out infinite alternate;
}

.loading--light .loading-bar {
  background: #3156FA;
}

.loading-text {
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #D1D1D1;
  margin: 0;
}

.loading--light .loading-text {
  color: #424242;
}

@keyframes bar-pulse {
  from {
    transform: scaleY(0.4);
  }
  to {
    transform: scaleY(1);
  }
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.4s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
