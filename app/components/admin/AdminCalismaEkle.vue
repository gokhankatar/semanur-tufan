<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Çalışma Ekle</h2>

    <v-card variant="tonal" class="pa-4 pa-md-6">
      <v-alert type="info" variant="tonal" class="mb-4" density="compact">
        Çalışmalar özelliği yakında eklenecek. Firestore <code>works</code> koleksiyonu
        oluşturulacak.
      </v-alert>
      <v-form>
        <v-text-field
          label="Çalışma Başlığı"
          variant="outlined"
          class="mb-2"
          hide-details="auto"
          :density="display.xl.value ? 'comfortable' : 'compact'"
        />
        <v-text-field
          label="Kategori"
          variant="outlined"
          class="mb-2"
          hide-details="auto"
          :density="display.xl.value ? 'comfortable' : 'compact'"
        />
        <v-textarea
          label="Açıklama"
          variant="outlined"
          rows="4"
          class="mb-2"
          hide-details="auto"
          :density="display.xl.value ? 'comfortable' : 'compact'"
          no-resize
        />
        <v-btn color="primary" text="Ekle" prepend-icon="mdi-plus" />
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const display = useDisplay();
</script>

<style scoped>
.admin-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

code {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875em;
}
</style>
