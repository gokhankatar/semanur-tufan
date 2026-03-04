<template>
  <div class="pa-4 pa-md-8 d-flex justify-center">
    <v-card class="login-card" max-width="400" variant="tonal">
      <v-card-title class="text-h5">Giriş Yap</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="E-posta"
            type="email"
            :rules="[rules.required, rules.email]"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="password"
            label="Şifre"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required]"
            variant="outlined"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          />
          <v-alert v-if="error" type="error" class="mt-2" density="compact" closable>
            {{ error }}
          </v-alert>
          <v-btn
            type="submit"
            color="primary"
            block
            class="mt-4"
            :loading="loading"
          >
            Giriş Yap
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const formRef = ref()

const rules = {
  required: (v: string) => !!v || 'Bu alan zorunludur',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Geçerli bir e-posta girin',
}

const handleLogin = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  error.value = ''
  try {
    const { $authActions } = useNuxtApp()
    await $authActions.signIn(email.value, password.value)
    await navigateTo('/')
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err?.message || 'Giriş başarısız. E-posta ve şifrenizi kontrol edin.'
  } finally {
    loading.value = false
  }
}
</script>
