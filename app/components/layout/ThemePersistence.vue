<template>
  <div v-show="false" />
</template>

<script setup lang="ts">
const THEME_KEY = 'semanur-tufan-theme'

if (import.meta.client) {
  const theme = useTheme()

  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') {
    theme.change(saved)
  }

  watch(theme.global.name, (name) => {
    localStorage.setItem(THEME_KEY, name)
  }, { immediate: true })
}
</script>
