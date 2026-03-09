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

      <!-- Yorumlar -->
      <div v-if="journal.comments?.length" class="mb-4">
        <p class="text-body-small font-weight-medium mb-2">Yorumlar</p>
        <div class="admin-dergi-yorumlar">
          <div
            v-for="c in journal.comments"
            :key="c.id"
            class="admin-dergi-yorum-item d-flex align-center justify-space-between ga-2 py-2"
          >
            <div class="flex-grow-1 min-width-0">
              <span class="text-body-small font-weight-medium">{{ c.author_name }}</span>
              <span class="text-caption text-medium-emphasis ml-2">{{ formatCommentDate(c.created_at) }}</span>
              <p class="text-body-small mb-0 mt-1" style="white-space: pre-wrap">{{ c.comment_text }}</p>
            </div>
            <div class="d-flex align-center ga-1 flex-shrink-0">
              <v-tooltip :text="c.visible ? 'Gizle' : 'Göster'">
                <template #activator="{ props: tProps }">
                  <v-btn
                    v-bind="tProps"
                    icon
                    variant="text"
                    size="small"
                    :color="c.visible ? 'success' : 'default'"
                    @click="toggleVisibility(c.id)"
                  >
                    <v-icon :icon="c.visible ? 'mdi-eye' : 'mdi-eye-off'" size="small" />
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Sil">
                <template #activator="{ props: tProps }">
                  <v-btn
                    v-bind="tProps"
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    @click="removeComment(c.id)"
                  >
                    <v-icon icon="mdi-delete" size="small" />
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>

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

const { toggleCommentVisibility, removeCommentFromJournal } = useJournalComments()

const formatCommentDate = (iso: string) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

const toggleVisibility = async (commentId: string) => {
  if (!props.journal.id || !props.journal.comments) return
  await toggleCommentVisibility(props.journal.id, props.journal.comments, commentId)
  const idx = props.journal.comments.findIndex((c) => c.id === commentId)
  const c = idx >= 0 ? props.journal.comments[idx] : undefined
  if (c) {
    c.visible = !c.visible
  }
}

const removeComment = async (commentId: string) => {
  if (!props.journal.id || !props.journal.comments) return
  await removeCommentFromJournal(props.journal.id, props.journal.comments, commentId)
  const idx = props.journal.comments.findIndex((c) => c.id === commentId)
  if (idx >= 0) {
    props.journal.comments.splice(idx, 1)
  }
}

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

.admin-dergi-yorumlar {
  border: 1px solid rgb(var(--v-theme-primary) / 0.2);
  border-radius: 12px;
  padding: 0.5rem;
}
.admin-dergi-yorum-item {
  border-bottom: 1px solid rgb(var(--v-theme-primary) / 0.1);
}
.admin-dergi-yorum-item:last-child {
  border-bottom: none;
}
</style>
