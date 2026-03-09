<template>
  <v-dialog
    v-model="dialog"
    max-width="560"
    persistent
    scrollable
    transition="dialog-transition"
    class="eser-gonder-dialog"
    @after-leave="resetForm"
  >
    <v-card variant="elevated" rounded="xl">
      <v-card-title
        class="d-flex align-center pa-2 pa-lg-4 text-label-medium text-lg-title-medium"
      >
        <v-icon icon="mdi-file-document-edit-outline" color="primary" class="mr-2" />
        Eser Gönder
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-2 pa-lg-4">
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4 eser-gonder__uyari"
          rounded="lg"
        >
          <p class="text-body-small mb-2">
            <strong>Gökgerdan Dergisi'nin eser alımı formudur.</strong> Lütfen açıklamayı dikkatlice okuyunuz.
          </p>
          <template v-if="uyariAcik">
            <p class="text-body-small mb-2">
              Eserinizi göndermeden önce yazım ve noktalama işaretleri kurallarına uygunluğu açısından kontrol ediniz.
            </p>
            <p class="text-body-small mb-2">
              Eser konusu ve stili serbesttir ancak şu özellikleri taşıyan eserler kabul edilecektir: orijinal, ilham verici, kalbe dokunan, faydalı. Kısacası: "En iyi bildiğin şeyi anlat!"
            </p>
            <p class="text-body-small mb-2">
              Lütfen halihazırda başka yayımlarda yayımlanmasını beklediğiniz eserleri göndermeyiniz.
            </p>
            <v-btn
              variant="text"
              size="small"
              density="compact"
              class="pa-0 mt-1 text-body-small"
              @click="uyariAcik = false"
            >
              Gizle
            </v-btn>
          </template>
          <v-btn
            v-else
            variant="text"
            size="small"
            density="compact"
            class="pa-0 mt-1 text-body-small"
            prepend-icon="mdi-chevron-down"
            @click="uyariAcik = true"
          >
            Devamını oku
          </v-btn>
        </v-alert>

        <p class="text-body-small text-medium-emphasis mb-3">
          Formu doldurun. En fazla 50MB boyutunda PDF kabul ediyoruz.
        </p>

        <div class="pdf-upload mb-4">
          <input
            ref="pdfInputRef"
            type="file"
            accept=".pdf,application/pdf"
            class="d-none"
            @change="onPdfInputChange"
          />
          <v-card
            v-if="!pdfFile?.length"
            variant="outlined"
            class="pdf-upload__placeholder"
            rounded="lg"
            @click="triggerPdfInput"
            @dragover.prevent="pdfDragOver = true"
            @dragleave="pdfDragOver = false"
            @drop.prevent="onPdfDrop"
            :class="{ 'pdf-upload__placeholder--drag': pdfDragOver }"
          >
            <div class="pdf-upload__placeholder-inner">
              <v-icon icon="mdi-file-pdf-box" size="40" class="text-medium-emphasis mb-2" />
              <span class="text-body-small font-weight-medium">Eser (PDF) yükleyin</span>
              <span class="text-caption text-medium-emphasis mt-1">veya sürükleyip bırakın</span>
            </div>
          </v-card>
          <v-card v-else variant="outlined" class="pdf-upload__preview" rounded="lg">
            <div class="pdf-upload__preview-inner">
              <v-icon icon="mdi-file-pdf-box" size="36" class="text-primary" />
              <div class="pdf-upload__preview-info">
                <span class="text-body-small font-weight-medium">{{ pdfFile[0]?.name }}</span>
                <span class="text-caption text-medium-emphasis">{{ formatFileSize(pdfFile[0]?.size || 0) }}</span>
                <div class="d-flex ga-1 mt-2">
                  <v-btn variant="tonal" size="small" prepend-icon="mdi-refresh" @click.stop="triggerPdfInput">
                    Değiştir
                  </v-btn>
                  <v-btn
                    variant="text"
                    size="small"
                    prepend-icon="mdi-close"
                    color="error"
                    @click.stop="pdfFile = []"
                  >
                    Kaldır
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Ad Soyad"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            :rules="[rules.required]"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            rounded="lg"
            hide-details="auto"
            class="mb-2 mb-lg-3"
          />
          <v-text-field
            v-model="form.email"
            label="E-posta"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            rounded="lg"
            hide-details="auto"
            class="mb-2 mb-lg-3"
          />
          <v-select
            v-model="form.eser_turu"
            label="Eser Türü"
            :items="ESER_TURLERI"
            item-title="title"
            item-value="value"
            variant="outlined"
            :prepend-inner-icon="getEserTuruIcon(form.eser_turu)"
            :rules="[rules.required]"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            rounded="lg"
            hide-details="auto"
            class="mb-2 mb-lg-3"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props" :prepend-icon="selectItemIcon(item)">
                {{ selectItemTitle(item) }}
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <span class="d-flex align-center">
                <v-icon :icon="selectItemIcon(item)" size="small" class="mr-2" />
                {{ selectItemTitle(item) }}
              </span>
            </template>
          </v-select>
          <v-text-field
            v-model="form.eser_baslik"
            label="Eser Başlığı"
            variant="outlined"
            prepend-inner-icon="mdi-format-title"
            :rules="[rules.required]"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            rounded="lg"
            hide-details="auto"
            class="mb-2 mb-lg-3"
          />
          <v-textarea
            v-model="form.aciklama"
            label="Eser Hakkında Kısa Açıklama"
            variant="outlined"
            prepend-inner-icon="mdi-text"
            :rules="[rules.required]"
            rows="3"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            rounded="lg"
            hide-details="auto"
            no-resize
            class="mb-2 mb-lg-3"
          />
          <v-textarea
            v-model="form.ozgecmis"
            label="Kısa Özgeçmiş"
            variant="outlined"
            prepend-inner-icon="mdi-account-details-outline"
            :rules="[rules.required]"
            rows="3"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            rounded="lg"
            hide-details="auto"
            no-resize
            placeholder="Kendinizi ve çalışmalarınızı kısaca tanıtın."
            class="mb-2 mb-lg-3"
          />
          <v-checkbox
            v-model="form.riza"
            label="Eserimin dergide yayımlanmasına izin veriyorum."
            :rules="[rules.requiredCheck]"
            :density="display.xl.value ? 'compact' : 'comfortable'"
            hide-details
            color="primary"
            :class="['mb-2 mb-lg-4', { 'eser-dialog__riza--sm': display.smAndDown.value }]"
          />
          <v-btn
            type="submit"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-send"
            :loading="loading"
            rounded="lg"
            block
            :size="display.xl.value ? 'large' : 'default'"
            text="Gönder"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const display = useDisplay();
const MAX_PDF_MB = 50;

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submitted: [];
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const formRef = ref();
const pdfInputRef = ref<HTMLInputElement | null>(null);
const pdfFile = ref<File[]>([]);
const uyariAcik = ref(false);
const pdfDragOver = ref(false);
const loading = ref(false);

const triggerPdfInput = () => pdfInputRef.value?.click();

const onPdfInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && file.type === "application/pdf") pdfFile.value = [file];
  input.value = "";
};

const onPdfDrop = (e: DragEvent) => {
  pdfDragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type === "application/pdf") pdfFile.value = [file];
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const form = reactive({
  name: "",
  email: "",
  eser_turu: "",
  eser_baslik: "",
  aciklama: "",
  ozgecmis: "",
  riza: false,
});

const selectItemRaw = (item: unknown) =>
  (item as { raw?: { icon?: string; title?: string } })?.raw ?? (item as { icon?: string; title?: string });
const selectItemIcon = (item: unknown) =>
  selectItemRaw(item)?.icon ?? "mdi-file-document-outline";
const selectItemTitle = (item: unknown) =>
  selectItemRaw(item)?.title ?? "";

const rules = {
  required: (v: string) => !!v || "Bu alan zorunludur",
  email: (v: string) => /.+@.+\..+/.test(v) || "Geçerli bir e-posta girin",
  pdfSize: () => {
    const file = pdfFile.value?.[0];
    if (!file) return true;
    const mb = file.size / (1024 * 1024);
    return mb <= MAX_PDF_MB || `PDF en fazla ${MAX_PDF_MB}MB olabilir`;
  },
  requiredCheck: (v: boolean) => v === true || "Bu onay zorunludur",
};

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.eser_turu = "";
  form.eser_baslik = "";
  form.aciklama = "";
  form.ozgecmis = "";
  form.riza = false;
  pdfFile.value = [];
  uyariAcik.value = false;
  formRef.value?.reset();
};

const handleSubmit = async () => {
  const file = pdfFile.value?.[0];
  if (!file) {
    alert("Lütfen PDF dosyası yükleyin.");
    return;
  }
  if (file.size > MAX_PDF_MB * 1024 * 1024) {
    alert(`PDF en fazla ${MAX_PDF_MB}MB olabilir.`);
    return;
  }
  const result = await formRef.value?.validate();
  if (!result || !result.valid) return;

  loading.value = true;
  try {
    const { uploadFile } = useProfileUpload();
    const { addArtworkRequest } = useArtworkRequests();

    const pdfUrl = await uploadFile("requested_artworks", file);

    await addArtworkRequest({
      name: form.name,
      email: form.email,
      eser_turu: form.eser_turu,
      eser_baslik: form.eser_baslik,
      aciklama: form.aciklama,
      ozgecmis: form.ozgecmis,
      pdf_url: pdfUrl,
    });

    emit("submitted");
    dialog.value = false;
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error(e);
    alert(err?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.eser-dialog__riza--sm :deep(.v-label) {
  font-size: 0.75rem;
}

.pdf-upload__placeholder {
  cursor: pointer;
  border: 2px dashed rgb(var(--v-theme-primary) / 0.4);
  transition: background 0.2s, border-color 0.2s;
}
.pdf-upload__placeholder:hover,
.pdf-upload__placeholder--drag {
  background: rgb(var(--v-theme-primary) / 0.06);
  border-color: rgb(var(--v-theme-primary));
}
.pdf-upload__placeholder-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
}
.pdf-upload__preview {
  border: 1px solid rgb(var(--v-theme-primary) / 0.25);
}
.pdf-upload__preview-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
}
.pdf-upload__preview-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
