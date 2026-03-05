<template>
  <div>
    <LayoutThemePersistence />
    <template v-if="!authStore.loading">
      <!-- Giriş yapılmamışsa sadece login formu -->
      <div v-if="!authStore.isLoggedIn" class="admin-login-wrapper">
        <v-card class="admin-login-card w-100" max-width="400" variant="tonal">
          <v-card-title class="text-headline-small pa-4">Admin Girişi</v-card-title>
          <v-card-text class="pa-6 pt-0">
            <p class="text-body-small text-medium-emphasis mb-4">
              Admin paneline erişmek için giriş yapın.
            </p>
            <v-form ref="formRef" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="E-posta"
                type="email"
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                hide-details="auto"
                :density="display.xl.value ? 'comfortable' : 'compact'"
                class="mb-2"
              />
              <v-text-field
                v-model="password"
                label="Şifre"
                :type="showPassword ? 'text' : 'password'"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                hide-details="auto"
                :density="display.xl.value ? 'comfortable' : 'compact'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              />
              <v-alert v-if="error" type="error" class="mt-3" density="compact" closable>
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                block
                :size="display.xl.value ? 'default' : 'small'"
                prepend-icon="mdi-login"
                :ripple="false"
                class="mt-4 rounded-lg"
                :loading="loading"
                text="Giriş Yap"
              />
            </v-form>
          </v-card-text>
        </v-card>
        <NuxtLink to="/" class="admin-back-link">
          <v-icon icon="mdi-arrow-left" size="small" />
          Ana sayfaya dön
        </NuxtLink>
      </div>

      <!-- Giriş yapılmış ve admin ise panel -->
      <template v-else-if="authStore.isAdmin">
        <v-navigation-drawer
          v-model="drawer"
          :permanent="!display.mdAndDown.value"
          :temporary="display.mdAndDown.value"
          class="admin-drawer"
          width="280"
        >
          <div class="admin-drawer__header pa-4">
            <NuxtLink to="/" class="admin-drawer__logo">
              <span>Semanur Tufan</span>
              <span class="text-body-small">Admin</span>
            </NuxtLink>
          </div>

          <v-list density="comfortable" nav class="admin-drawer__list">
            <v-list-item
              :active="activeSection === 'ozet'"
              prepend-icon="mdi-view-dashboard"
              title="Özet"
              value="ozet"
              @click="activeSection = 'ozet'"
            />
            <v-list-item
              :active="activeSection === 'dergi'"
              prepend-icon="mdi-book-open-variant"
              title="Dergi Ekle"
              value="dergi"
              @click="activeSection = 'dergi'"
            />
            <v-list-item
              :active="activeSection === 'blog'"
              prepend-icon="mdi-post"
              title="Blog Yazısı Ekle"
              value="blog"
              @click="activeSection = 'blog'"
            />
            <v-list-item
              :active="activeSection === 'calisma'"
              prepend-icon="mdi-briefcase"
              title="Çalışma Ekle"
              value="calisma"
              @click="activeSection = 'calisma'"
            />
            <v-divider class="my-2" />
            <v-list-item
              :active="activeSection === 'profil'"
              prepend-icon="mdi-account"
              title="Profil"
              value="profil"
              @click="activeSection = 'profil'"
            />
            <v-list-item
              :active="activeSection === 'ayarlar'"
              prepend-icon="mdi-cog"
              title="Ayarlar"
              value="ayarlar"
              @click="activeSection = 'ayarlar'"
            />
            <v-list-item
              prepend-icon="mdi-palette"
              title="Tema Değiştir"
              @click="theme.toggle()"
            >
              <template #append>
                <v-icon :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="small" />
              </template>
            </v-list-item>
          </v-list>
          <template #append>
            <div class="pa-4">
              <NuxtLink to="/" class="admin-drawer__home">
                <v-btn variant="tonal" block prepend-icon="mdi-home"> Ana Sayfa </v-btn>
              </NuxtLink>
            </div>
          </template>
        </v-navigation-drawer>

        <v-main class="admin-main">
          <v-app-bar density="compact" class="admin-appbar">
            <v-app-bar-nav-icon v-if="display.mdAndDown.value" @click="drawer = !drawer" />
            <v-toolbar-title class="d-none d-sm-flex">Admin Panel</v-toolbar-title>
            <v-spacer />
            <v-menu
              location="bottom end"
              transition="slide-y-transition"
              content-class="admin-avatar-menu"
            >
              <template #activator="{ props }">
                <v-btn v-bind="props" icon variant="text" class="admin-avatar-btn mr-2">
                  <v-avatar size="40" color="primary" variant="tonal" class="admin-avatar">
                    <v-img
                      v-if="userProfile?.avatar_url"
                      :src="userProfile.avatar_url"
                      cover
                    />
                    <v-icon v-else icon="mdi-account" size="22" />
                  </v-avatar>
                </v-btn>
              </template>
              <v-card class="admin-avatar-menu__card" variant="tonal" rounded="lg">
                <div class="admin-avatar-menu__header pa-4">
                  <v-avatar size="48" color="primary" variant="tonal">
                    <v-img
                      v-if="userProfile?.avatar_url"
                      :src="userProfile.avatar_url"
                      cover
                    />
                    <v-icon v-else icon="mdi-account" size="28" />
                  </v-avatar>
                  <div class="admin-avatar-menu__user ml-3">
                    <p class="text-body-medium font-weight-medium mb-0">
                      {{ authStore.user?.email }}
                    </p>
                    <p class="text-caption text-medium-emphasis mb-0">
                      Admin
                    </p>
                  </div>
                </div>
                <v-divider />
                <v-list density="comfortable" class="admin-avatar-menu__list">
                  <v-list-item
                    prepend-icon="mdi-account"
                    title="Profil"
                    :active="activeSection === 'profil'"
                    rounded="lg"
                    @click="activeSection = 'profil'"
                  />
                  <v-list-item
                    prepend-icon="mdi-cog"
                    title="Ayarlar"
                    :active="activeSection === 'ayarlar'"
                    rounded="lg"
                    @click="activeSection = 'ayarlar'"
                  />
                  <v-list-item
                    prepend-icon="mdi-palette"
                    title="Tema Değiştir"
                    rounded="lg"
                    @click="theme.toggle()"
                  >
                    <template #append>
                      <v-icon :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="small" />
                    </template>
                  </v-list-item>
                </v-list>
                <v-divider />
                <div class="pa-3">
                  <v-btn
                    variant="tonal"
                    color="error"
                    block
                    prepend-icon="mdi-logout"
                    rounded="lg"
                    @click="handleLogout"
                  >
                    Çıkış Yap
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </v-app-bar>

          <div class="admin-content pa-4 pa-md-6">
            <AdminOzet
              v-if="activeSection === 'ozet'"
              :stats="stats"
              :user-profile="userProfile"
              :last-login-formatted="lastLoginFormatted"
              :avatar-loading="avatarLoading"
              @avatar-change="handleAvatarChange"
              @password-click="activeSection = 'profil'"
            />
            <AdminDergiEkle v-else-if="activeSection === 'dergi'" />
            <AdminBlogEkle v-else-if="activeSection === 'blog'" />
            <AdminCalismaEkle v-else-if="activeSection === 'calisma'" />
            <AdminProfil
              v-else-if="activeSection === 'profil'"
              :user-profile="userProfile"
              :avatar-loading="avatarLoading"
              v-model:new-email="newEmail"
              v-model:email-password="emailPassword"
              :email-loading="emailLoading"
              :email-error="emailError"
              v-model:new-password="newPassword"
              v-model:show-password="showNewPassword"
              :password-loading="passwordLoading"
              :password-error="passwordError"
              @avatar-change="handleAvatarChange"
              @email-save="handleEmailChange"
              @password-save="handlePasswordChange"
            />
            <AdminAyarlar
              v-else-if="activeSection === 'ayarlar'"
              v-model:primary-color="primaryColor"
              v-model:primary-theme="primaryTheme"
            />
          </div>
        </v-main>
      </template>

      <!-- Giriş yapılmış ama admin değilse -->
      <v-container v-else class="fill-height">
        <v-alert type="warning" variant="tonal" class="text-center">
          Bu sayfaya erişim yetkiniz yok.
          <template #append>
            <v-btn variant="text" to="/">Ana Sayfaya Dön</v-btn>
          </template>
        </v-alert>
      </v-container>
    </template>

    <div v-else class="d-flex justify-center align-center fill-height">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Semanur Tufan | Admin",
});

const authStore = useAuthStore();
const display = useDisplay();
const drawer = ref(true);
const activeSection = ref<"ozet" | "dergi" | "blog" | "calisma" | "profil" | "ayarlar">("ozet");

const { fetchAllStats } = useAdminStats();
const { fetchProfile, updateAvatar, profile: userProfile } = useUserProfile();
const { uploadAvatar } = useProfileUpload();
const { getStoredPrimary, setPrimaryForTheme } = useThemeColor();
const theme = useTheme();

const stats = ref({ journalCount: 0, blogCount: 0, calismaCount: 0 });
const avatarLoading = ref(false);
const newPassword = ref("");
const showNewPassword = ref(false);
const passwordLoading = ref(false);
const passwordError = ref("");

const newEmail = ref("");
const emailPassword = ref("");
const emailLoading = ref(false);
const emailError = ref("");
const primaryColor = ref("#3156FA");
const primaryTheme = ref<"dark" | "light">("light");

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");
const formRef = ref();

const rules = {
  required: (v: string) => !!v || "Bu alan zorunludur",
  email: (v: string) => /.+@.+\..+/.test(v) || "Geçerli bir e-posta girin",
};

const lastLoginFormatted = computed(() => {
  const t = authStore.user?.lastSignInTime;
  if (!t) return "—";
  try {
    const d = new Date(t);
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
});

watch(activeSection, (section) => {
  if (section === 'ayarlar') {
    const stored = getStoredPrimary();
    const name = theme.global.name.value;
    primaryTheme.value = name as 'dark' | 'light';
    primaryColor.value = name === 'dark' ? stored.dark : stored.light;
  }
  if (section === 'profil') {
    newEmail.value = authStore.user?.email ?? '';
    emailPassword.value = '';
    emailError.value = '';
  }
});

watch(
  () => authStore.isAdmin,
  async (isAdmin) => {
    if (isAdmin && authStore.user?.uid) {
      await Promise.all([
        fetchAllStats().then((s) => (stats.value = s)),
        fetchProfile(authStore.user.uid),
      ]);
    }
  },
  { immediate: true }
);

const handleAvatarChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !authStore.user?.uid) return;
  avatarLoading.value = true;
  try {
    const url = await uploadAvatar(file);
    await updateAvatar(authStore.user.uid, url);
  } catch (err) {
    console.error(err);
  } finally {
    avatarLoading.value = false;
    input.value = "";
  }
};

const handlePasswordChange = async () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    passwordError.value = "Şifre en az 6 karakter olmalı";
    return;
  }
  passwordLoading.value = true;
  passwordError.value = "";
  try {
    const { $authActions } = useNuxtApp();
    await $authActions.updatePassword(newPassword.value);
    newPassword.value = "";
  } catch (e: unknown) {
    const err = e as { message?: string };
    passwordError.value = err?.message || "Şifre değiştirilemedi.";
  } finally {
    passwordLoading.value = false;
  }
};

const handleEmailChange = async () => {
  if (!newEmail.value || !emailPassword.value) {
    emailError.value = "E-posta ve şifre gerekli";
    return;
  }
  emailLoading.value = true;
  emailError.value = "";
  try {
    const { $authActions } = useNuxtApp();
    await $authActions.updateEmail(newEmail.value, emailPassword.value);
    newEmail.value = "";
    emailPassword.value = "";
  } catch (e: unknown) {
    const err = e as { message?: string };
    emailError.value = err?.message || "E-posta değiştirilemedi.";
  } finally {
    emailLoading.value = false;
  }
};

watch(primaryColor, () => {
  setPrimaryForTheme(primaryTheme.value, primaryColor.value);
});

watch(primaryTheme, (themeName) => {
  theme.change(themeName);
  const stored = getStoredPrimary();
  primaryColor.value = themeName === 'dark' ? stored.dark : stored.light;
});

const handleLogin = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  error.value = "";
  try {
    const { $authActions } = useNuxtApp();
    await $authActions.signIn(email.value, password.value);
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Giriş başarısız.";
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  const { $authActions } = useNuxtApp();
  await $authActions.signOut();
  await navigateTo("/");
};
</script>

<style scoped>
.admin-login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgb(var(--v-theme-background));
}

.admin-login-card {
  border-radius: 16px;
}

.admin-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-size: 0.875rem;
}

.admin-back-link:hover {
  opacity: 0.9;
}

.admin-drawer__header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.v-theme--light .admin-drawer__header {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.admin-drawer__logo {
  display: flex;
  flex-direction: column;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 700;
  font-size: 1.125rem;
}

.admin-drawer__logo span:last-child {
  font-size: 0.75rem;
  opacity: 0.8;
  font-weight: 500;
}

.admin-drawer__list {
  padding: 0.5rem;
}

.admin-drawer__home {
  text-decoration: none;
  display: block;
  margin-top: 0.5rem;
}

.admin-main {
  background: rgb(var(--v-theme-background));
}

.admin-content {
  max-width: 800px;
}

/* Admin kartları - tema uyumlu border */
.admin-content :deep(.v-card) {
  border: 1px solid rgb(var(--v-theme-primary) / 0.25);
  border-radius: 12px;
}

/* Avatar menü - geniş, animasyonlu */
.admin-avatar-btn {
  transition: transform 0.2s ease;
}
.admin-avatar-btn:hover .admin-avatar {
  transform: scale(1.05);
}
.admin-avatar {
  transition: transform 0.2s ease;
}

:deep(.admin-avatar-menu) {
  margin-top: 8px;
  overflow: visible;
}
:deep(.admin-avatar-menu > *) {
  transform-origin: top right;
  animation: adminMenuIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes adminMenuIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.admin-avatar-menu__card {
  overflow: hidden;
  min-width: 280px;
}
.admin-avatar-menu__header {
  display: flex;
  align-items: center;
}
.admin-avatar-menu__user {
  flex: 1;
  min-width: 0;
}
.admin-avatar-menu__user p:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.admin-avatar-menu__list {
  padding: 0.5rem;
}
.admin-avatar-menu__list .v-list-item {
  margin-bottom: 2px;
}
</style>
