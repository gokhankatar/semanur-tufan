<template>
  <div class="admin-section">
    <h2 v-if="!embedded" class="text-headline-small mb-4">{{ editBlog ? 'Blog Düzenle' : 'Blog Yazısı Ekle' }}</h2>

    <v-card variant="outlined" class="pa-4 pa-md-6 position-relative">
      <v-overlay
        :model-value="loading"
        contained
        class="align-center justify-center"
        scrim="rgba(0,0,0,0.5)"
      >
        <div class="d-flex flex-column align-center ga-3">
          <v-progress-circular indeterminate color="primary" size="56" width="4" />
          <span class="text-body-medium font-weight-medium">Blog kaydediliyor...</span>
        </div>
      </v-overlay>

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
            v-if="!coverFile?.length && !editBlog?.cover_img"
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
              <span class="text-body-medium">Blog kapak görseli seçin</span>
              <span class="text-caption text-medium-emphasis mt-1">veya sürükleyip bırakın</span>
            </div>
          </v-card>
          <v-card v-else variant="outlined" class="cover-upload__preview" rounded="lg">
            <div class="cover-upload__preview-inner">
              <img :src="coverPreviewUrl || (editBlog?.cover_img ?? '')" alt="Kapak önizleme" class="cover-upload__img" />
                <div class="cover-upload__preview-info">
                <span class="text-body-small font-weight-medium">{{ coverFile[0]?.name || 'Mevcut kapak' }}</span>
                <span v-if="coverFile[0]" class="text-caption text-medium-emphasis">{{ formatFileSize(coverFile[0]?.size || 0) }}</span>
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
          v-model="form.blog_title"
          label="Blog Başlığı"
          :rules="[rules.required]"
          variant="outlined"
          prepend-inner-icon="mdi-format-title"
          rounded="lg"
          class="mb-3"
          :density="display.xl.value ? 'comfortable' : 'compact'"
          hide-details="auto"
        />

        <v-textarea
          v-model="form.blog_content"
          label="İçerik"
          :rules="[rules.required]"
          variant="outlined"
          prepend-inner-icon="mdi-text-box"
          rows="8"
          rounded="lg"
          class="mb-3"
          :density="display.xl.value ? 'comfortable' : 'compact'"
          hide-details="auto"
          no-resize
        />

        <v-autocomplete
          v-model="keywordsArray"
          label="Anahtar Kelimeler"
          variant="outlined"
          prepend-inner-icon="mdi-tag-multiple"
          placeholder="Yazıp Enter ile ekleyin"
          rounded="lg"
          class="mb-4"
          multiple
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
        <v-alert v-if="success" type="success" class="mb-4" density="compact" closable>
          Blog başarıyla eklendi!
        </v-alert>

        <div class="d-flex ga-2">
          <v-btn v-if="editBlog" variant="text" @click="emit('cancel')">İptal</v-btn>
          <v-btn type="submit" color="primary" :prepend-icon="editBlog ? 'mdi-content-save' : 'mdi-plus'" :loading="loading">
            {{ editBlog ? 'Kaydet' : 'Blog Ekle' }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Blog } from "~/interfaces";

const props = defineProps<{ editBlog?: Blog; embedded?: boolean }>();
const emit = defineEmits<{ saved: []; cancel: [] }>();
const display = useDisplay();
const { addBlog, updateBlog } = useBlogs();
const { uploadFile } = useProfileUpload();

const form = reactive<Omit<Blog, "id">>({
  cover_img: props.editBlog?.cover_img ?? "",
  blog_title: props.editBlog?.blog_title ?? "",
  blog_content: props.editBlog?.blog_content ?? "",
  blog_keywords: props.editBlog?.blog_keywords ?? [],
});

const coverFile = ref<File[]>(props.editBlog?.cover_img ? [] : []);
const coverInputRef = ref<HTMLInputElement | null>(null);
const coverPreviewUrl = ref("");
const coverError = ref("");
const coverDragOver = ref(false);
const keywordsArray = ref<string[]>(props.editBlog?.blog_keywords ?? []);
const keywordSuggestions = ["edebiyat", "sanat", "kültür", "deneme", "yazı", "kitap"];
const keywordSearch = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);
const formRef = ref();

const keywordItems = computed(() => {
  const search = keywordSearch.value?.trim().toLowerCase();
  if (!search) return keywordSuggestions;
  const filtered = keywordSuggestions.filter((k) => k.toLowerCase().includes(search));
  return filtered.includes(search) ? filtered : [search, ...filtered];
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

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  const cover = coverFile.value?.[0];
  const hasCover = cover || props.editBlog?.cover_img;
  if (!hasCover) {
    error.value = "Kapak görseli gerekli";
    return;
  }

  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    let coverUrl = props.editBlog?.cover_img ?? "";
    if (cover) {
      coverUrl = await uploadFile("blogs", cover);
    }
    const keywords = [...keywordsArray.value];

    if (props.editBlog?.id) {
      await updateBlog(props.editBlog.id, {
        cover_img: coverUrl,
        blog_title: form.blog_title,
        blog_content: form.blog_content,
        blog_keywords: keywords,
      });
    } else {
      await addBlog({
        ...form,
        cover_img: coverUrl,
        blog_keywords: keywords,
      });
    }

    success.value = true;
    if (!props.editBlog) {
      form.blog_title = "";
      form.blog_content = "";
      form.blog_keywords = [];
      keywordsArray.value = [];
      coverFile.value = [];
      revokeCoverPreview();
    }
    emit("saved");
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Blog eklenirken bir hata oluştu.";
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
