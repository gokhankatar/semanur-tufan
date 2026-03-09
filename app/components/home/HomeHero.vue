<template>
  <section class="home-hero">
    <div class="home-hero__bg">
      <div class="home-hero__gradient" />
      <div class="home-hero__gradient-mesh" />
      <div class="home-hero__circles">
        <div class="home-hero__circle home-hero__circle--1" />
        <div class="home-hero__circle home-hero__circle--2" />
        <div class="home-hero__circle home-hero__circle--3" />
        <div class="home-hero__circle home-hero__circle--4" />
        <div class="home-hero__circle home-hero__circle--5" />
        <div class="home-hero__circle home-hero__circle--6" />
        <div class="home-hero__circle home-hero__circle--7" />
      </div>
      <div class="home-hero__noise" aria-hidden="true" />
    </div>

    <div class="home-hero__content">
      <h1 ref="titleRef" class="home-hero__title">
        <span class="home-hero__title-text">
          <span v-for="(char, i) in titleChars1" :key="'1-' + i" class="home-hero__char">{{ char }}</span>
        </span>
        <span class="home-hero__title-text">
          <span v-for="(char, i) in titleChars2" :key="'2-' + i" class="home-hero__char">{{ char }}</span>
        </span>
      </h1>
      <p class="home-hero__subtitle">Dergi yazarlığı · Blog · Sanatsal çalışmalar</p>
      <a
        :href="`mailto:${config.public.adminEmail}`"
        class="home-hero__email d-flex align-center justify-center ga-1"
      >
        <v-icon icon="mdi-email-outline" size="small" />
        {{ config.public.adminEmail }}
      </a>
      <div
        class="home-hero__chips d-flex align-center flex-wrap justify-center ga-1 ga-lg-2"
      >
        <v-chip
          variant="outlined"
          :size="display.smAndDown ? 'default' : 'x-large'"
          color="primary"
          text="Dergi"
        >
          <template #prepend>📖</template>
        </v-chip>
        <v-chip
          variant="outlined"
          :size="display.smAndDown ? 'default' : 'x-large'"
          color="primary"
          text="Yazı"
        >
          <template #prepend>✍️</template>
        </v-chip>
        <v-chip
          variant="outlined"
          :size="display.smAndDown ? 'default' : 'x-large'"
          color="primary"
          text="Resim"
        >
          <template #prepend>🎨</template>
        </v-chip>
      </div>
      <v-btn
        class="home-hero__eser-btn mt-4"
        color="primary"
        variant="elevated"
        prepend-icon="mdi-file-document-edit-outline"
        text="Eser Gönder"
        size="large"
        rounded="xl"
        @click="eserDialog = true"
      />
    </div>

    <CommonEserGonderDialog v-model="eserDialog" @submitted="onEserSubmitted" />

    <v-snackbar v-model="eserSnackbar" color="success" :timeout="4000" location="bottom" rounded="lg">
      Eseriniz başarıyla gönderildi. Teşekkür ederiz!
    </v-snackbar>

    <a href="#dergiler" class="home-hero__scroll">
      <span class="home-hero__scroll-text">Keşfet</span>
      <div class="home-hero__scroll-mouse">
        <div class="home-hero__scroll-wheel" />
      </div>
      <span class="home-hero__scroll-arrow">↓</span>
    </a>
  </section>
</template>

<script setup lang="ts">
import { animate, stagger } from "animejs";

const display = useDisplay();
const config = useRuntimeConfig();
const titleRef = ref<HTMLElement | null>(null);
const eserDialog = ref(false);

const eserSnackbar = ref(false);
const onEserSubmitted = () => {
  eserSnackbar.value = true;
};
const titleChars1 = "Gökgerdan".split("");
const titleChars2 = "Dergisi".split("");

onMounted(() => {
  if (!titleRef.value) return;
  const chars = titleRef.value.querySelectorAll(".home-hero__char");
  if (chars.length === 0) return;

  animate(chars, {
    opacity: [0.4, 1],
    scale: [0.95, 1],
    duration: 1200,
    delay: stagger(80),
    ease: "outQuad",
    loop: true,
    alternate: true,
  });
});
</script>

<style scoped>
.home-hero {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 100%;
  min-height: 100vh;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;
  max-width: 100vw;
  padding-top: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.home-hero__bg {
  position: absolute;
  inset: 0;
}

.home-hero__gradient {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(0deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(67.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(157.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(112.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(22.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(0deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(112.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(22.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), linear-gradient(90deg, rgb(40, 24, 113), rgb(159, 96, 150));
}

.v-theme--light .home-hero__gradient {
  background-image: repeating-linear-gradient(0deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(67.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(157.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(112.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(22.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(0deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(112.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(22.5deg, hsla(83, 0%, 53%, 0.03) 0px, hsla(83, 0%, 53%, 0.03) 1px, transparent 1px, transparent 12px), linear-gradient(90deg, rgba(40, 24, 113, 0.11), rgba(159, 96, 150, 0.47));
}

.home-hero__gradient-mesh {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgb(var(--v-theme-primary) / 0.1) 25%,
    transparent 50%,
    rgb(var(--v-theme-primary) / 0.08) 75%,
    transparent 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 25s ease-in-out infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.home-hero__circles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.home-hero__circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 1;
  animation: circleFloat 12s ease-in-out infinite;
}

.home-hero__circle--1 {
  width: min(90vw, 500px);
  height: min(90vw, 500px);
  top: -15%;
  left: -10%;
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--v-theme-primary) / 0.95) 0%,
    rgb(var(--v-theme-primary) / 0.6) 40%,
    rgb(var(--v-theme-primary) / 0.25) 70%,
    transparent 100%
  );
  animation-delay: 0s;
}

.home-hero__circle--2 {
  width: min(80vw, 450px);
  height: min(80vw, 450px);
  top: 30%;
  right: -15%;
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary) / 0.5) 40%,
    rgb(var(--v-theme-primary) / 0.15) 70%,
    transparent 100%
  );
  animation-delay: -2s;
}

.home-hero__circle--3 {
  width: min(75vw, 400px);
  height: min(75vw, 400px);
  bottom: -20%;
  left: 10%;
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary) / 0.55) 40%,
    rgb(var(--v-theme-primary) / 0.2) 70%,
    transparent 100%
  );
  animation-delay: -4s;
}

.home-hero__circle--4 {
  width: min(70vw, 350px);
  height: min(70vw, 350px);
  top: 50%;
  left: -8%;
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary) / 0.5) 40%,
    rgb(var(--v-theme-primary) / 0.18) 70%,
    transparent 100%
  );
  animation-delay: -6s;
}

.home-hero__circle--5 {
  width: min(72vw, 380px);
  height: min(72vw, 380px);
  top: 5%;
  right: 5%;
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary) / 0.55) 40%,
    rgb(var(--v-theme-primary) / 0.2) 70%,
    transparent 100%
  );
  animation-delay: -8s;
}

.home-hero__circle--6 {
  width: min(65vw, 320px);
  height: min(65vw, 320px);
  top: 60%;
  right: 15%;
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary) / 0.45) 40%,
    rgb(var(--v-theme-primary) / 0.15) 70%,
    transparent 100%
  );
  animation-delay: -3s;
}

.home-hero__circle--7 {
  width: min(60vw, 280px);
  height: min(60vw, 280px);
  bottom: 20%;
  right: -5%;
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary) / 0.4) 40%,
    rgb(var(--v-theme-primary) / 0.12) 70%,
    transparent 100%
  );
  animation-delay: -10s;
}

.v-theme--light .home-hero__circle {
  filter: blur(60px);
}

@keyframes circleFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(15%, -12%) scale(1.15);
  }
  50% {
    transform: translate(-12%, 15%) scale(0.9);
  }
  75% {
    transform: translate(10%, 10%) scale(1.08);
  }
}

.home-hero__noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.home-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.home-hero__title {
  font-size: clamp(2.75rem, 9vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin: 0 0 0.75rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1em;
}

.home-hero__title-text {
  display: inline-flex;
  color: rgb(var(--v-theme-on-background));
  text-shadow: 0 0 40px rgb(var(--v-theme-primary) / 0.3),
    0 0 80px rgb(var(--v-theme-primary) / 0.15);
}

.home-hero__char {
  display: inline-block;
  transform-origin: center bottom;
}

.v-theme--light .home-hero__title-text {
  text-shadow: 0 0 30px rgb(var(--v-theme-primary) / 0.25),
    0 0 60px rgb(var(--v-theme-primary) / 0.1);
}

.home-hero__subtitle {
  font-size: clamp(1.05rem, 2.5vw, 1.35rem);
  color: rgb(var(--v-theme-primary));
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.home-hero__email {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-background) / 0.7);
  margin: 0 0 1.25rem 0;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.home-hero__email:hover {
  color: rgb(var(--v-theme-primary));
}

.home-hero__chips {
  gap: 1rem;
}

.home-hero__eser-btn {
  box-shadow: 0 4px 20px rgb(var(--v-theme-primary) / 0.35);
}

.home-hero__eser-btn:hover {
  box-shadow: 0 6px 28px rgb(var(--v-theme-primary) / 0.45);
}

.home-hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--v-theme-on-background));
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  z-index: 1;
}

.home-hero__scroll:hover {
  opacity: 1;
}

.home-hero__scroll-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.home-hero__scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid currentColor;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.home-hero__scroll-wheel {
  width: 4px;
  height: 8px;
  background: currentColor;
  border-radius: 2px;
  animation: scrollWheel 2s ease-in-out infinite;
}

.home-hero__scroll-arrow {
  font-size: 1rem;
  animation: scrollArrow 1.5s ease-in-out infinite;
}

@keyframes scrollWheel {
  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(6px);
    opacity: 0.3;
  }
}

@keyframes scrollArrow {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(4px);
    opacity: 1;
  }
}
</style>
