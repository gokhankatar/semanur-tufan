<template>
  <article class="about-page">
    <div class="about-page__bg" aria-hidden="true" />

    <header class="about-hero">
      <p class="about-hero__eyebrow">
        <v-icon icon="mdi-feather" size="small" class="about-hero__eyebrow-icon" />
        Gökgerdan Dergisi
      </p>
      <h1 class="about-hero__title">Hakkımızda</h1>
      <p class="about-hero__lead text-medium-emphasis">
        Dijital sayfalarda okuyucuyla buluşan bir derginin sözü: orijinal, kalbe dokunan, ilham veren, faydalı.
      </p>
      <div
        class="about-pillars d-flex flex-wrap align-center justify-center ga-2"
        role="list"
        aria-label="Dergi vizyonu"
      >
        <v-chip
          v-for="p in aboutPillars"
          :key="p.label"
          role="listitem"
          :prepend-icon="p.icon"
          variant="tonal"
          color="primary"
          size="small"
          density="comfortable"
          class="about-pillars__chip"
          rounded="pill"
        >
          {{ p.label }}
        </v-chip>
      </div>
    </header>

    <div class="about-body">
      <v-card variant="outlined" class="about-card" rounded="xl">
        <v-card-text class="about-card__inner pa-6 pa-md-10">
          <p class="about-greeting">Sevgili dostlar!</p>

          <p class="about-prose">
            Dijital ortamda ilk defa okuyucuyla buluşan <strong>Gökgerdan Dergisi</strong>&rsquo;nin genel yayın
            yönetmeni ve editörü olarak sizlere hayalimizi sunmak istiyorum. Dergimizi kısaca tanıtmak istersem:
            <em>orijinal</em>, <em>kalbe dokunan</em>, <em>ilham veren</em>, <em>faydalı</em> bir dergi
            hedefliyoruz. Bu dört komponenti dergimizin içerik ve vizyonunun şartları olarak belirledik. Böylece
            Gökgerdan Dergisi&rsquo;ni her okumak istediğinizde nelerle karşılaşacağınızı merak ederek heyecan
            duyuyoruz.
          </p>

          <blockquote class="about-quote">
            <span class="about-quote__mark" aria-hidden="true">&ldquo;</span>
            Heyecan duymaksa bir sanattır. Bizce yaşamak bir sanata dönüşebilir.
            <span class="about-quote__mark about-quote__mark--end" aria-hidden="true">&rdquo;</span>
          </blockquote>

          <p class="about-prose">
            Sanatçı dünyanın önlenemez keşmekeşine dışarıdan bakan bir gözlemci değil midir? Yağmur yağarken
            kaçmayan, üstelik şemsiyesinin olmayışını da hiç dert etmeden başını göğe kaldıran bir adam gibi…
            Yahut akan bir nehir başının üstünde çağlarken yerinden kıpırdamayan bir taş gibi… Yahut ince bir dala
            kibarca konmuş etrafı seyreden küçük mavi gerdanlı bir kuş gibi… Öylece durup gözlemleyip, sonrasında
            hissederek özümseyip, nihayet kendi benliğinde dönüştürüp ortaya &ldquo;güzeli&rdquo; çıkaran kişidir
            sanatçı.
          </p>

          <div class="about-divider" aria-hidden="true">
            <span class="about-divider__line" />
            <v-icon icon="mdi-bird" class="about-divider__icon" />
            <span class="about-divider__line" />
          </div>

          <p class="about-prose">
            Bizler bu dergide hayatın içinde basit ve sıradan gözüken şeylere dikkatle ve özenle bakıp sizlere de
            göstermeyi hedefliyoruz. Bilimsel bir bilginin şaşırtıcı tarafı ya da sevginin bencilliği nasıl da eritip
            yok edebileceğini bir gökgerdan gibi şakıyarak anlatabilmek istiyoruz.
          </p>

          <p class="about-prose about-prose--closing">
            En nihayetinde göğsünde gök taşıyan bir kuş gibi sanatçı ve yazarlarımızın göğüslerinde taşıdıkları
            nefesi ve kuş seslerini okuyucularımıza sunacakları için onlara şimdiden teşekkür ederiz. Bu güzel
            yolculuğa en az yol kadar güzel yol arkadaşlarıyla çıkarken, uğradığımız gönüllerinizde
            misafirperverliğiniz için siz okuyucularımıza şimdiden gönülden teşekkürler!
          </p>

          <footer class="about-signature">
            <span class="about-signature__line" aria-hidden="true" />
            <p class="about-signature__name">Semanur Tufan</p>
            <p class="about-signature__role text-medium-emphasis">Genel yayın yönetmeni &amp; editör</p>
          </footer>
        </v-card-text>
      </v-card>
    </div>
  </article>
</template>

<script setup lang="ts">
const aboutPillars = [
  { label: "Orijinal", icon: "mdi-star-four-points" },
  { label: "Kalbe dokunan", icon: "mdi-heart-pulse" },
  { label: "İlham veren", icon: "mdi-weather-sunset" },
  { label: "Faydalı", icon: "mdi-hand-heart-outline" },
] as const;

useHead({
  title: "Hakkımızda",
  meta: [
    {
      name: "description",
      content:
        "Gökgerdan Dergisi: orijinal, kalbe dokunan, ilham veren ve faydalı içerik vizyonu. Genel yayın yönetmeni ve editör Semanur Tufan'dan bir selam.",
    },
  ],
});
</script>

<style scoped>
.about-page {
  position: relative;
  padding: 1.5rem 0 3.5rem;
  overflow: hidden;
}

.about-page__bg {
  position: absolute;
  inset: -20% -10% auto;
  height: 55%;
  max-height: 520px;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgb(var(--v-theme-primary) / 0.14), transparent 55%),
    radial-gradient(ellipse 50% 40% at 90% 20%, rgb(var(--v-theme-primary) / 0.08), transparent 50%),
    radial-gradient(ellipse 40% 35% at 10% 30%, rgb(var(--v-theme-primary) / 0.06), transparent 45%);
  pointer-events: none;
  z-index: 0;
}

.v-theme--light .about-page__bg {
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgb(var(--v-theme-primary) / 0.12), transparent 55%),
    radial-gradient(ellipse 50% 40% at 85% 15%, rgb(49 86 250 / 0.08), transparent 50%);
}

.about-hero,
.about-body {
  position: relative;
  z-index: 1;
}

.about-hero {
  text-align: center;
  max-width: 40rem;
  margin: 0 auto 2.25rem;
  padding: 0 0.5rem;
}

.about-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 0.75rem;
}

.about-hero__eyebrow-icon {
  opacity: 0.9;
}

.about-hero__title {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 1rem;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-on-surface)) 0%,
    rgb(var(--v-theme-on-surface) / 0.85) 45%,
    rgb(var(--v-theme-primary)) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.v-theme--light .about-hero__title {
  background: linear-gradient(135deg, #1a1d26 0%, #3156fa 95%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.about-hero__lead {
  font-size: 1.0625rem;
  line-height: 1.65;
  margin: 0 auto 1.5rem;
  max-width: 36rem;
}

.about-pillars__chip {
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.01em;
  border: 1px solid rgb(var(--v-theme-primary) / 0.2) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.about-pillars__chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgb(var(--v-theme-primary) / 0.15);
}

.about-pillars__chip :deep(.v-chip__prepend .v-icon) {
  color: rgb(var(--v-theme-primary));
  opacity: 0.95;
}

.about-body {
  max-width: 52rem;
  margin: 0 auto;
  padding: 0 0.25rem;
}

.about-card {
  border-color: rgb(var(--v-theme-primary) / 0.22);
  background: rgb(var(--v-theme-surface) / 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgb(255 255 255 / 0.04) inset;
}

.v-theme--light .about-card {
  background: rgb(255 255 255 / 0.72);
  box-shadow: 0 8px 32px rgba(49, 86, 250, 0.08);
}

.about-card__inner {
  border-radius: inherit;
}

.about-greeting {
  font-size: 1.25rem;
  font-weight: 700;
  font-style: italic;
  color: rgb(var(--v-theme-primary));
  margin: 0 0 1.25rem;
}

.about-prose {
  font-size: 1.0625rem;
  line-height: 1.85;
  color: rgb(var(--v-theme-on-surface) / 0.92);
  margin: 0 0 1.35rem;
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
}

.about-prose:last-of-type {
  margin-bottom: 0;
}

.about-prose--closing {
  margin-bottom: 2rem !important;
}

.about-prose strong {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 700;
}

.about-prose em {
  font-style: normal;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.about-quote {
  position: relative;
  margin: 1.75rem 0 1.75rem;
  padding: 1.25rem 1.25rem 1.25rem 1.5rem;
  border-left: 4px solid rgb(var(--v-theme-primary));
  border-radius: 0 12px 12px 0;
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-primary) / 0.12) 0%,
    rgb(var(--v-theme-primary) / 0.02) 100%
  );
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.65;
  font-style: italic;
  color: rgb(var(--v-theme-on-surface) / 0.95);
}

.v-theme--light .about-quote {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary) / 0.14) 0%, transparent 100%);
}

.about-quote__mark {
  color: rgb(var(--v-theme-primary));
  opacity: 0.65;
  font-size: 1.5rem;
  line-height: 0;
  vertical-align: -0.15em;
}

.about-quote__mark--end {
  margin-left: 0.15em;
}

.about-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.about-divider__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(var(--v-theme-primary) / 0.45) 30%,
    rgb(var(--v-theme-primary) / 0.45) 70%,
    transparent
  );
}

.about-divider__icon {
  color: rgb(var(--v-theme-primary));
  opacity: 0.85;
  flex-shrink: 0;
}

.about-signature {
  text-align: center;
  padding-top: 0.5rem;
}

.about-signature__line {
  display: block;
  width: 4rem;
  height: 2px;
  margin: 0 auto 1.25rem;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, rgb(var(--v-theme-primary)), transparent);
}

.about-signature__name {
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 0.35rem;
}

.about-signature__role {
  font-size: 0.875rem;
  margin: 0;
  letter-spacing: 0.04em;
}

@media (max-width: 600px) {
  .about-prose {
    text-align: left;
    hyphens: none;
    -webkit-hyphens: none;
  }

  .about-quote {
    font-size: 1.05rem;
    padding: 1rem 1rem 1rem 1.1rem;
  }
}
</style>
