<template>
  <div class="admin-section pt-5 pt-lg-15">
    <h2 class="text-headline-small mb-4">Gelen Yorumlar</h2>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-alert
      v-if="error"
      type="error"
      density="compact"
      closable
      class="mb-4"
      @click:close="error = ''"
    >
      {{ error }}
    </v-alert>

    <v-card variant="outlined" class="admin-yorumlar-card overflow-hidden">
      <v-data-table
        :headers="tableHeaders"
        :items="comments"
        :loading="loading"
        item-value="id"
        :density="display.xl.value ? 'comfortable' : 'compact'"
        no-data-text="Henüz yorum yok."
        class="admin-yorumlar-table"
        @click:row="onRowClick"
      >
        <template #item.author="{ item }">
          <v-chip
            size="small"
            variant="text"
            :prepend-icon="getRow(item).is_anonymous ? 'mdi-account-off-outline' : 'mdi-account-outline'"
            :text="getRow(item).is_anonymous ? 'Anonim' : (getRow(item).author_name || '—')"
          />
        </template>
        <template #item.journal_title="{ item }">
          <v-chip size="small" variant="tonal" prepend-icon="mdi-book-open-variant">
            {{ getRow(item).journal_title }}
          </v-chip>
        </template>
        <template #item.comment_text="{ item }">
          <span class="admin-yorumlar__preview">{{ truncate(getRow(item).comment_text, 60) }}</span>
        </template>
        <template #item.created_at="{ item }">
          <v-chip size="small" prepend-icon="mdi-calendar" :text="formatDate(getRow(item).created_at)" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1">
            <v-btn
              icon
              variant="text"
              size="small"
              color="success"
              title="Onayla"
              @click.stop="openOnayla(getRow(item))"
            >
              <v-icon icon="mdi-check-circle" size="small" />
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              size="small"
              title="Reddet / Sil"
              @click.stop="confirmDelete(getRow(item))"
            >
              <v-icon icon="mdi-delete" size="small" />
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="detailDialog" max-width="560" persistent scrollable scrim="rgba(0,0,0,0.6)">
      <v-card variant="elevated" class="admin-dialog-card">
        <v-card-title class="d-flex align-center">
          Yorum Detayı
          <v-spacer />
          <v-btn icon variant="text" size="small" @click="detailDialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="selectedComment" class="pa-4">
          <v-chip
            size="small"
            variant="tonal"
            prepend-icon="mdi-book-open-variant"
            class="mb-3"
          >
            {{ selectedComment.journal_title }}
          </v-chip>
          <div class="d-flex flex-wrap ga-2 mb-3">
            <v-chip
              size="small"
              variant="tonal"
              :prepend-icon="selectedComment.is_anonymous ? 'mdi-account-off-outline' : 'mdi-account-outline'"
              :text="selectedComment.is_anonymous ? 'Anonim' : (selectedComment.author_name || '—')"
            />
            <v-chip size="small" prepend-icon="mdi-calendar" :text="formatDate(selectedComment.created_at)" />
          </div>
          <p class="text-body-small mb-2"><strong>Yorum:</strong></p>
          <p class="text-body-small mb-4" style="white-space: pre-wrap">{{ selectedComment.comment_text }}</p>
          <div class="d-flex ga-2">
            <v-btn
              color="success"
              variant="tonal"
              prepend-icon="mdi-check-circle"
              @click="openOnayla(selectedComment)"
            >
              Onayla
            </v-btn>
            <v-btn
              color="error"
              variant="tonal"
              prepend-icon="mdi-delete"
              @click="confirmDelete(selectedComment)"
            >
              Sil
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="onaylaDialog" max-width="480" persistent scrim="rgba(0,0,0,0.6)">
      <v-card variant="outlined" class="admin-dialog-card">
        <v-card-title>Yorumu Onayla</v-card-title>
        <v-card-text>
          "{{ onaylaComment?.journal_title }}" dergisine gelen yorumu onaylayıp yayınlamak istiyor musunuz?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="onaylaDialog = false">İptal</v-btn>
          <v-btn color="success" variant="elevated" :loading="onaylaLoading" @click="doOnayla">
            Onayla
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400" persistent scrim="rgba(0,0,0,0.6)">
      <v-card variant="outlined" class="admin-dialog-card">
        <v-card-title>Yorumu Sil</v-card-title>
        <v-card-text>
          Bu yorumu silmek istediğinize emin misiniz?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">İptal</v-btn>
          <v-btn color="error" variant="elevated" :loading="deleting" @click="doDelete">
            Sil
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { IncomingComment } from "~/interfaces/journalComment";

const display = useDisplay();
const comments = ref<IncomingComment[]>([]);
const loading = ref(true);
const error = ref("");
const detailDialog = ref(false);
const selectedComment = ref<IncomingComment | null>(null);
const onaylaDialog = ref(false);
const onaylaComment = ref<IncomingComment | null>(null);
const onaylaLoading = ref(false);
const deleteDialog = ref(false);
const deletingComment = ref<IncomingComment | null>(null);
const deleting = ref(false);

const tableHeaders = [
  { title: "Yazar", key: "author", sortable: true },
  { title: "Dergi", key: "journal_title", sortable: true },
  { title: "Yorum", key: "comment_text", sortable: false },
  { title: "Tarih", key: "created_at", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const, width: 100 },
];

const getRow = (item: { raw?: IncomingComment } | IncomingComment) =>
  (item as { raw?: IncomingComment }).raw ?? (item as IncomingComment);

const formatDate = (d?: string) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const truncate = (s: string, len: number) => {
  if (!s) return "";
  return s.length <= len ? s : s.slice(0, len) + "…";
};

const {
  fetchIncomingComments,
  deleteIncomingComment,
  approveComment,
} = useJournalComments();

const load = async () => {
  loading.value = true;
  error.value = "";
  try {
    comments.value = await fetchIncomingComments();
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Yorumlar yüklenemedi.";
  } finally {
    loading.value = false;
  }
};

const onRowClick = (
  _e: unknown,
  { item }: { item: { raw?: IncomingComment } | IncomingComment }
) => {
  selectedComment.value = getRow(item);
  detailDialog.value = true;
};

const openOnayla = (c: IncomingComment) => {
  detailDialog.value = false;
  onaylaComment.value = c;
  onaylaDialog.value = true;
};

const doOnayla = async () => {
  if (!onaylaComment.value?.journal_id) return;
  onaylaLoading.value = true;
  try {
    await approveComment(onaylaComment.value, onaylaComment.value.journal_id);
    onaylaDialog.value = false;
    onaylaComment.value = null;
    load();
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Onaylanamadı.";
  } finally {
    onaylaLoading.value = false;
  }
};

const confirmDelete = (c: IncomingComment) => {
  detailDialog.value = false;
  deletingComment.value = c;
  deleteDialog.value = true;
};

const doDelete = async () => {
  if (!deletingComment.value?.id) return;
  deleting.value = true;
  try {
    await deleteIncomingComment(deletingComment.value.id);
    deleteDialog.value = false;
    deletingComment.value = null;
    load();
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Silinemedi.";
  } finally {
    deleting.value = false;
  }
};

onMounted(load);
</script>

<style scoped>
.admin-yorumlar-card {
  border: 1px solid rgb(var(--v-theme-primary) / 0.25);
  border-radius: 16px;
  overflow: hidden;
}
.admin-yorumlar-table :deep(thead th) {
  background: rgb(var(--v-theme-primary) / 0.08);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
.admin-yorumlar-table :deep(tbody td) {
  border-bottom: 1px solid rgb(var(--v-theme-primary) / 0.1);
}
.admin-yorumlar-table :deep(tbody tr) {
  cursor: pointer;
}
.admin-yorumlar-table :deep(tbody tr:hover) {
  background: rgb(var(--v-theme-primary) / 0.04);
}
.admin-yorumlar__preview {
  font-size: 0.8125rem;
  max-width: 200px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.admin-dialog-card {
  background: rgb(var(--v-theme-surface)) !important;
  border: none !important;
}
</style>
