<template>
  <v-dialog
    :model-value="modelValue"
    max-width="680"
    persistent
    scrollable
    transition="dialog-transition"
    scrim="rgba(0,0,0,0.6)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card variant="elevated" class="admin-dialog-card pa-4 pa-md-6">
      <v-overlay
        :model-value="loading"
        contained
        class="align-center justify-center"
        scrim="rgba(0,0,0,0.5)"
      >
        <div class="d-flex flex-column align-center ga-3">
          <v-progress-circular indeterminate color="primary" size="56" width="4" />
          <span class="text-body-medium font-weight-medium">Dergi ekleniyor...</span>
        </div>
      </v-overlay>

      <v-card-title class="d-flex align-center mb-4">
        <v-icon icon="mdi-check-circle" color="success" class="mr-2" />
        Eseri Dergi Olarak Onayla
        <v-spacer />
        <v-btn icon variant="text" size="small" @click="$emit('update:modelValue', false)">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-card-text v-if="request">
        <!-- Seçili PDF önizleme -->
        <v-card variant="outlined" class="mb-4 pdf-preview-card" rounded="lg">
          <v-card-title class="text-body-medium d-flex align-center py-3">
            <v-icon icon="mdi-file-pdf-box" color="error" class="mr-2" />
            Seçili PDF
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
            <div class="d-flex flex-wrap align-center ga-2 mb-3">
              <v-chip size="small" variant="tonal" prepend-icon="mdi-account-outline">
                {{ request.name }}
              </v-chip>
              <v-chip size="small" variant="tonal" prepend-icon="mdi-email-outline">
                {{ request.email }}
              </v-chip>
              <v-chip
                :color="getEserTuruColor(request.eser_turu)"
                size="small"
                variant="tonal"
                :prepend-icon="getEserTuruIcon(request.eser_turu)"
              >
                {{ getEserTuruLabel(request.eser_turu) }}
              </v-chip>
            </div>
            <iframe
              :src="`${request.pdf_url}#toolbar=0`"
              class="pdf-preview-iframe"
              title="PDF önizleme"
            />
            <v-btn
              :href="request.pdf_url"
              target="_blank"
              rel="noopener"
              color="primary"
              variant="tonal"
              size="small"
              prepend-icon="mdi-open-in-new"
              class="mt-2"
              text="PDF'i yeni sekmede aç"
            />
          </v-card-text>
        </v-card>

        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4"
          icon="mdi-information-outline"
        >
          Eksik alanları tamamlayarak bu eseri dergiler koleksiyonuna ekleyebilirsiniz.
          Gönderen bilgileri ({{ request.name }}) dergi kaydına eklenir.
        </v-alert>

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
              v-if="!coverFile?.length"
              variant="outlined"
              class="cover-upload__placeholder"
              rounded="lg"
              @click="triggerCoverInput"
              @dragover.prevent="coverDragOver = true"
              @dragleave="coverDragOver = false"
              @drop.prevent="onCoverDrop"
              :class="{ 'cover-upload__placeholder--drag': coverDragOver }"
            >
              <div class="cover-upload__placeholder-inner">
                <v-icon icon="mdi-image-plus" size="48" class="text-medium-emphasis mb-2" />
                <span class="text-body-medium">Kapak görseli seçin</span>
                <span class="text-caption text-medium-emphasis mt-1">veya sürükleyip bırakın</span>
              </div>
            </v-card>
            <v-card v-else variant="outlined" class="cover-upload__preview" rounded="lg">
              <div class="cover-upload__preview-inner">
                <img :src="coverPreviewUrl" alt="Kapak" class="cover-upload__img" />
                <div class="cover-upload__preview-info">
                  <span class="text-body-small font-weight-medium">{{ coverFile[0]?.name }}</span>
                  <div class="d-flex ga-1 mt-2">
                    <v-btn variant="tonal" size="small" prepend-icon="mdi-refresh" @click.stop="triggerCoverInput">
                      Değiştir
                    </v-btn>
                    <v-btn
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
            <v-alert v-if="coverError" type="error" density="compact" class="mt-2">
              {{ coverError }}
            </v-alert>
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
            class="mb-4"
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
            <v-btn variant="text" @click="$emit('update:modelValue', false)">İptal</v-btn>
            <v-btn
              type="submit"
              prepend-icon="mdi-check-circle"
              color="success"
              :loading="loading"
              text="Dergiye Ekle"
            />
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { ArtworkRequest } from "~/interfaces/artwork";

const props = defineProps<{
  modelValue: boolean;
  request: ArtworkRequest | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [v: boolean];
  approved: [];
}>();

const display = useDisplay();
const { addJournal } = useJournals();
const { uploadFile } = useProfileUpload();

const formRef = ref();
const coverInputRef = ref<HTMLInputElement | null>(null);
const coverFile = ref<File[]>([]);
const coverPreviewUrl = ref("");
const coverError = ref("");
const coverDragOver = ref(false);
const keywordsArray = ref<string[]>([]);
const keywordSuggestions = ["bilim", "sanat", "teknoloji", "edebiyat", "kültür", "deneme"];
const loading = ref(false);
const error = ref("");

const form = reactive({
  journal_title: "",
  publisher_name: "Gökgerdan Dergisi",
  journal_volume_number: 1,
  journal_summary: "",
});

const rules = { required: (v: string | number) => !!v || "Bu alan zorunludur" };

watch(
  () => props.request,
  (r) => {
    if (r) {
      form.journal_title = r.eser_baslik;
      form.journal_summary = r.aciklama || "";
    }
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  (open) => {
    if (open && props.request) {
      form.journal_title = props.request.eser_baslik;
      form.journal_summary = props.request.aciklama || "";
      form.publisher_name = "Gökgerdan Dergisi";
      form.journal_volume_number = 1;
      keywordsArray.value = [];
      coverFile.value = [];
      revokeCoverPreview();
      coverError.value = "";
      error.value = "";
    }
  }
);

const triggerCoverInput = () => coverInputRef.value?.click();

const processCoverFile = (file: File) => {
  revokeCoverPreview();
  if (!file.type.startsWith("image/")) {
    coverError.value = "Sadece resim dosyaları kabul edilir.";
    return;
  }
  coverError.value = "";
  coverFile.value = [file];
  coverPreviewUrl.value = URL.createObjectURL(file);
};

const onCoverChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) processCoverFile(file);
  input.value = "";
};

const onCoverDrop = (e: DragEvent) => {
  coverDragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) processCoverFile(file);
};

const revokeCoverPreview = () => {
  if (coverPreviewUrl.value) {
    URL.revokeObjectURL(coverPreviewUrl.value);
    coverPreviewUrl.value = "";
  }
};

onBeforeUnmount(revokeCoverPreview);

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  if (!props.request?.pdf_url) {
    error.value = "PDF URL bulunamadı.";
    return;
  }

  const cover = coverFile.value?.[0];
  if (!cover) {
    coverError.value = "Kapak görseli gerekli";
    return;
  }

  loading.value = true;
  error.value = "";
  coverError.value = "";

  try {
    const coverUrl = await uploadFile("pdf_cover_images", cover);

    await addJournal({
      journal_title: form.journal_title,
      publisher_name: form.publisher_name,
      journal_volume_number: form.journal_volume_number,
      journal_summary: form.journal_summary,
      journal_keywords: keywordsArray.value,
      journal_cover_img: coverUrl,
      pdf_url: props.request.pdf_url,
      sender_name: props.request.name,
      sender_email: props.request.email,
    });

    emit("update:modelValue", false);
    emit("approved");
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Dergi eklenirken hata oluştu.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.cover-upload__placeholder {
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}
.cover-upload__placeholder:hover,
.cover-upload__placeholder--drag {
  border-color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary) / 0.05);
}
.cover-upload__placeholder-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
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
.admin-dialog-card {
  background: rgb(var(--v-theme-surface)) !important;
  border: none !important;
}
.pdf-preview-card {
  border-color: rgb(var(--v-theme-primary) / 0.3);
}
.pdf-preview-iframe {
  width: 100%;
  height: 280px;
  border: 1px solid rgb(var(--v-theme-primary) / 0.2);
  border-radius: 8px;
  background: rgb(0 0 0 / 0.05);
}
</style>
