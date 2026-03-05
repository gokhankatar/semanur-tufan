<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Ayarlar</h2>

    <v-card variant="tonal" class="pa-4 pa-md-6">
      <p class="text-body-small font-weight-medium mb-3">Primary Renk</p>

      <!-- Tema seçimi - önce hangi tema için renk belirleneceği -->
      <p class="text-caption text-medium-emphasis mb-2">Hangi tema için renk belirleyeceksin?</p>
      <div class="d-flex ga-2 mb-4">
        <v-btn
          size="default"
          variant="tonal"
          :color="primaryTheme === 'light' ? 'primary' : undefined"
          prepend-icon="mdi-weather-sunny"
          @click="emit('update:primaryTheme', 'light')"
        >
          Açık tema
        </v-btn>
        <v-btn
          size="default"
          variant="tonal"
          :color="primaryTheme === 'dark' ? 'primary' : undefined"
          prepend-icon="mdi-weather-night"
          @click="emit('update:primaryTheme', 'dark')"
        >
          Koyu tema
        </v-btn>
      </div>

      <!-- Seçili tema için ana rengi belirle -->
      <p class="text-body-small font-weight-medium mb-2 admin-ayarlar__theme-label">
        {{ primaryTheme === 'light' ? 'Açık tema için ana rengi belirle' : 'Koyu tema için ana rengi belirle' }}
      </p>
      <p class="text-caption text-medium-emphasis mb-2">Hazır renklerden birini seç</p>
      <div class="admin-ayarlar__presets">
        <button
          v-for="preset in presetColors"
          :key="preset.hex"
          type="button"
          class="admin-ayarlar__preset"
          :class="{ 'admin-ayarlar__preset--active': primaryColor.toLowerCase() === preset.hex.toLowerCase() }"
          :style="{ backgroundColor: preset.hex }"
          :title="preset.name"
          @click="$emit('update:primaryColor', preset.hex)"
        />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { presetColors } = useThemeColor()

defineProps<{
  primaryColor: string
  primaryTheme: 'dark' | 'light'
}>()

const emit = defineEmits<{
  'update:primaryColor': [v: string]
  'update:primaryTheme': [v: 'dark' | 'light']
}>()
</script>

<style scoped>
.admin-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Hazır renk yuvarlakları */
.admin-ayarlar__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.admin-ayarlar__preset {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.admin-ayarlar__preset:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.admin-ayarlar__preset--active {
  border-color: #fff;
  box-shadow: 0 0 0 2px #333;
}
.v-theme--light .admin-ayarlar__preset--active {
  border-color: #333;
  box-shadow: 0 0 0 2px #fff;
}

.admin-ayarlar__theme-label {
  color: rgb(var(--v-theme-primary));
}
</style>
