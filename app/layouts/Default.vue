<template>
  <v-app>
    <LayoutThemePersistence />
    <CommonInitial_Loading v-if="isLoading" />
    <template v-else>
      <LayoutNavbar />
      <main class="main-content">
        <NuxtPage />
      </main>
    </template>
  </v-app>
</template>

<script setup lang="ts">
const isLoading = ref(true)

onMounted(() => {
  nextTick().then(() => {
    setTimeout(() => {
      isLoading.value = false
    }, 400)
  })
})
</script>

<style scoped>
.main-content {
  padding-top: 65px;
  min-height: 100vh;
  background: rgb(var(--v-theme-background, 13 20 33));
}

.v-theme--light .main-content {
  background: rgb(var(--v-theme-background, 255 255 255));
}
</style>
