<template>
  <div class="admin-section pt-5 pt-lg-15">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <h2 class="text-headline-small mb-0">Dergiler</h2>
      <div class="d-flex align-center ga-2">
        <v-btn-toggle
          v-model="viewMode"
          density="compact"
          variant="outlined"
          divided
          mandatory
        >
          <v-btn value="table" size="small" icon>
            <v-icon icon="mdi-table" />
          </v-btn>
          <v-btn value="card" size="small" icon>
            <v-icon icon="mdi-view-module" />
          </v-btn>
          <v-btn value="list" size="small" icon>
            <v-icon icon="mdi-view-list" />
          </v-btn>
        </v-btn-toggle>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openAdd">
          Dergi Ekle
        </v-btn>
      </div>
    </div>

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

    <!-- Tablo görünümü -->
    <v-card
      v-if="viewMode === 'table'"
      variant="outlined"
      class="admin-dergiler-card overflow-hidden"
    >
      <v-data-table
        :headers="tableHeaders"
        :items="journals"
        :loading="loading"
        item-value="id"
        density="comfortable"
        :no-data-text="'Henüz dergi yok. Eklemek için yukarıdaki butonu kullanın.'"
        class="admin-dergiler-table"
      >
        <template #item.journal_cover_img="{ item }">
          <v-avatar size="48" rounded>
            <v-img
              v-if="getRow(item).journal_cover_img"
              :src="getRow(item).journal_cover_img"
              cover
            />
            <v-icon v-else icon="mdi-book-open-variant" />
          </v-avatar>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn icon variant="text" size="small" @click="openEdit(getRow(item))">
              <v-icon icon="mdi-pencil" size="small" />
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              size="small"
              @click="confirmDelete(getRow(item))"
            >
              <v-icon icon="mdi-delete" size="small" />
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Card görünümü -->
    <template v-else-if="viewMode === 'card'">
      <v-row v-if="journals.length > 0" dense>
        <v-col v-for="j in journals" :key="j.id" cols="12" sm="6" md="4" lg="3">
          <v-card variant="outlined" class="h-100 d-flex flex-column">
            <v-img
              v-if="j.journal_cover_img"
              :src="j.journal_cover_img"
              aspect-ratio="0.7"
              cover
              class="bg-grey-lighten-3"
            />
            <div v-else class="d-flex align-center justify-center pa-8 bg-grey-lighten-3">
              <v-icon
                icon="mdi-book-open-variant"
                size="64"
                class="text-medium-emphasis"
              />
            </div>
            <v-card-title class="text-body-medium">{{ j.journal_title }}</v-card-title>
            <v-card-subtitle class="text-caption"
              >Sayı {{ j.journal_volume_number }} ·
              {{ j.publisher_name }}</v-card-subtitle
            >
            <v-spacer />
            <v-card-actions class="pt-0">
              <v-btn variant="text" size="small" @click="openEdit(j)">Düzenle</v-btn>
              <v-btn variant="text" color="error" size="small" @click="confirmDelete(j)"
                >Sil</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <p v-else class="text-center py-8 text-medium-emphasis">Henüz dergi yok.</p>
    </template>

    <!-- List görünümü -->
    <template v-else-if="viewMode === 'list'">
      <div v-if="journals.length > 0" class="admin-dergiler-list">
        <v-card
          v-for="j in journals"
          :key="j.id"
          variant="outlined"
          class="admin-dergiler-list-item"
          rounded="xl"
        >
          <div
            class="admin-dergiler-list-item__inner d-flex flex-column align-start flex-sm-row align-sm-center"
          >
            <v-avatar size="64" rounded class="admin-dergiler-list-item__avatar">
              <v-img v-if="j.journal_cover_img" :src="j.journal_cover_img" cover />
              <v-icon v-else icon="mdi-book-open-variant" size="32" />
            </v-avatar>
            <div class="admin-dergiler-list-item__content">
              <h3 class="admin-dergiler-list-item__title">{{ j.journal_title }}</h3>
              <p class="admin-dergiler-list-item__meta">
                Sayı {{ j.journal_volume_number }} · {{ j.publisher_name }}
              </p>
            </div>
            <div class="admin-dergiler-list-item__actions">
              <v-btn
                variant="tonal"
                size="small"
                prepend-icon="mdi-pencil"
                rounded="lg"
                @click="openEdit(j)"
              >
                Düzenle
              </v-btn>
              <v-btn
                variant="tonal"
                color="error"
                size="small"
                prepend-icon="mdi-delete"
                rounded="lg"
                @click="confirmDelete(j)"
              >
                Sil
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>
      <p v-else class="text-center py-8 text-medium-emphasis">Henüz dergi yok.</p>
    </template>

    <!-- Ekleme formu - dergilerin altında inline -->
    <v-expand-transition>
      <v-card v-if="showAddForm" variant="outlined" class="mt-4">
        <v-card-title class="d-flex align-center">
          <span>Dergi Ekle</span>
          <v-spacer />
          <v-btn icon variant="text" @click="showAddForm = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <AdminDergiEkle v-if="showAddForm" embedded @saved="onAddSaved" />
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <!-- Düzenleme dialog -->
    <v-dialog v-model="editDialog" max-width="800" persistent scrollable>
      <v-card variant="outlined" class="admin-dialog-card">
        <v-card-title class="d-flex align-center">
          <span>Dergi Düzenle</span>
          <v-spacer />
          <v-btn icon variant="text" @click="editDialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4" style="max-height: 70vh; overflow-y: auto">
          <AdminDergiForm
            v-if="editingJournal"
            :journal="editingJournal"
            @saved="onEditSaved"
            @cancel="editDialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Silme onay -->
    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card variant="outlined" class="admin-dialog-card">
        <v-card-title>Dergiyi Sil</v-card-title>
        <v-card-text>
          "{{ deletingJournal?.journal_title }}" dergisini silmek istediğinize emin
          misiniz?
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
import type { Journal } from "~/interfaces";

const viewMode = ref<"table" | "card" | "list">("table");
const { fetchJournals, deleteJournal } = useJournals();
const journals = ref<Journal[]>([]);

const tableHeaders = [
  { title: "Kapak", key: "journal_cover_img", sortable: false, width: 80 },
  { title: "Başlık", key: "journal_title" },
  { title: "Yayıncı", key: "publisher_name" },
  { title: "Sayı", key: "journal_volume_number", align: "center" as const },
  { title: "İşlemler", key: "actions", sortable: false, align: "end" as const },
];

const getRow = (item: { raw?: Journal } | Journal) =>
  (item as { raw?: Journal }).raw ?? (item as Journal);
const loading = ref(true);
const error = ref("");
const showAddForm = ref(false);
const editDialog = ref(false);
const editingJournal = ref<Journal | null>(null);
const deleteDialog = ref(false);
const deletingJournal = ref<Journal | null>(null);
const deleting = ref(false);

const load = async () => {
  loading.value = true;
  error.value = "";
  try {
    journals.value = await fetchJournals();
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Dergiler yüklenemedi.";
  } finally {
    loading.value = false;
  }
};

const openAdd = () => {
  showAddForm.value = true;
};

const { notifySubscribers } = useNotifySubscribers();

const onAddSaved = async (title?: string) => {
  showAddForm.value = false;
  await load();
  if (title) await notifySubscribers('dergi', title);
};

const openEdit = (j: Journal) => {
  editingJournal.value = j;
  editDialog.value = true;
};

const onEditSaved = () => {
  editDialog.value = false;
  editingJournal.value = null;
  load();
};

const confirmDelete = (j: Journal) => {
  deletingJournal.value = j;
  deleteDialog.value = true;
};

const doDelete = async () => {
  if (!deletingJournal.value?.id) return;
  deleting.value = true;
  try {
    await deleteJournal(deletingJournal.value.id);
    deleteDialog.value = false;
    deletingJournal.value = null;
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

/* Tablo - border ve stil */
.admin-dergiler-card {
  border: 1px solid rgb(var(--v-theme-primary) / 0.25) !important;
  border-radius: 16px;
  overflow: hidden;
}
.admin-dergiler-table :deep(.v-table) {
  border-collapse: separate;
}
.admin-dergiler-table :deep(thead th) {
  background: rgb(var(--v-theme-primary) / 0.08);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 16px;
  border-bottom: 1px solid rgb(var(--v-theme-primary) / 0.2);
}
.admin-dergiler-table :deep(tbody td) {
  padding: 12px 16px;
  border-bottom: 1px solid rgb(var(--v-theme-primary) / 0.1);
}
.admin-dergiler-table :deep(tbody tr:hover) {
  background: rgb(var(--v-theme-primary) / 0.04);
}
.admin-dergiler-table :deep(tbody tr:last-child td) {
  border-bottom: none;
}
.admin-dergiler-table :deep(.v-data-table__loading) {
  background: rgb(var(--v-theme-primary) / 0.03);
}

/* List görünümü */
.admin-dergiler-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.admin-dergiler-list-item {
  border: 1px solid rgb(var(--v-theme-primary) / 0.2) !important;
  border-radius: 16px !important;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.admin-dergiler-list-item:hover {
  border-color: rgb(var(--v-theme-primary) / 0.35) !important;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
}
.admin-dergiler-list-item__inner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
}
.admin-dergiler-list-item__avatar {
  flex-shrink: 0;
  border: 1px solid rgb(var(--v-theme-primary) / 0.15);
}
.admin-dergiler-list-item__content {
  flex: 1;
  min-width: 0;
}
.admin-dergiler-list-item__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: inherit;
}
.admin-dergiler-list-item__meta {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  margin: 0;
}
.admin-dergiler-list-item__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* Dialog kartları - arka plan, border yok */
.admin-dialog-card {
  background: rgb(var(--v-theme-surface)) !important;
  border: none !important;
}

@media (max-width: 600px) {
  .admin-dergiler-list-item__inner {
    flex-wrap: wrap;
  }
  .admin-dergiler-list-item__actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid rgb(var(--v-theme-primary) / 0.1);
  }
}
</style>
