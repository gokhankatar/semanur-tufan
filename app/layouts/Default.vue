<template>
  <div class="layout-wrap">
    <LayoutThemePersistence />
    <CommonInitial_Loading v-if="isLoading" />
    <template v-else>
      <LayoutNavbar />
      <main class="main-content" :class="{ 'main-content--home': route.path === '/' }">
        <NuxtPage />
      </main>
      <LayoutFooter />

      <!-- Admin giriş yapıldıysa ana sayfada admin paneline dön butonu -->
      <NuxtLink
        v-if="authStore.isAdmin && route.path === '/'"
        to="/admin"
        class="admin-float-btn"
      >
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-view-dashboard"
          class="admin-float-btn__inner"
        >
          Admin Paneline Dön
        </v-btn>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()
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
.layout-wrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  padding-top: 65px;
  flex: 1;
  background: rgb(var(--v-theme-background, 13 20 33));
}

.main-content--home {
  padding-top: 0;
}

.v-theme--light .main-content {
  background: rgb(var(--v-theme-background, 255 255 255));
}

.admin-float-btn {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 100;
  text-decoration: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.admin-float-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}
.admin-float-btn__inner {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
