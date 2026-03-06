<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Profil</h2>

    <v-card variant="outlined" class="pa-4 pa-md-6">
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
        class="mt-2 mb-4"
        @click="$emit('email-save')"
      >
        E-postayı Kaydet
      </v-btn>

      <v-divider class="my-4" />

      <p class="text-body-small font-weight-medium mb-2">Şifre yenileme linki</p>
      <p class="text-caption text-medium-emphasis mb-2">
        E-postanıza şifre sıfırlama linki gönderilir. Linke tıklayarak yeni şifre belirleyebilirsiniz.
      </p>
      <v-text-field
        :model-value="resetLinkPassword"
        label="Mevcut şifre"
        :type="showResetLinkPassword ? 'text' : 'password'"
        variant="outlined"
        hide-details="auto"
        class="mb-2"
        :append-inner-icon="showResetLinkPassword ? 'mdi-eye-off' : 'mdi-eye'"
        placeholder="Doğrulama için mevcut şifrenizi girin"
        @click:append-inner="showResetLinkPassword = !showResetLinkPassword"
        @update:model-value="$emit('update:resetLinkPassword', $event)"
      />
      <v-alert v-if="resetLinkError" type="error" density="compact" class="mb-2">
        {{ resetLinkError }}
      </v-alert>
      <v-alert v-if="resetLinkSuccess" type="success" density="compact" class="mb-2">
        Yenileme linki e-postanıza gönderildi. Gelen kutunuzu kontrol edin. Spam veya gereksiz klasörüne de düşmüş olabilir.
      </v-alert>
      <v-btn
        variant="tonal"
        color="primary"
        :loading="resetLinkLoading"
        prepend-icon="mdi-email-send"
        @click="$emit('reset-link-request')"
      >
        Yenileme linki gönder
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const showEmailPassword = ref(false)
const showResetLinkPassword = ref(false)

defineProps<{
  userProfile: { avatar_url?: string } | null
  avatarLoading: boolean
  newEmail: string
  emailPassword: string
  emailLoading: boolean
  emailError: string
  resetLinkPassword: string
  resetLinkLoading: boolean
  resetLinkError: string
  resetLinkSuccess: boolean
}>()

defineEmits<{
  'update:newEmail': [v: string]
  'update:emailPassword': [v: string]
  'update:resetLinkPassword': [v: string]
  'avatar-change': [e: Event]
  'email-save': []
  'reset-link-request': []
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
