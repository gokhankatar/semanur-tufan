<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Ayarlar</h2>

    <v-card variant="tonal" class="pa-4 pa-md-6">
      <p class="text-body-small font-weight-medium mb-2">Primary Renk</p>
      <p class="text-caption text-medium-emphasis mb-3">
        Sitenin ana rengi. Açık ve koyu tema için ayrı seçebilirsin. nuxt.config varsayılanı override eder.
      </p>

      <!-- Hazır renkler - yuvarlak seçim -->
      <p class="text-caption text-medium-emphasis mb-2">Hazır renkler</p>
      <div class="admin-ayarlar__presets mb-4">
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

      <!-- Özel renk -->
      <p class="text-caption text-medium-emphasis mb-2">Özel renk</p>
      <div class="d-flex align-center ga-3 mb-3">
        <v-color-picker
          :model-value="primaryColor"
          hide-inputs
          mode="hex"
          @update:model-value="$emit('update:primaryColor', $event)"
        />
        <v-text-field
          :model-value="primaryColor"
          label="Renk kodu"
          variant="outlined"
          hide-details="auto"
          class="flex-grow-1"
          @update:model-value="$emit('update:primaryColor', $event)"
        />
      </div>
      <div class="d-flex ga-2 mb-3">
        <v-btn
          size="small"
          variant="tonal"
          :color="primaryTheme === 'light' ? 'primary' : undefined"
          @click="primaryTheme = 'light'"
        >
          Açık tema
        </v-btn>
        <v-btn
          size="small"
          variant="tonal"
          :color="primaryTheme === 'dark' ? 'primary' : undefined"
          @click="primaryTheme = 'dark'"
        >
          Koyu tema
        </v-btn>
      </div>
      <v-btn
        color="primary"
        variant="tonal"
        @click="$emit('primary-save', primaryTheme)"
      >
        Rengi Kaydet
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { presetColors } = useThemeColor()
const primaryTheme = ref<'dark' | 'light'>('light')

defineProps<{
  primaryColor: string
}>()

defineEmits<{
  'update:primaryColor': [v: string]
  'primary-save': [theme: 'dark' | 'light']
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
</style>
