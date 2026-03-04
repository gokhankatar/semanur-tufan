<template>
  <v-btn
    :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    variant="text"
    :ripple="false"
    :title="theme.global.current.value.dark ? 'Açık tema' : 'Koyu tema'"
    @click="theme.toggle()"
  />
</template>

<script setup lang="ts">
const theme = useTheme()
</script>
