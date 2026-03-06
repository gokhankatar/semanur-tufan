<template>
  <div>
    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <div class="cover-upload mb-4">
        <input
          ref="coverInputRef"
          type="file"
          accept="image/*"
          class="d-none"
          @change="onCoverChange"
        />
        <v-card
          v-if="!coverFile?.length && !journal.journal_cover_img"
          variant="outlined"
          class="cover-upload__placeholder"
          rounded="lg"
          @click="triggerCoverInput"
        >
          <div class="cover-upload__placeholder-inner">
            <v-icon icon="mdi-image-plus" size="48" class="text-medium-emphasis mb-2" />
            <span class="text-body-medium">Kapak görseli seçin</span>
          </div>
        </v-card>
        <v-card v-else variant="outlined" class="cover-upload__preview" rounded="lg">
          <div class="cover-upload__preview-inner">
            <img
              :src="coverPreviewUrl || journal.journal_cover_img"
              alt="Kapak"
              class="cover-upload__img"
            />
            <div class="cover-upload__preview-info">
              <span class="text-body-small font-weight-medium">Kapak görseli</span>
              <div class="d-flex ga1 mt-2">
                <v-btn variant="tonal" size="small" prepend-icon="mdi-refresh" @click.stop="triggerCoverInput">
                  Değiştir
                </v-btn>
                <v-btn
                  v-if="coverFile?.length"
                  variant="text"
                  size="small"
                  prepend-icon="mdi-close"
                  color="error"
                  @click.stop="coverFile = []; revokeCoverPreview()"
                >
                  Kaldır
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </div>
      <v-text-field
        v-model="form.journal_title"
        label="Dergi Başlığı"
        :rules="[rules.required]"
        variant="outlined"
        prepend-inner-icon="mdi-book-open-variant"
        class="mb-3"
        rounded="lg"
        hide-details="auto"
      />
      <v-text-field
        v-model="form.publisher_name"
        label="Yayıncı Adı"
        :rules="[rules.required]"
        variant="outlined"
        prepend-inner-icon="mdi-domain"
        class="mb-3"
        rounded="lg"
        hide-details="auto"
      />
      <v-text-field
        v-model.number="form.journal_volume_number"
        label="Sayı Numarası"
        type="number"
        :rules="[rules.required]"
        variant="outlined"
        prepend-inner-icon="mdi-numeric"
        class="mb-3"
        rounded="lg"
        hide-details="auto"
      />
      <v-textarea
        v-model="form.journal_summary"
        label="Özet"
        :rules="[rules.required]"
        variant="outlined"
        prepend-inner-icon="mdi-text-box"
        rows="4"
        class="mb-3"
        rounded="lg"
        hide-details="auto"
        no-resize
      />
      <v-autocomplete
        v-model="keywordsArray"
        label="Anahtar Kelimeler"
        variant="outlined"
        prepend-inner-icon="mdi-tag-multiple"
        placeholder="Yazıp Enter ile ekleyin"
        class="mb-3"
        multiple
        rounded="lg"
        chips
        closable-chips
        :items="keywordSuggestions"
        hide-details="auto"
        clearable
      />
      <v-alert v-if="error" type="error" class="mb-4" density="compact" closable @click:close="error = ''">
        {{ error }}
      </v-alert>
      <div class="d-flex ga-2 justify-end">
        <v-btn variant="text" @click="$emit('cancel')">İptal</v-btn>
        <v-btn type="submit" prepend-icon="mdi-content-save" color="primary" :loading="loading" text="Kaydet" />
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { Journal } from '~/interfaces'

const props = defineProps<{ journal: Journal }>()
const emit = defineEmits<{ saved: []; cancel: [] }>()

const { updateJournal } = useJournals()
const { uploadFile } = useProfileUpload()

const form = reactive({
  journal_title: props.journal.journal_title,
  publisher_name: props.journal.publisher_name,
  journal_volume_number: props.journal.journal_volume_number,
  journal_summary: props.journal.journal_summary,
  journal_keywords: [...(props.journal.journal_keywords || [])],
})

const coverFile = ref<File[]>([])
const coverInputRef = ref<HTMLInputElement | null>(null)
const coverPreviewUrl = ref('')
const keywordsArray = ref<string[]>([...(props.journal.journal_keywords || [])])
const keywordSuggestions = ['bilim', 'sanat', 'teknoloji', 'edebiyat', 'kültür', 'deneme']
const loading = ref(false)
const error = ref('')
const formRef = ref()

watch(() => props.journal, (j) => {
  form.journal_title = j.journal_title
  form.publisher_name = j.publisher_name
  form.journal_volume_number = j.journal_volume_number
  form.journal_summary = j.journal_summary
  form.journal_keywords = [...(j.journal_keywords || [])]
  keywordsArray.value = [...(j.journal_keywords || [])]
}, { immediate: true })

const triggerCoverInput = () => coverInputRef.value?.click()

const processCoverFile = (file: File) => {
  revokeCoverPreview()
  if (!file.type.startsWith('image/')) return
  coverFile.value = [file]
  coverPreviewUrl.value = URL.createObjectURL(file)
}

const onCoverChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) processCoverFile(file)
  input.value = ''
}

const revokeCoverPreview = () => {
  if (coverPreviewUrl.value) {
    URL.revokeObjectURL(coverPreviewUrl.value)
    coverPreviewUrl.value = ''
  }
}

onBeforeUnmount(revokeCoverPreview)

const rules = { required: (v: string | number) => !!v || 'Bu alan zorunludur' }

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    let coverUrl = props.journal.journal_cover_img
    if (coverFile.value?.[0]) {
      coverUrl = await uploadFile('pdf_cover_images', coverFile.value[0])
    }

    await updateJournal(props.journal.id!, {
      journal_title: form.journal_title,
      publisher_name: form.publisher_name,
      journal_volume_number: form.journal_volume_number,
      journal_summary: form.journal_summary,
      journal_keywords: keywordsArray.value,
      journal_cover_img: coverUrl,
    })

    emit('saved')
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err?.message || 'Kaydedilemedi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.cover-upload__placeholder {
  cursor: pointer;
  padding: 2.5rem 1.5rem;
}
.cover-upload__placeholder-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cover-upload__preview-inner {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  align-items: flex-start;
}
.cover-upload__img {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
</style>
