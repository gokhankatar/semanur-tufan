<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    persistent
    transition="dialog-transition"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <div class="d-flex justify-space-between align-start">
        <div class="auth-dialog__header-text d-flex flex-column align-start pa-5">
          <p class="auth-dialog__title mb-1">Hoş geldiniz</p>
          <p class="auth-dialog__subtitle text-body-small ma-0">Hesabınıza giriş yapın veya yeni hesap oluşturun</p>
        </div>

        <v-btn
          variant="text"
          size="small"
          class="auth-dialog__close"
          aria-label="Kapat"
          @click="close"
          icon="mdi-close"
        />
      </div>

      <v-tabs v-model="tab" grow>
        <v-tab value="login">Giriş yap</v-tab>
        <v-tab value="register">Kayıt ol</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="login">
          <v-card-text>
            <v-form ref="loginFormRef" @submit.prevent="handleLogin">
              <v-text-field
                v-model="loginEmail"
                label="E-posta"
                type="email"
                variant="outlined"
                hide-details="auto"
                prepend-inner-icon="mdi-email"
                :density="display.xl.value ? 'comfortable' : 'compact'"
                :rules="[rules.required, rules.email]"
                class="mb-2"
              />
              <v-text-field
                v-model="loginPassword"
                label="Şifre"
                :type="showLoginPassword ? 'text' : 'password'"
                variant="outlined"
                hide-details="auto"
                prepend-inner-icon="mdi-lock"
                :density="display.xl.value ? 'comfortable' : 'compact'"
                :rules="[rules.required]"
                :append-inner-icon="showLoginPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showLoginPassword = !showLoginPassword"
              />
              <v-alert v-if="error" type="error" density="compact" closable class="mt-2">
                {{ error }}
              </v-alert>
              <v-btn
                type="submit"
                prepend-icon="mdi-login"
                color="primary"
                block
                :elevation="0"
                class="mt-4"
                :loading="loading"
                text="Giriş yap"
              />
            </v-form>
          </v-card-text>
        </v-window-item>

        <v-window-item value="register">
          <v-card-text>
            <v-form ref="registerFormRef" @submit.prevent="handleRegister">
              <v-text-field
                v-model="regName"
                label="Ad"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                hide-details="auto"
                :density="display.xl.value ? 'comfortable' : 'compact'"
                :rules="[rules.required]"
                class="mb-2"
              />
              <v-text-field
                v-model="regSurname"
                label="Soyad"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                hide-details="auto"
                :density="display.xl.value ? 'comfortable' : 'compact'"
                :rules="[rules.required]"
                class="mb-2"
              />
              <v-text-field
                v-model="regEmail"
                label="E-posta"
                type="email"
                prepend-inner-icon="mdi-email"
                hide-details="auto"
                :density="display.xl.value ? 'comfortable' : 'compact'"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                class="mb-2"
              />
              <v-text-field
                v-model="regPassword"
                label="Şifre"
                prepend-inner-icon="mdi-lock"
                hide-details="auto"
                :density="display.xl.value ? 'comfortable' : 'compact'"
                :type="showRegPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required, rules.password]"
                :append-inner-icon="showRegPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showRegPassword = !showRegPassword"
              />
              <v-alert
                v-if="regError"
                type="error"
                density="compact"
                closable
                class="mt-2"
              >
                {{ regError }}
              </v-alert>
              <v-btn
                type="submit"
                prepend-icon="mdi-account-plus"
                color="primary"
                block
                class="mt-4"
                :loading="regLoading"
                text="Kayıt ol"
              />
            </v-form>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const display = useDisplay();
const tab = ref("login");
const loginEmail = ref("");
const loginPassword = ref("");
const regName = ref("");
const regSurname = ref("");
const regEmail = ref("");
const regPassword = ref("");
const showLoginPassword = ref(false);
const showRegPassword = ref(false);
const loading = ref(false);
const regLoading = ref(false);
const error = ref("");
const regError = ref("");
const loginFormRef = ref();
const registerFormRef = ref();

const rules = {
  required: (v: string) => !!v || "Bu alan zorunludur",
  email: (v: string) => /.+@.+\..+/.test(v) || "Geçerli bir e-posta girin",
  password: (v: string) => v?.length >= 6 || "En az 6 karakter olmalı",
};

const close = () => {
  emit("update:modelValue", false);
  error.value = "";
  regError.value = "";
};

const handleLogin = async () => {
  const { valid } = await loginFormRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  error.value = "";
  try {
    const { $authActions } = useNuxtApp();
    await $authActions.signIn(loginEmail.value, loginPassword.value);
    close();
    await navigateTo("/");
  } catch (e: unknown) {
    const err = e as { message?: string };
    error.value = err?.message || "Giriş başarısız. E-posta ve şifrenizi kontrol edin.";
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  const { valid } = await registerFormRef.value?.validate();
  if (!valid) return;

  regLoading.value = true;
  regError.value = "";
  try {
    const { $auth } = useNuxtApp();
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const userCred = await createUserWithEmailAndPassword(
      $auth,
      regEmail.value,
      regPassword.value
    );
    // İsim soyisim Firestore users koleksiyonuna kaydedilir
    if (userCred.user && (regName.value || regSurname.value)) {
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { $firestore } = useNuxtApp();
        await setDoc(doc($firestore, "users", userCred.user.uid), {
          name: regName.value,
          surname: regSurname.value,
          email: regEmail.value,
        });
      } catch {
        // Firestore yazma başarısız olsa da kayıt tamamlandı
      }
    }
    close();
    await navigateTo("/");
  } catch (e: unknown) {
    const err = e as { message?: string };
    regError.value = err?.message || "Kayıt başarısız. Lütfen tekrar deneyin.";
  } finally {
    regLoading.value = false;
  }
};
</script>

<style scoped>
.auth-dialog__header-text .auth-dialog__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.auth-dialog__header-text .auth-dialog__subtitle {
  font-size: 0.875rem;
  line-height: 1.4;
}
</style>
