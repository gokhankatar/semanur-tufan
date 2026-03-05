<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Profil</h2>

    <v-card variant="tonal" class="pa-4 pa-md-6">
      <!-- Profil fotoğrafı - hover'da kalem ikonu -->
      <div class="d-flex align-center ga-4 mb-4">
        <div
          class="admin-profil__avatar-wrap"
          @click="avatarInput?.click()"
        >
          <v-avatar
            size="80"
            color="primary"
            variant="tonal"
            class="admin-profil__avatar"
          >
            <v-img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" cover />
            <v-icon v-else icon="mdi-account" size="40" />
          </v-avatar>
          <div class="admin-profil__avatar-overlay">
            <v-icon icon="mdi-pencil" size="24" color="primary" />
          </div>
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            class="d-none"
            @change="$emit('avatar-change', $event)"
          />
        </div>
        <div>
          <p class="text-body-medium font-weight-medium mb-0">{{ authStore.user?.email }}</p>
          <p class="text-caption text-medium-emphasis mb-0">Fotoğrafı değiştirmek için tıkla</p>
        </div>
      </div>

      <v-divider class="my-4" />

      <p class="text-body-small font-weight-medium mb-2">E-posta Değiştir</p>
      <v-text-field
        :model-value="newEmail"
        label="Yeni e-posta"
        type="email"
        variant="outlined"
        hide-details="auto"
        class="mb-3"
        @update:model-value="$emit('update:newEmail', $event)"
      />
      <v-text-field
        :model-value="emailPassword"
        label="Mevcut şifre (doğrulama için)"
        :type="showEmailPassword ? 'text' : 'password'"
        variant="outlined"
        hide-details="auto"
        :append-inner-icon="showEmailPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showEmailPassword = !showEmailPassword"
        @update:model-value="$emit('update:emailPassword', $event)"
      />
      <v-alert v-if="emailError" type="error" density="compact" class="mb-3">
        {{ emailError }}
      </v-alert>
      <v-btn
        color="primary"
        variant="tonal"
        :loading="emailLoading"
        class="mb-4"
        @click="$emit('email-save')"
      >
        E-postayı Kaydet
      </v-btn>

      <v-divider class="my-4" />

      <p class="text-body-small font-weight-medium mb-2">Şifre Değiştir</p>
      <v-text-field
        :model-value="newPassword"
        label="Yeni şifre"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        hide-details="auto"
        class="mb-2"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="$emit('update:showPassword', !showPassword)"
        @update:model-value="$emit('update:newPassword', $event)"
      />
      <v-alert v-if="passwordError" type="error" density="compact" class="mb-3">
        {{ passwordError }}
      </v-alert>
      <v-btn
        color="primary"
        variant="tonal"
        :loading="passwordLoading"
        @click="$emit('password-save')"
      >
        Şifreyi Kaydet
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const showEmailPassword = ref(false)

defineProps<{
  userProfile: { avatar_url?: string } | null
  avatarLoading: boolean
  newEmail: string
  emailPassword: string
  emailLoading: boolean
  emailError: string
  newPassword: string
  showPassword: boolean
  passwordLoading: boolean
  passwordError: string
}>()

defineEmits<{
  'update:newEmail': [v: string]
  'update:emailPassword': [v: string]
  'update:newPassword': [v: string]
  'update:showPassword': [v: boolean]
  'avatar-change': [e: Event]
  'email-save': []
  'password-save': []
}>()

const avatarInput = ref<HTMLInputElement | null>(null)
</script>

<style scoped>
.admin-section {
  animation: fadeIn 0.3s ease;
}

.admin-profil__avatar-wrap {
  position: relative;
  cursor: pointer;
  display: inline-block;
  width: 80px;
  height: 80px;
}
.admin-profil__avatar {
  cursor: pointer;
}
.admin-profil__avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.admin-profil__avatar-wrap:hover .admin-profil__avatar-overlay {
  opacity: 1;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
