<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <span class="site-footer__name">Gökgerdan Dergisi</span>
        <span class="site-footer__tagline">Dergi · Yazı · Sanat</span>
      </div>
      <div class="site-footer__links">
        <v-btn
          href="https://x.com/gokgerdandergi?s=11"
          target="_blank"
          rel="noopener noreferrer"
          icon="mdi-twitter"
          variant="text"
          color="primary"
          size="small"
          class="site-footer__btn"
          aria-label="X (Twitter)"
        />
        <v-btn
          href="https://www.instagram.com/gokgerdandergisi?igsh=anM2MzJ6M3lic2c3"
          target="_blank"
          rel="noopener noreferrer"
          icon="mdi-instagram"
          variant="text"
          color="primary"
          size="small"
          class="site-footer__btn"
          aria-label="Instagram"
        />
        <v-btn
          :href="`mailto:${config.public.adminEmail}`"
          icon="mdi-email-outline"
          variant="text"
          color="primary"
          size="small"
          class="site-footer__btn"
          :aria-label="config.public.adminEmail"
        />
      </div>
      <p class="site-footer__copy">
        {{ config.public.adminEmail }} · © {{ new Date().getFullYear() }} Gökgerdan Dergisi
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 2.5rem 1.5rem;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgb(var(--v-theme-primary) / 0.2);
}

.v-theme--light .site-footer {
  border-top-color: rgb(var(--v-theme-primary) / 0.12);
}

.site-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.site-footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.site-footer__name {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.v-theme--light .site-footer__name {
  color: rgba(0, 0, 0, 0.87);
}

.site-footer__tagline {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.75);
}

.v-theme--light .site-footer__tagline {
  color: rgba(0, 0, 0, 0.6);
}

.site-footer__links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.site-footer__btn {
  min-width: 40px;
}

.site-footer__copy {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--light .site-footer__copy {
  color: rgba(0, 0, 0, 0.6);
}
</style>
