<template>
  <div class="abone-ol-page pa-4 pa-md-8">
    <div class="abone-ol-header mb-8">
      <v-icon
        icon="mdi-email-newsletter"
        :size="display.xl.value ? 48 : 40"
        class="abone-ol-header__icon mb-3"
      />
      <h1 class="text-headline-large mb-3">Abone Ol</h1>
      <p class="text-body-large text-medium-emphasis">
        Yeni dergi, blog ve çalışmalardan haberdar olmak için abone olun.
      </p>
    </div>

    <v-card variant="outlined" class="abone-ol-card" max-width="500" rounded="xl">
      <v-card-text class="pa-5 pa-md-8">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Adınız"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            :rules="[rules.required]"
            rounded="lg"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            hide-details="auto"
            class="mb-3"
          />
          <v-text-field
            v-model="form.surname"
            label="Soyadınız"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            :rules="[rules.required]"
            rounded="lg"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            hide-details="auto"
            class="mb-3"
          />
          <v-text-field
            v-model="form.email"
            label="E-posta"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
            rounded="lg"
            :density="display.xl.value ? 'comfortable' : 'compact'"
            hide-details="auto"
            class="mb-4"
          />
          <v-btn
            type="submit"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-email-check"
            :loading="loading"
            rounded="lg"
            block
            size="large"
            text="Abone Ol"
          />
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.type"
      :timeout="snackbar.timeout"
      location="bottom"
      rounded="lg"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
const display = useDisplay();
const formRef = ref();
const form = reactive({
  name: "",
  surname: "",
  email: "",
});

const loading = ref(false);
const snackbar = reactive({
  show: false,
  type: "success" as "success" | "error",
  message: "",
  timeout: 3500,
});

const rules = {
  required: (v: string) => !!v || "Bu alan zorunludur",
  email: (v: string) => /.+@.+\..+/.test(v) || "Geçerli bir e-posta girin",
};

useHead({ title: "Abone Ol" });

const { addSubscriber } = useSubscribers();

const handleSubmit = async () => {
  const result = await formRef.value?.validate();
  if (!result || !result.valid) return;

  loading.value = true;
  try {
    await addSubscriber({
      name: form.name,
      surname: form.surname,
      email: form.email,
    });

    snackbar.type = "success";
    snackbar.message = "Aboneliğiniz başarıyla oluşturuldu. Yeni içeriklerden haberdar olacaksınız!";
    snackbar.show = true;

    formRef.value?.reset();
  } catch (e: unknown) {
    const err = e as { message?: string };
    snackbar.type = "error";
    snackbar.message = err?.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
    snackbar.show = true;
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.abone-ol-header {
  text-align: center;
}
.abone-ol-header__icon {
  color: rgb(var(--v-theme-primary));
}
.abone-ol-card {
  border: 1px solid rgb(var(--v-theme-primary) / 0.25);
  margin: 0 auto;
}
</style>
