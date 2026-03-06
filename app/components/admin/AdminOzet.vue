<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Özet</h2>

    <!-- İstatistik kartları -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="6" md="4" lg="2">
        <div class="admin-ozet__card admin-ozet__card--primary">
          <div class="admin-ozet__card-icon">
            <v-icon icon="mdi-book-open-variant" size="36" />
          </div>
          <div class="admin-ozet__card-content">
            <span class="admin-ozet__card-value">{{ stats.journalCount }}</span>
            <span class="admin-ozet__card-label">Dergiler</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <div class="admin-ozet__card admin-ozet__card--secondary">
          <div class="admin-ozet__card-icon">
            <v-icon icon="mdi-post" size="36" />
          </div>
          <div class="admin-ozet__card-content">
            <span class="admin-ozet__card-value">{{ stats.blogCount }}</span>
            <span class="admin-ozet__card-label">Blog</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <div class="admin-ozet__card admin-ozet__card--secondary">
          <div class="admin-ozet__card-icon">
            <v-icon icon="mdi-briefcase" size="36" />
          </div>
          <div class="admin-ozet__card-content">
            <span class="admin-ozet__card-value">{{ stats.calismaCount }}</span>
            <span class="admin-ozet__card-label">Çalışma</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <div class="admin-ozet__card admin-ozet__card--secondary">
          <div class="admin-ozet__card-icon">
            <v-icon icon="mdi-format-list-checks" size="36" />
          </div>
          <div class="admin-ozet__card-content">
            <span class="admin-ozet__card-value">{{ stats.todoCount }}</span>
            <span class="admin-ozet__card-label">Yapılacak</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <div class="admin-ozet__card admin-ozet__card--secondary">
          <div class="admin-ozet__card-icon">
            <v-icon icon="mdi-email-multiple" size="36" />
          </div>
          <div class="admin-ozet__card-content">
            <span class="admin-ozet__card-value">{{ stats.subscriberCount }}</span>
            <span class="admin-ozet__card-label">Abone</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-card variant="outlined" class="admin-ozet__profil-card pa-4 pa-md-6">
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
  stats: { journalCount: number; blogCount: number; calismaCount: number; todoCount: number; subscriberCount: number };
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
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.admin-ozet__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgb(0 0 0 / 0.12);
}

.admin-ozet__card--primary {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border: 2px solid rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgb(var(--v-theme-primary) / 0.25);
}
.admin-ozet__card--primary:hover {
  box-shadow: 0 12px 28px rgb(var(--v-theme-primary) / 0.35);
}
.admin-ozet__card--primary .admin-ozet__card-icon {
  opacity: 0.95;
}

.admin-ozet__card--secondary {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border: 2px solid rgb(var(--v-theme-primary) / 0.4);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.06);
}
.admin-ozet__card--secondary:hover {
  border-color: rgb(var(--v-theme-primary) / 0.6);
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.1);
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
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.admin-ozet__card-label {
  font-size: 0.8125rem;
  font-weight: 600;
  opacity: 0.95;
}

.admin-ozet__profil-card {
  border: 2px solid rgb(var(--v-theme-primary) / 0.3) !important;
  border-radius: 16px !important;
  background: rgb(var(--v-theme-surface)) !important;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.06) !important;
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
