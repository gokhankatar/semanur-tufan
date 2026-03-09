<template>
  <div class="admin-section pt-5 pt-lg-15">
    <h2 class="text-headline-small mb-4">Gelen Eserler</h2>

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

    <v-card variant="outlined" class="admin-eserler-card overflow-hidden">
      <v-data-table
        :headers="tableHeaders"
        :items="requests"
        :loading="loading"
        item-value="id"
        :density="display.xl.value ? 'comfortable' : 'compact'"
        :no-data-text="'Henüz eser talebi yok.'"
        class="admin-eserler-table"
        @click:row="onRowClick"
      >
        <template #item.name="{ item }">
          <v-chip
            size="small"
            variant="text"
            prepend-icon="mdi-account-outline"
            :text="getRow(item).name"
          />
        </template>
        <template #item.email="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            prepend-icon="mdi-email-outline"
            :text="getRow(item).email"
            :href="`mailto:${getRow(item).email}`"
            target="_blank"
            class="text-decoration-none rounded"
          />
        </template>
        <template #item.eser_turu="{ item }">
          <v-chip
            :color="getEserTuruColor(getRow(item).eser_turu)"
            variant="tonal"
            size="small"
            :prepend-icon="getEserTuruIcon(getRow(item).eser_turu)"
            :text="getEserTuruLabel(getRow(item).eser_turu)"
          />
        </template>
        <template #item.created_at="{ item }">
          <v-chip
            size="small"
            prepend-icon="mdi-calendar"
            :text="formatDate(getRow(item).created_at)"
          />
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
              size="small"
              title="PDF İndir"
              :href="getRow(item).pdf_url"
              target="_blank"
              rel="noopener"
              @click.stop
            >
              <v-icon icon="mdi-download" size="small" />
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              size="small"
              title="Sil"
              @click.stop="confirmDelete(getRow(item))"
            >
              <v-icon icon="mdi-delete" size="small" />
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="detailDialog" max-width="600" persistent scrollable scrim="rgba(0,0,0,0.6)">
      <v-card variant="elevated" class="admin-dialog-card">
        <v-card-title class="d-flex align-center">
          {{ selectedRequest?.eser_baslik }}
          <v-spacer />
          <v-btn icon variant="text" size="small" @click="detailDialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="selectedRequest" class="pa-4">
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              size="small"
              variant="tonal"
              prepend-icon="mdi-account-outline"
              :text="selectedRequest.name"
            />
            <v-chip
              size="small"
              variant="tonal"
              prepend-icon="mdi-email-outline"
              :text="selectedRequest.email"
              :href="`mailto:${selectedRequest.email}`"
              target="_blank"
              class="text-decoration-none"
            />
            <v-chip
              :color="getEserTuruColor(selectedRequest.eser_turu)"
              variant="tonal"
              size="small"
              :prepend-icon="getEserTuruIcon(selectedRequest.eser_turu)"
            >
              {{ getEserTuruLabel(selectedRequest.eser_turu) }}
            </v-chip>
          </div>
          <p class="text-body-small mb-2"><strong>Açıklama:</strong></p>
          <p class="text-body-small mb-4">{{ selectedRequest.aciklama }}</p>
          <p class="text-body-small mb-2"><strong>Özgeçmiş:</strong></p>
          <p class="text-body-small mb-4">{{ selectedRequest.ozgecmis }}</p>
          <v-btn
            :href="selectedRequest.pdf_url"
            target="_blank"
            rel="noopener"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-file-pdf-box"
            text="PDF İndir"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <AdminEserOnaylaDialog
      v-model="onaylaDialog"
      :request="onaylaRequest"
      @approved="onOnaylaSuccess"
    />

    <v-dialog v-model="deleteDialog" max-width="400" persistent scrim="rgba(0,0,0,0.6)">
      <v-card variant="outlined" class="admin-dialog-card">
        <v-card-title>Eser Talebini Sil</v-card-title>
        <v-card-text>
          "{{ deletingRequest?.eser_baslik }}" ({{ deletingRequest?.name }}) talebini
          silmek istediğinize emin misiniz?
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
import type { ArtworkRequest } from "~/interfaces/artwork";

const display = useDisplay();
const requests = ref<ArtworkRequest[]>([]);
const loading = ref(true);
const error = ref("");
const detailDialog = ref(false);
const selectedRequest = ref<ArtworkRequest | null>(null);
const onaylaDialog = ref(false);
const onaylaRequest = ref<ArtworkRequest | null>(null);
const deleteDialog = ref(false);
const deletingRequest = ref<ArtworkRequest | null>(null);
const deleting = ref(false);

const tableHeaders = [
  { title: "Ad Soyad", key: "name", sortable: true },
  { title: "E-posta", key: "email", sortable: true },
  { title: "Eser Türü", key: "eser_turu", sortable: true },
  { title: "Eser Başlığı", key: "eser_baslik", sortable: true },
  { title: "Tarih", key: "created_at", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const, width: 140 },
];

const getRow = (item: { raw?: ArtworkRequest } | ArtworkRequest) =>
  (item as { raw?: ArtworkRequest }).raw ?? (item as ArtworkRequest);

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

const { fetchArtworkRequests, deleteArtworkRequest } = useArtworkRequests();

const load = async () => {
  loading.value = true;
  error.value = "";
  try {
    requests.value = await fetchArtworkRequests();
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Eser talepleri yüklenemedi.";
  } finally {
    loading.value = false;
  }
};

const onRowClick = (
  _e: unknown,
  { item }: { item: { raw?: ArtworkRequest } | ArtworkRequest }
) => {
  showDetail(getRow(item));
};

const showDetail = (r: ArtworkRequest) => {
  selectedRequest.value = r;
  detailDialog.value = true;
};

const openOnayla = (r: ArtworkRequest) => {
  onaylaRequest.value = r;
  onaylaDialog.value = true;
};

const onOnaylaSuccess = () => {
  onaylaRequest.value = null;
  load();
};

const confirmDelete = (r: ArtworkRequest) => {
  deletingRequest.value = r;
  deleteDialog.value = true;
};

const doDelete = async () => {
  if (!deletingRequest.value?.id) return;
  deleting.value = true;
  try {
    await deleteArtworkRequest(deletingRequest.value.id);
    deleteDialog.value = false;
    deletingRequest.value = null;
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
.admin-eserler-card {
  border: 1px solid rgb(var(--v-theme-primary) / 0.25);
  border-radius: 16px;
  overflow: hidden;
}
.admin-eserler-table :deep(thead th) {
  background: rgb(var(--v-theme-primary) / 0.08);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
.admin-eserler-table :deep(tbody td) {
  border-bottom: 1px solid rgb(var(--v-theme-primary) / 0.1);
}
.admin-eserler-table :deep(tbody tr) {
  cursor: pointer;
}
.admin-eserler-table :deep(tbody tr:hover) {
  background: rgb(var(--v-theme-primary) / 0.04);
}
.admin-dialog-card {
  background: rgb(var(--v-theme-surface)) !important;
  border: none !important;
}
</style>
