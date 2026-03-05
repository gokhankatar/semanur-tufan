<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Dergi Ekle</h2>

    <v-card variant="tonal" class="pa-4 pa-md-6">
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-file-input
          v-model="pdfFile"
          label="PDF Dosyası"
          accept="application/pdf"
          :rules="[rules.pdfRequired]"
          variant="outlined"
          prepend-icon=""
          prepend-inner-icon="mdi-file-pdf-box"
          clearable
          show-size
          class="mb-3"
        />

        <v-file-input
          v-model="coverFile"
          label="Kapak Görseli"
          accept="image/*"
          :rules="[rules.coverRequired]"
          variant="outlined"
          prepend-icon=""
          prepend-inner-icon="mdi-image"
          clearable
          show-size
          class="mb-3"
        />

        <v-text-field
          v-model="form.journal_title"
          label="Dergi Başlığı"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-3"
        />
        <v-text-field
          v-model="form.publisher_name"
          label="Yayıncı Adı"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-3"
        />
        <v-text-field
          v-model.number="form.journal_volume_number"
          label="Sayı Numarası"
          type="number"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-3"
        />
        <v-textarea
          v-model="form.journal_summary"
          label="Özet"
          :rules="[rules.required]"
          variant="outlined"
          rows="4"
          class="mb-3"
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

        <v-btn type="submit" color="primary" size="large" :loading="loading">
          Dergi Ekle
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Journal } from '~/interfaces'

const { addJournal } = useJournals()
const { uploadFile } = useStorageUpload()

const form = reactive<Omit<Journal, 'id'>>({
  journal_title: '',
  journal_cover_img: '',
  journal_keywords: [],
  journal_summary: '',
  journal_volume_number: 1,
  pdf_url: '',
  publisher_name: '',
})

const pdfFile = ref<File[]>([])
const coverFile = ref<File[]>([])
const keywordsInput = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const formRef = ref()

const rules = {
  required: (v: string | number) => !!v || 'Bu alan zorunludur',
  pdfRequired: () => (pdfFile.value?.length ? true : 'PDF dosyası seçin'),
  coverRequired: () => (coverFile.value?.length ? true : 'Kapak görseli seçin'),
}

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const pdf = pdfFile.value?.[0]
    const cover = coverFile.value?.[0]
    if (!pdf || !cover) {
      error.value = 'PDF ve kapak görseli gerekli'
      return
    }

    const [pdfUrl, coverUrl] = await Promise.all([
      uploadFile(pdf, 'pdfs'),
      uploadFile(cover, 'covers'),
    ])

    const keywords = keywordsInput.value
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    await addJournal({
      ...form,
      journal_cover_img: coverUrl,
      pdf_url: pdfUrl,
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
    pdfFile.value = []
    coverFile.value = []
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err?.message || 'Dergi eklenirken bir hata oluştu.'
  } finally {
    loading.value = false
  }
}
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
</style>
