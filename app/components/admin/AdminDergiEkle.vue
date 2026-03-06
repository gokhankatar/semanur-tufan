<template>
  <div class="admin-section">
    <h2 v-if="!embedded" class="text-headline-small mb-4">Dergi Ekle</h2>

    <!-- Adım 1: PDF Yükle -->
    <v-card
      v-if="!uploadedPdfUrl"
      variant="outlined"
      class="pa-4 pa-md-6 position-relative"
    >
      <v-overlay
        :model-value="uploadingPdf"
        contained
        class="align-center justify-center"
        scrim="rgba(0,0,0,0.5)"
      >
        <div class="d-flex flex-column align-center ga3">
          <v-progress-circular indeterminate color="primary" size="56" width="4" />
          <span class="text-body-medium font-weight-medium">Dergi yükleniyor...</span>
        </div>
      </v-overlay>
      <p class="text-body-medium text-medium-emphasis mb-4">
        Önce PDF dosyasını yükleyin. Yükleme tamamlandıktan sonra dergi bilgilerini
        gireceğiniz bir form açılacak.
      </p>

      <v-alert
        type="info"
        variant="tonal"
        density="compact"
        :prepend-icon="display.mdAndUp.value ? 'mdi-information-outline' : undefined"
        class="mb-3"
      >
        Maksimum 50 MB, yalnızca PDF dosyaları kabul edilir.
      </v-alert>


      <v-file-upload
        v-model="pdfFile"
        accept=".pdf,application/pdf"
        variant="outlined"
        title="Dergi Yükle Veya Sürükle Bırak"
        divider-text="veya"
        browse-text="Dosya Seç"
        :density="display.mdAndUp.value ? 'default' : 'comfortable'"
        prepend-inner-icon="mdi-file-pdf-box"
        clearable
        show-size
        :disabled="uploadingPdf"
        class="ma-auto"
        @update:model-value="onPdfSelected"
      />
      <v-alert
        v-if="pdfError"
        type="error"
        class="mt-3"
        density="compact"
        closable
        @click:close="pdfError = ''"
      >
        {{ pdfError }}
      </v-alert>
    </v-card>

    <v-alert v-if="success" type="success" class="mt-4" density="compact" closable>
      Dergi başarıyla eklendi!
    </v-alert>

    <!-- Adım 2: Dergi Bilgileri Popup -->
    <v-dialog
      v-model="detailsDialog"
      max-width="560"
      persistent
      transition="dialog-transition"
    >
      <v-card variant="outlined" class="pa-4 pa-md-6 position-relative">
        <v-overlay
          :model-value="loading"
          contained
          class="align-center justify-center"
          scrim="rgba(0,0,0,0.5)"
        >
          <div class="d-flex flex-column align-center ga3">
            <v-progress-circular indeterminate color="primary" size="56" width="4" />
            <span class="text-body-medium font-weight-medium">Dergi kaydediliyor...</span>
          </div>
        </v-overlay>

        <v-card-title
          class="text-label-medium text-sm-label-large text-xl-headline-small mb-2"
          >Dergi Bilgilerini Girin</v-card-title
        >

        <v-alert
          v-if="uploadedPdfInfo"
          type="success"
          variant="tonal"
          density="compact"
          class="mb-4"
          icon="mdi-file-pdf-box"
        >
          <div class="text-body-small">
            <strong>Yüklenen dergi:</strong> {{ uploadedPdfInfo.name }}
            <span class="text-medium-emphasis"
              >({{ formatFileSize(uploadedPdfInfo.size) }})</span
            >
          </div>
        </v-alert>

        <v-form ref="formRef" @submit.prevent="handleSubmitDetails">
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
                <v-icon
                  icon="mdi-image-plus"
                  size="48"
                  class="text-medium-emphasis mb-2"
                />
                <span class="text-body-medium">Kapak görseli seçin</span>
                <span class="text-caption text-medium-emphasis mt-1"
                  >veya sürükleyip bırakın</span
                >
              </div>
            </v-card>
            <v-card v-else variant="outlined" class="cover-upload__preview" rounded="lg">
              <div class="cover-upload__preview-inner">
                <img
                  :src="coverPreviewUrl"
                  alt="Kapak önizleme"
                  class="cover-upload__img"
                />
                <div class="cover-upload__preview-info">
                  <span class="text-body-small font-weight-medium">{{
                    coverFile[0]?.name
                  }}</span>
                  <span class="text-caption text-medium-emphasis">{{
                    formatFileSize(coverFile[0]?.size || 0)
                  }}</span>
                  <div class="d-flex ga1 mt-2">
                    <v-btn
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-refresh"
                      @click.stop="triggerCoverInput"
                    >
                      Değiştir
                    </v-btn>
                    <v-btn
                      variant="text"
                      size="small"
                      prepend-icon="mdi-close"
                      color="error"
                      @click.stop="
                        coverFile = [];
                        revokeCoverPreview();
                      "
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
            :density="display.xl.value ? 'comfortable' : 'compact'"
            hide-details="auto"
          />
          <v-text-field
            v-model="form.publisher_name"
            label="Yayıncı Adı"
            :rules="[rules.required]"
            variant="outlined"
            prepend-inner-icon="mdi-domain"
            class="mb-3"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            hide-details="auto"
            rounded="lg"
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
            :density="display.xl.value ? 'comfortable' : 'compact'"
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
            :density="display.xl.value ? 'comfortable' : 'compact'"
            hide-details="auto"
            rounded="lg"
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
            :items="keywordItems"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            hide-details="auto"
            clearable
            @update:search="keywordSearch = $event"
          />
          <v-alert v-if="error" type="error" class="mb-4" density="compact" closable>
            {{ error }}
          </v-alert>
          <div class="d-flex ga-2 justify-end">
            <v-btn variant="text" @click="closeDetailsDialog" text="İptal" />
            <v-btn
              type="submit"
              prepend-icon="mdi-content-save"
              color="primary"
              :loading="loading"
              text="Dergiyi Kaydet"
            />
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Journal } from "~/interfaces";

defineProps<{ embedded?: boolean }>();
const emit = defineEmits<{ saved: [title: string] }>();
const display = useDisplay();
const { addJournal } = useJournals();
const { uploadFile } = useProfileUpload();

const form = reactive<Omit<Journal, "id">>({
  journal_title: "",
  journal_cover_img: "",
  journal_keywords: [],
  journal_summary: "",
  journal_volume_number: 1,
  pdf_url: "",
  publisher_name: "",
});

const pdfFile = ref<File | File[] | undefined>(undefined);
const coverFile = ref<File[]>([]);
const coverInputRef = ref<HTMLInputElement | null>(null);
const coverPreviewUrl = ref("");
const coverError = ref("");
const coverDragOver = ref(false);
const keywordsArray = ref<string[]>([]);
const keywordSuggestions = [
  "bilim",
  "sanat",
  "teknoloji",
  "edebiyat",
  "kültür",
  "deneme",
];
const keywordSearch = ref("");
const keywordItems = computed(() => {
  const search = keywordSearch.value?.trim().toLowerCase();
  if (!search) return keywordSuggestions;
  const filtered = keywordSuggestions.filter((k) => k.toLowerCase().includes(search));
  return filtered.includes(search) ? filtered : [search, ...filtered];
});
const uploadingPdf = ref(false);
const loading = ref(false);
const error = ref("");
const pdfError = ref("");
const success = ref(false);
const detailsDialog = ref(false);
const uploadedPdfUrl = ref("");
const uploadedPdfInfo = ref<{ name: string; size: number } | null>(null);
const formRef = ref();

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
  if (!file) return;
  processCoverFile(file);
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

onBeforeUnmount(() => {
  revokeCoverPreview();
});

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const rules = {
  required: (v: string | number) => !!v || "Bu alan zorunludur",
  coverRequired: () => (coverFile.value?.length ? true : "Kapak görseli seçin"),
};

const getPdfFile = (): File | undefined => {
  const v = pdfFile.value;
  if (!v) return undefined;
  if (Array.isArray(v)) return v[0];
  return v;
};

const PDF_MAX_SIZE_MB = 50;
const PDF_MAX_SIZE_BYTES = PDF_MAX_SIZE_MB * 1024 * 1024;

const onPdfSelected = (val: File | File[] | null | undefined) => {
  const file = !val ? undefined : Array.isArray(val) ? val[0] : val;
  if (!file) return;

  if (file.type !== "application/pdf") {
    pdfError.value = "Yalnızca PDF dosyaları kabul edilir.";
    pdfFile.value = undefined;
    return;
  }
  if (file.size > PDF_MAX_SIZE_BYTES) {
    pdfError.value = `Dosya boyutu en fazla ${PDF_MAX_SIZE_MB} MB olabilir.`;
    pdfFile.value = undefined;
    return;
  }

  pdfError.value = "";
  handlePdfUpload();
};

const handlePdfUpload = async () => {
  const pdf = getPdfFile();
  if (!pdf) {
    pdfError.value = "PDF dosyası seçin";
    return;
  }

  uploadingPdf.value = true;
  pdfError.value = "";

  try {
    const url = await uploadFile("pdfs", pdf);
    uploadedPdfUrl.value = url;
    uploadedPdfInfo.value = { name: pdf.name, size: pdf.size };
    detailsDialog.value = true;
    pdfFile.value = undefined;
  } catch (e: unknown) {
    const err = e as { message?: string };
    pdfError.value = err?.message || "PDF yüklenirken bir hata oluştu.";
  } finally {
    uploadingPdf.value = false;
  }
};

const closeDetailsDialog = () => {
  detailsDialog.value = false;
  uploadedPdfUrl.value = "";
  uploadedPdfInfo.value = null;
  pdfFile.value = undefined;
  form.journal_title = "";
  form.publisher_name = "";
  form.journal_volume_number = 1;
  form.journal_cover_img = "";
  form.pdf_url = "";
  form.journal_summary = "";
  form.journal_keywords = [];
  keywordsArray.value = [];
  coverFile.value = [];
  revokeCoverPreview();
  coverError.value = "";
  error.value = "";
};

const handleSubmitDetails = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  error.value = "";

  try {
    const cover = coverFile.value?.[0];
    if (!cover) {
      error.value = "Kapak görseli gerekli";
      return;
    }

    const coverUrl = await uploadFile("pdf_cover_images", cover);
    const keywords = [...keywordsArray.value];

    await addJournal({
      ...form,
      journal_cover_img: coverUrl,
      pdf_url: uploadedPdfUrl.value,
      journal_keywords: keywords,
    });

    success.value = true;
    const title = form.journal_title;
    closeDetailsDialog();
    emit('saved', title);
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Dergi eklenirken bir hata oluştu.";
  } finally {
    loading.value = false;
  }
};
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
  padding: 2.5rem 1.5rem;
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

.cover-upload__preview-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
