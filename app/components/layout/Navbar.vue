<template>
  <header class="navbar">
    <div class="navbar__inner">
      <NuxtLink to="/" class="navbar__logo">
        <span class="navbar__logo-text">Semanur Tufan</span>
      </NuxtLink>

      <nav v-if="!display.mdAndDown.value" class="navbar__center">
        <div class="navbar__nav-list">
          <NuxtLink
            to="/"
            class="navbar__nav-link"
            :class="{ 'navbar__nav-link--active': route.path === '/' }"
          >
            <v-icon icon="mdi-home" size="small" />
            <span>Anasayfa</span>
          </NuxtLink>
          <NuxtLink
            to="/blogs"
            class="navbar__nav-link"
            :class="{ 'navbar__nav-link--active': route.path === '/blogs' }"
          >
            <v-icon icon="mdi-post" size="small" />
            <span>Bloglar</span>
          </NuxtLink>
          <NuxtLink
            to="/calismalar"
            class="navbar__nav-link"
            :class="{ 'navbar__nav-link--active': route.path === '/calismalar' }"
          >
            <v-icon icon="mdi-briefcase" size="small" />
            <span>Çalışmalar</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="navbar__actions d-flex align-center ga-2">
        <v-btn
          v-if="display.mdAndDown.value"
          :icon="mobileMenuOpen ? 'mdi-close' : 'mdi-menu'"
          variant="text"
          :ripple="false"
          :aria-label="mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'"
          class="navbar__menu-btn"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
        <template v-if="!display.mdAndDown.value">
          <v-btn
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            variant="text"
            :ripple="false"
            :title="isDark ? 'Açık tema' : 'Koyu tema'"
            @click="toggleTheme"
          />
          <v-btn
            to="/abone-ol"
            variant="flat"
            rounded="pill"
            :ripple="false"
            prepend-icon="mdi-email-newsletter"
            class="abone-btn"
          >
            Abone ol
          </v-btn>
        </template>
      </div>
    </div>

    <!-- Responsive full-screen menu -->
    <Teleport to="body">
      <Transition name="mobile-menu">
        <div
          v-if="display.mdAndDown.value && mobileMenuOpen"
          class="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigasyon menüsü"
          @click.self="mobileMenuOpen = false"
        >
          <v-btn
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            variant="text"
            :ripple="false"
            size="large"
            class="mobile-menu__theme"
            :title="isDark ? 'Açık tema' : 'Koyu tema'"
            @click="toggleTheme"
          />
          <v-btn
            icon="mdi-close"
            variant="text"
            :ripple="false"
            size="large"
            class="mobile-menu__close"
            aria-label="Menüyü kapat"
            @click="mobileMenuOpen = false"
          />
          <div class="mobile-menu__content">
            <nav class="mobile-menu__nav">
              <NuxtLink
                to="/"
                class="mobile-menu__link"
                :class="{ 'mobile-menu__link--active': route.path === '/' }"
                @click="mobileMenuOpen = false"
              >
                <v-icon icon="mdi-home" size="large" />
                <span>Anasayfa</span>
              </NuxtLink>
              <NuxtLink
                to="/blogs"
                class="mobile-menu__link"
                :class="{ 'mobile-menu__link--active': route.path === '/blogs' }"
                @click="mobileMenuOpen = false"
              >
                <v-icon icon="mdi-post" size="large" />
                <span>Bloglar</span>
              </NuxtLink>
              <NuxtLink
                to="/calismalar"
                class="mobile-menu__link"
                :class="{ 'mobile-menu__link--active': route.path === '/calismalar' }"
                @click="mobileMenuOpen = false"
              >
                <v-icon icon="mdi-briefcase" size="large" />
                <span>Çalışmalar</span>
              </NuxtLink>
            </nav>

            <div class="mobile-menu__actions">
              <v-btn
                to="/abone-ol"
                variant="flat"
                rounded="pill"
                :ripple="false"
                prepend-icon="mdi-email-newsletter"
                class="abone-btn"
                block
                @click="mobileMenuOpen = false"
              >
                Abone ol
              </v-btn>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </header>
</template>

<script setup lang="ts">
const display = useDisplay();
const route = useRoute();
const theme = useTheme();
const mobileMenuOpen = ref(false);

const isDark = computed(() => theme.global.current.value.dark);

const toggleTheme = () => {
  theme.toggle();
};

// Body scroll lock when mobile menu is open
watch(mobileMenuOpen, (open) => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = open ? "hidden" : "";
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgb(var(--v-theme-surface, 33 33 33));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.75rem 1.5rem;
}

.v-theme--light .navbar {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.navbar__inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.navbar__logo {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary, 105 240 174));
  text-decoration: none;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.navbar__logo-img {
  width: 36px;
  height: 36px;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.navbar__logo-text {
  font-weight: 700;
}

.navbar__logo:hover {
  opacity: 0.9;
}

.navbar__center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.navbar__nav-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.navbar__nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface, 209 209 209));
  text-decoration: none;
  border-radius: 8px;
  opacity: 0.85;
  transition: opacity 0.25s, color 0.25s, background 0.25s, transform 0.25s ease;
}

.navbar__nav-link:hover {
  opacity: 1;
  background: rgba(105, 240, 174, 0.12);
  color: rgb(var(--v-theme-primary, 105 240 174));
  transform: translateY(-2px);
}

.v-theme--light .navbar__nav-link:hover {
  background: rgba(105, 240, 174, 0.15);
}

.navbar__nav-link--active {
  opacity: 1;
  color: rgb(var(--v-theme-primary, 105 240 174));
}

.navbar__nav-link--admin {
  color: rgb(var(--v-theme-primary, 105 240 174));
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.abone-btn {
  background: linear-gradient(
    135deg,
    #69f0ae 0%,
    #4ade80 25%,
    #22c55e 50%,
    #4ade80 75%,
    #69f0ae 100%
  ) !important;
  background-size: 200% 200% !important;
  color: #0d1421 !important;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(105, 240, 174, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  animation: gradient-shift 3s ease infinite;
}

.abone-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 24px rgba(105, 240, 174, 0.5);
  animation-duration: 2s;
}

.abone-btn :deep(.v-btn__content) {
  color: inherit;
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.navbar__menu-btn {
  margin-inline-start: auto;
}

/* Responsive full-screen menu */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgb(var(--v-theme-surface, 33 33 33));
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  padding-top: 4rem;
  overflow-y: auto;
}

.mobile-menu__theme {
  position: absolute !important;
  top: 1rem;
  left: 1rem;
  z-index: 10;
}

.mobile-menu__close {
  position: absolute !important;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}

.mobile-menu__content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 380px;
  flex: 1;
  gap: 0;
  position: relative;
  z-index: 1;
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: auto;
  padding-top: 1rem;
}

.mobile-menu__link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface, 209 209 209));
  text-decoration: none;
  border-radius: 16px;
  opacity: 0.95;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.v-theme--light .mobile-menu__link {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.mobile-menu__link:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.v-theme--light .mobile-menu__link:hover {
  background: rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.mobile-menu__link .v-icon {
  flex-shrink: 0;
  font-size: 1.5rem;
}

.mobile-menu__link--active {
  opacity: 1;
  color: rgb(var(--v-theme-primary, 105 240 174));
  background: rgba(105, 240, 174, 0.12);
  border-color: rgba(105, 240, 174, 0.3);
}

.v-theme--light .mobile-menu__link--active {
  background: rgba(105, 240, 174, 0.15);
  border-color: rgba(105, 240, 174, 0.4);
}

.mobile-menu__link--admin {
  color: rgb(var(--v-theme-primary, 105 240 174));
}

.mobile-menu__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
}

.v-theme--light .mobile-menu__actions {
  border-top-color: rgba(0, 0, 0, 0.08);
}

/* Animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-active .mobile-menu__content,
.mobile-menu-leave-active .mobile-menu__content {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu__content,
.mobile-menu-leave-to .mobile-menu__content {
  transform: translateY(-20px) scale(0.98);
}

.mobile-menu-enter-to .mobile-menu__content,
.mobile-menu-leave-from .mobile-menu__content {
  transform: translateY(0) scale(1);
}

@media (max-width: 768px) {
  .navbar__inner {
    gap: 1rem;
  }
}
</style>
