<template>
  <div class="admin-section">
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
    <v-card v-if="viewMode === 'table'" variant="outlined" class="overflow-hidden">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Kapak</th>
            <th>Başlık</th>
            <th>Yayıncı</th>
            <th>Sayı</th>
            <th class="text-end">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="j in journals" :key="j.id">
            <td class="py-1">
              <v-avatar size="48" rounded>
                <v-img v-if="j.journal_cover_img" :src="j.journal_cover_img" cover />
                <v-icon v-else icon="mdi-book-open-variant" />
              </v-avatar>
            </td>
            <td>{{ j.journal_title }}</td>
            <td>{{ j.publisher_name }}</td>
            <td>{{ j.journal_volume_number }}</td>
            <td class="text-end">
              <v-btn icon variant="text" size="small" @click="openEdit(j)">
                <v-icon icon="mdi-pencil" size="small" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="confirmDelete(j)"
              >
                <v-icon icon="mdi-delete" size="small" />
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p
        v-if="!loading && journals.length === 0"
        class="text-center py-8 text-medium-emphasis"
      >
        Henüz dergi yok. Eklemek için yukarıdaki butonu kullanın.
      </p>
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
              <v-icon icon="mdi-book-open-variant" size="64" class="text-medium-emphasis" />
            </div>
            <v-card-title class="text-body-medium">{{ j.journal_title }}</v-card-title>
            <v-card-subtitle class="text-caption"
              >Sayı {{ j.journal_volume_number }} · {{ j.publisher_name }}</v-card-subtitle
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
      <p v-else class="text-center py-8 text-medium-emphasis">
        Henüz dergi yok.
      </p>
    </template>

    <!-- List görünümü -->
    <template v-else-if="viewMode === 'list'">
      <v-list v-if="journals.length > 0" variant="outlined" rounded="lg">
        <v-list-item
          v-for="j in journals"
          :key="j.id"
          :prepend-avatar="j.journal_cover_img"
          :title="j.journal_title"
          :subtitle="`Sayı ${j.journal_volume_number} · ${j.publisher_name}`"
          class="mb-2"
          rounded="lg"
        >
          <template #append>
            <v-btn icon variant="text" size="small" @click.stop="openEdit(j)">
              <v-icon icon="mdi-pencil" size="small" />
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              size="small"
              @click.stop="confirmDelete(j)"
            >
              <v-icon icon="mdi-delete" size="small" />
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
      <p v-else class="text-center py-8 text-medium-emphasis">
        Henüz dergi yok.
      </p>
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
      <v-card variant="outlined">
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
      <v-card variant="outlined">
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

const onAddSaved = () => {
  showAddForm.value = false;
  load();
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
</style>
