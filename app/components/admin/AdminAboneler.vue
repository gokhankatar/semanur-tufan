<template>
  <div class="admin-section pt-5 pt-lg-15">
    <h2 class="text-headline-small mb-4">Aboneler</h2>

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

    <v-card variant="outlined" class="admin-aboneler-card overflow-hidden">
      <v-data-table
        :headers="tableHeaders"
        :items="subscribers"
        :loading="loading"
        item-value="id"
        density="comfortable"
        :no-data-text="'Henüz abone yok.'"
        class="admin-aboneler-table"
      >
        <template #item.created_at="{ item }">
          {{ formatDate(getRow(item).created_at) }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            icon
            variant="text"
            color="error"
            size="small"
            @click="confirmDelete(getRow(item))"
          >
            <v-icon icon="mdi-delete" size="small" />
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card variant="outlined" class="admin-dialog-card">
        <v-card-title>Aboneyi Sil</v-card-title>
        <v-card-text>
          "{{ deletingSubscriber?.name }} {{ deletingSubscriber?.surname }}" ({{ deletingSubscriber?.email }}) aboneliğini silmek istediğinize emin misiniz?
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
import type { Subscriber } from "~/interfaces";

const { fetchSubscribers, deleteSubscriber } = useSubscribers();
const subscribers = ref<Subscriber[]>([]);
const loading = ref(true);
const error = ref("");
const deleteDialog = ref(false);
const deletingSubscriber = ref<Subscriber | null>(null);
const deleting = ref(false);

const tableHeaders = [
  { title: "Ad", key: "name" },
  { title: "Soyad", key: "surname" },
  { title: "E-posta", key: "email" },
  { title: "Kayıt Tarihi", key: "created_at", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const, width: 60 },
];

const getRow = (item: { raw?: Subscriber } | Subscriber) =>
  (item as { raw?: Subscriber }).raw ?? (item as Subscriber);

const formatDate = (ts?: { seconds: number }) => {
  if (!ts?.seconds) return "—";
  try {
    return new Date(ts.seconds * 1000).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const load = async () => {
  loading.value = true;
  error.value = "";
  try {
    subscribers.value = await fetchSubscribers();
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Aboneler yüklenemedi.";
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (s: Subscriber) => {
  deletingSubscriber.value = s;
  deleteDialog.value = true;
};

const doDelete = async () => {
  if (!deletingSubscriber.value?.id) return;
  deleting.value = true;
  try {
    await deleteSubscriber(deletingSubscriber.value.id);
    deleteDialog.value = false;
    deletingSubscriber.value = null;
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
.admin-aboneler-card {
  border: 1px solid rgb(var(--v-theme-primary) / 0.25);
  border-radius: 16px;
  overflow: hidden;
}
.admin-aboneler-table :deep(thead th) {
  background: rgb(var(--v-theme-primary) / 0.08);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
.admin-aboneler-table :deep(tbody td) {
  border-bottom: 1px solid rgb(var(--v-theme-primary) / 0.1);
}
</style>
