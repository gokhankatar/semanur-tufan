<template>
  <div class="admin-section">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <h2 class="text-headline-small mb-0">Bloglar</h2>
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
          Blog Ekle
        </v-btn>
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-alert v-if="error" type="error" density="compact" closable class="mb-4" @click:close="error = ''">
      {{ error }}
    </v-alert>

    <!-- Tablo görünümü -->
    <v-card v-if="viewMode === 'table'" variant="outlined" class="overflow-hidden">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Kapak</th>
            <th>Başlık</th>
            <th class="text-end">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in blogs" :key="b.id">
            <td>
              <v-avatar size="48" rounded>
                <v-img v-if="b.cover_img" :src="b.cover_img" cover />
                <v-icon v-else icon="mdi-post" />
              </v-avatar>
            </td>
            <td>{{ b.blog_title }}</td>
            <td class="text-end">
              <v-btn icon variant="text" size="small" @click="openEdit(b)">
                <v-icon icon="mdi-pencil" size="small" />
              </v-btn>
              <v-btn icon variant="text" color="error" size="small" @click="confirmDelete(b)">
                <v-icon icon="mdi-delete" size="small" />
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p v-if="!loading && blogs.length === 0" class="text-center py-8 text-medium-emphasis">
        Henüz blog yok. Eklemek için yukarıdaki butonu kullanın.
      </p>
    </v-card>

    <!-- Card görünümü -->
    <v-row v-else-if="viewMode === 'card'" dense>
      <v-col v-for="b in blogs" :key="b.id" cols="12" sm="6" md="4" lg="3">
        <v-card variant="outlined" class="h-100 d-flex flex-column">
          <v-img
            v-if="b.cover_img"
            :src="b.cover_img"
            aspect-ratio="1.5"
            cover
            class="bg-grey-lighten-3"
          />
          <div v-else class="d-flex align-center justify-center pa-8 bg-grey-lighten-3">
            <v-icon icon="mdi-post" size="64" class="text-medium-emphasis" />
          </div>
          <v-card-title class="text-body-medium">{{ b.blog_title }}</v-card-title>
          <v-spacer />
          <v-card-actions class="pt-0">
            <v-btn variant="text" size="small" @click="openEdit(b)">Düzenle</v-btn>
            <v-btn variant="text" color="error" size="small" @click="confirmDelete(b)">Sil</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <p v-else-if="viewMode === 'card' && !loading && blogs.length === 0" class="text-center py-8 text-medium-emphasis">
      Henüz blog yok.
    </p>

    <!-- List görünümü -->
    <v-list v-else-if="viewMode === 'list'" variant="outlined" rounded="lg">
      <v-list-item
        v-for="b in blogs"
        :key="b.id"
        :prepend-avatar="b.cover_img"
        :title="b.blog_title"
        class="mb-2"
        rounded="lg"
      >
        <template #append>
          <v-btn icon variant="text" size="small" @click.stop="openEdit(b)">
            <v-icon icon="mdi-pencil" size="small" />
          </v-btn>
          <v-btn icon variant="text" color="error" size="small" @click.stop="confirmDelete(b)">
            <v-icon icon="mdi-delete" size="small" />
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
    <p v-else-if="viewMode === 'list' && !loading && blogs.length === 0" class="text-center py-8 text-medium-emphasis">
      Henüz blog yok.
    </p>

    <!-- Ekleme dialog -->
    <v-dialog v-model="addDialog" max-width="700" persistent scrollable>
      <v-card variant="outlined">
        <v-card-title class="d-flex align-center">
          <span>Blog Ekle</span>
          <v-spacer />
          <v-btn icon variant="text" @click="addDialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4" style="max-height: 70vh; overflow-y: auto">
          <AdminBlogEkle v-if="addDialog" embedded @saved="onAddSaved" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Düzenleme dialog -->
    <v-dialog v-model="editDialog" max-width="700" persistent scrollable>
      <v-card variant="outlined">
        <v-card-title class="d-flex align-center">
          <span>Blog Düzenle</span>
          <v-spacer />
          <v-btn icon variant="text" @click="editDialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4" style="max-height: 70vh; overflow-y: auto">
          <AdminBlogEkle
            v-if="editingBlog"
            :edit-blog="editingBlog"
            embedded
            @saved="onEditSaved"
            @cancel="editDialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Silme onay -->
    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card variant="outlined">
        <v-card-title>Blogu Sil</v-card-title>
        <v-card-text>
          "{{ deletingBlog?.blog_title }}" blogunu silmek istediğinize emin misiniz?
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
import type { Blog } from '~/interfaces'

const viewMode = ref<'table' | 'card' | 'list'>('table')
const { fetchBlogs, deleteBlog } = useBlogs()
const blogs = ref<Blog[]>([])
const loading = ref(true)
const error = ref('')
const addDialog = ref(false)
const editDialog = ref(false)
const editingBlog = ref<Blog | null>(null)
const deleteDialog = ref(false)
const deletingBlog = ref<Blog | null>(null)
const deleting = ref(false)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    blogs.value = await fetchBlogs()
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err?.message || 'Bloglar yüklenemedi.'
  } finally {
    loading.value = false
  }
}

const openAdd = () => {
  addDialog.value = true
}

const onAddSaved = () => {
  addDialog.value = false
  load()
}

const openEdit = (b: Blog) => {
  editingBlog.value = b
  editDialog.value = true
}

const onEditSaved = () => {
  editDialog.value = false
  editingBlog.value = null
  load()
}

const confirmDelete = (b: Blog) => {
  deletingBlog.value = b
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deletingBlog.value?.id) return
  deleting.value = true
  try {
    await deleteBlog(deletingBlog.value.id)
    deleteDialog.value = false
    deletingBlog.value = null
    load()
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err?.message || 'Silinemedi.'
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.admin-section {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
