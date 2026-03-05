<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Özet</h2>

    <!-- İstatistik kartları -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="4">
        <div class="admin-ozet__card admin-ozet__card--primary">
          <div class="admin-ozet__card-icon">
            <v-icon icon="mdi-file-pdf-box" size="40" />
          </div>
          <div class="admin-ozet__card-content">
            <span class="admin-ozet__card-value">{{ stats.journalCount }}</span>
            <span class="admin-ozet__card-label">PDF</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <div class="admin-ozet__card admin-ozet__card--secondary">
          <div class="admin-ozet__card-icon">
            <v-icon icon="mdi-post" size="40" />
          </div>
          <div class="admin-ozet__card-content">
            <span class="admin-ozet__card-value">{{ stats.blogCount }}</span>
            <span class="admin-ozet__card-label">Blog</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <div class="admin-ozet__card admin-ozet__card--secondary">
          <div class="admin-ozet__card-icon">
            <v-icon icon="mdi-briefcase" size="40" />
          </div>
          <div class="admin-ozet__card-content">
            <span class="admin-ozet__card-value">{{ stats.calismaCount }}</span>
            <span class="admin-ozet__card-label">Çalışma</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-card flat class="admin-ozet__profil-card pa-4 pa-md-6">
      <p class="text-caption text-medium-emphasis mb-3">Profil</p>
      <div class="d-flex align-center ga-3 mb-4">
        <v-avatar
          size="56"
          color="primary"
          variant="tonal"
          class="admin-ozet__avatar"
          @click="avatarInput?.click()"
        >
          <v-img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" cover />
          <v-icon v-else icon="mdi-account" size="32" />
        </v-avatar>
        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="d-none"
          @change="$emit('avatar-change', $event)"
        />
        <div>
          <p class="text-body-medium font-weight-medium mb-0">
            {{ authStore.user?.email }}
          </p>
          <p class="text-body-small text-medium-emphasis mb-0">
            Son giriş: {{ lastLoginFormatted }}
          </p>
        </div>
      </div>
      <div class="d-flex flex-wrap ga-2">
        <v-btn
          size="small"
          variant="tonal"
          prepend-icon="mdi-camera"
          :loading="avatarLoading"
          @click="avatarInput?.click()"
        >
          Fotoğraf Değiştir
        </v-btn>
        <v-btn
          size="small"
          variant="tonal"
          prepend-icon="mdi-lock-reset"
          @click="$emit('password-click')"
        >
          Şifre Değiştir
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

defineProps<{
  stats: { journalCount: number; blogCount: number; calismaCount: number };
  userProfile: { avatar_url?: string } | null;
  lastLoginFormatted: string;
  avatarLoading: boolean;
}>();

defineEmits<{
  "avatar-change": [e: Event];
  "password-click": [];
}>();

const avatarInput = ref<HTMLInputElement | null>(null);
</script>

<style scoped>
.admin-section {
  animation: fadeIn 0.3s ease;
}

.admin-ozet__card {
  position: relative;
  padding: 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.admin-ozet__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.admin-ozet__card--primary {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary, 13 20 33));
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.admin-ozet__card--primary .admin-ozet__card-icon {
  opacity: 0.9;
}

.admin-ozet__card--secondary {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border: 1px solid rgb(var(--v-theme-primary) / 0.35);
}

.admin-ozet__card--secondary .admin-ozet__card-icon {
  color: rgb(var(--v-theme-primary));
  opacity: 0.8;
}

.admin-ozet__card-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  opacity: 0.6;
}

.admin-ozet__card-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: auto;
}

.admin-ozet__card-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.admin-ozet__card-label {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
}

.admin-ozet__profil-card {
  box-shadow: none !important;
  background: transparent !important;
  border: 1px solid rgb(var(--v-theme-primary) / 0.25);
  border-radius: 12px;
}

.admin-ozet__avatar {
  cursor: pointer;
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
