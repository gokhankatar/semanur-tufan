<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

// Eski URL - yönlendir
onMounted(() => {
  navigateTo('/admin', { replace: true })
})
</script>
