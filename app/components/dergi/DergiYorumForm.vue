<template>
  <template v-if="embedded">
    <div class="dergi-yorum-form dergi-yorum-form--embedded">
      <div class="dergi-yorum-form__inner">
        <v-form ref="formRef" @submit.prevent="submit">
          <v-textarea
            v-model="commentText"
            label="Yorumunuz"
            placeholder="Dergi hakkında düşüncelerinizi yazın..."
            variant="outlined"
            rows="4"
            :rules="[rules.required]"
            density="compact"
            :disabled="loading"
            hide-details="auto"
            class="mb-3"
            no-resize
            rounded="lg"
            bg-color="surface"
            prepend-inner-icon="mdi-comment-outline"
          />
          <v-checkbox
            v-model="isAnonymous"
            label="Anonim olarak gönder"
            density="compact"
            hide-details
            color="primary"
            :disabled="loading"
            class="mt-0 mb-3"
          />
          <v-text-field
            v-if="!isAnonymous"
            v-model="authorName"
            label="Ad Soyad"
            placeholder="Adınız ve soyadınız"
            variant="outlined"
            :rules="[rules.required]"
            :disabled="loading"
            hide-details="auto"
            class="mb-4"
            density="compact"
            prepend-inner-icon="mdi-account-outline"
            rounded="lg"
            bg-color="surface"
          />
          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            :loading="loading"
            prepend-icon="mdi-send"
            rounded="lg"
            block
          >
            Gönder
          </v-btn>
        </v-form>
      </div>
    </div>
  </template>
  <v-expand-transition v-else>
    <div v-show="modelValue" class="dergi-yorum-form">
      <div class="dergi-yorum-form__inner">
        <div class="dergi-yorum-form__header d-flex align-center justify-space-between mb-4">
          <span class="text-body-large font-weight-medium d-flex align-center ga-2">
            <v-icon icon="mdi-comment-plus-outline" size="22" color="primary" />
            Yorum Yap
          </span>
          <v-btn icon variant="text" size="small" @click="$emit('update:modelValue', false)">
            <v-icon icon="mdi-close" />
          </v-btn>
        </div>
        <v-form ref="formRef" @submit.prevent="submit">
          <v-textarea
            v-model="commentText"
            label="Yorumunuz"
            placeholder="Dergi hakkında düşüncelerinizi yazın..."
            variant="outlined"
            rows="4"
            :rules="[rules.required]"
            density="compact"
            :disabled="loading"
            hide-details="auto"
            class="mb-3"
            no-resize
            rounded="lg"
            bg-color="surface"
            prepend-inner-icon="mdi-comment-outline"
          />
          <v-checkbox
            v-model="isAnonymous"
            label="Anonim olarak gönder"
            density="compact"
            hide-details
            color="primary"
            :disabled="loading"
            class="mt-0 mb-3"
          />
          <v-text-field
            v-if="!isAnonymous"
            v-model="authorName"
            label="Ad Soyad"
            placeholder="Adınız ve soyadınız"
            variant="outlined"
            :rules="[rules.required]"
            :disabled="loading"
            hide-details="auto"
            class="mb-4"
            density="compact"
            prepend-inner-icon="mdi-account-outline"
            rounded="lg"
            bg-color="surface"
          />
          <div class="d-flex ga-2">
            <v-btn type="submit" color="primary" variant="flat" :loading="loading" prepend-icon="mdi-send" rounded="lg">
              Gönder
            </v-btn>
            <v-btn variant="text" @click="$emit('update:modelValue', false)">İptal</v-btn>
          </div>
        </v-form>
      </div>
    </div>
  </v-expand-transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  journalId: string;
  journalTitle: string;
  modelValue: boolean;
  embedded?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [v: boolean];
  success: [];
  error: [message: string];
}>();

const { addIncomingComment } = useJournalComments();

const formRef = ref();
const commentText = ref("");
const authorName = ref("");
const isAnonymous = ref(false);
const loading = ref(false);

const rules = {
  required: (v: string) => !!v?.trim() || "Bu alan zorunludur",
};

const submit = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await addIncomingComment({
      journal_id: props.journalId,
      journal_title: props.journalTitle,
      author_name: isAnonymous.value ? null : authorName.value.trim(),
      is_anonymous: isAnonymous.value,
      comment_text: commentText.value.trim(),
    });
    commentText.value = "";
    authorName.value = "";
    if (!props.embedded) emit("update:modelValue", false);
    emit("success");
  } catch (e: unknown) {
    const err = e as { message?: string };
    emit("error", err?.message || "Yorum gönderilemedi.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dergi-yorum-form {
  margin-top: 1rem;
}
.dergi-yorum-form--embedded .dergi-yorum-form__inner {
  padding: 0;
  background: transparent;
  border: none;
}
.dergi-yorum-form__inner {
  padding: 1.5rem 1.75rem;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary) / 0.06) 0%,
    rgb(var(--v-theme-primary) / 0.02) 100%
  );
  border-radius: 16px;
  border: 1px solid rgb(var(--v-theme-primary) / 0.15);
}
.v-theme--dark .dergi-yorum-form__inner {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary) / 0.12) 0%,
    rgb(var(--v-theme-primary) / 0.04) 100%
  );
  border-color: rgb(var(--v-theme-primary) / 0.2);
}
</style>
