<template>
  <div class="pa-4 pa-md-8">
    <h1 class="text-h4 mb-6">Dergi Yükle</h1>

    <v-card variant="tonal" class="pa-4" max-width="600">
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.journal_title"
          label="Dergi Başlığı"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-2"
        />
        <v-text-field
          v-model="form.publisher_name"
          label="Yayıncı Adı"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-2"
        />
        <v-text-field
          v-model.number="form.journal_volume_number"
          label="Sayı Numarası"
          type="number"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-2"
        />
        <v-text-field
          v-model="form.journal_cover_img"
          label="Kapak Görsel URL"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-2"
        />
        <v-text-field
          v-model="form.pdf_url"
          label="PDF URL"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-2"
          hint="public/pdfs veya public/pdf için: /pdfs/dosya.pdf veya /pdf/dosya.pdf | Harici için tam URL"
          persistent-hint
        />
        <v-textarea
          v-model="form.journal_summary"
          label="Özet"
          :rules="[rules.required]"
          variant="outlined"
          rows="4"
          class="mb-2"
        />
        <v-text-field
          v-model="keywordsInput"
          label="Anahtar Kelimeler (virgülle ayırın)"
          variant="outlined"
          placeholder="bilim, sanat, teknoloji"
          class="mb-4"
        />

        <v-alert v-if="error" type="error" class="mb-4" density="compact" closable>
          {{ error }}
        </v-alert>
        <v-alert v-if="success" type="success" class="mb-4" density="compact" closable>
          Dergi başarıyla eklendi!
        </v-alert>

        <v-btn type="submit" color="primary" :loading="loading">
          Dergi Ekle
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Journal } from '~/interfaces'

definePageMeta({
  layout: 'default',
})

const authStore = useAuthStore()
const { addJournal } = useJournals()

const form = reactive<Omit<Journal, 'id'>>({
  journal_title: '',
  journal_cover_img: '',
  journal_keywords: [],
  journal_summary: '',
  journal_volume_number: 1,
  pdf_url: '',
  publisher_name: '',
})

const keywordsInput = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const formRef = ref()

const rules = {
  required: (v: string | number) => !!v || 'Bu alan zorunludur',
}

const route = useRoute()
watch(
  () => [authStore.loading, authStore.isAdmin],
  ([loading, isAdmin]) => {
    if (!loading && !isAdmin && route.path.startsWith('/admin')) {
      navigateTo('/giris')
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const keywords = keywordsInput.value
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    await addJournal({
      ...form,
      journal_keywords: keywords,
    })

    success.value = true
    form.journal_title = ''
    form.publisher_name = ''
    form.journal_volume_number = 1
    form.journal_cover_img = ''
    form.pdf_url = ''
    form.journal_summary = ''
    form.journal_keywords = []
    keywordsInput.value = ''
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err?.message || 'Dergi eklenirken bir hata oluştu.'
  } finally {
    loading.value = false
  }
}
</script>
