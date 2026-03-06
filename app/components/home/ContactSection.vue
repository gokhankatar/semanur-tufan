<template>
  <section id="iletisim" class="contact-section pa-4 pa-md-6 rounded-xl">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <div class="contact-section__header">
          <v-icon
            icon="mdi-email-edit-outline"
            :size="display.xl.value ? 40 : 32"
            class="contact-section__icon"
          />
          <h2 class="contact-section__title">İletişim</h2>
          <p class="contact-section__subtitle">
            Sorularınız, önerileriniz veya iş birlikleri için bize ulaşın.
          </p>
        </div>

        <v-card variant="outlined" class="contact-section__card" rounded="xl">
          <v-card-text class="pa-5 pa-md-8">
            <v-form ref="formRef" @submit.prevent="handleSubmit">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.name"
                    label="Adınız"
                    variant="outlined"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="[rules.required]"
                    rounded="lg"
                    :density="display.xl.value ? 'comfortable' : 'compact'"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.email"
                    label="E-posta"
                    type="email"
                    variant="outlined"
                    prepend-inner-icon="mdi-email-outline"
                    :rules="[rules.required, rules.email]"
                    :density="display.xl.value ? 'comfortable' : 'compact'"
                    rounded="lg"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.msg"
                    label="Mesajınız"
                    variant="outlined"
                    prepend-inner-icon="mdi-message-text-outline"
                    :rules="[rules.required]"
                    rows="5"
                    rounded="lg"
                    :density="display.xl.value ? 'comfortable' : 'compact'"
                    hide-details="auto"
                    no-resize
                  />
                </v-col>
                <v-col cols="12">
                  <v-btn
                    type="submit"
                    color="primary"
                    variant="elevated"
                    prepend-icon="mdi-send"
                    :loading="loading"
                    rounded="lg"
                    block
                    size="large"
                    text="Gönder"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.type"
      :timeout="snackbar.timeout"
      location="bottom"
      rounded="lg"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </section>
</template>

<script setup lang="ts">
const display = useDisplay();
const formRef = ref();
const form = reactive({
  name: "",
  email: "",
  msg: "",
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

const showFeedback = (
  type: "success" | "error",
  message: string,
  timeout = 3500
) => {
  snackbar.type = type;
  snackbar.message = message;
  snackbar.timeout = timeout;
  snackbar.show = true;
};

const handleSubmit = async () => {
  const result = await formRef.value?.validate();
  if (!result || !result.valid) return;

  loading.value = true;

  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: { name: form.name, email: form.email, msg: form.msg },
    });

    showFeedback(
      "success",
      "Mesajın başarıyla iletildi. En kısa sürede dönüş yapacağız 🙌",
      3500
    );

    formRef.value?.reset();
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }; message?: string };
    showFeedback(
      "error",
      err?.data?.statusMessage ||
        err?.message ||
        "Bir hata oluştu. Lütfen biraz sonra tekrar dene.",
      3500
    );
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.contact-section {
  background-image: radial-gradient(circle at 20% 14%, rgba(27, 27, 27, 0.05) 0%, rgba(27, 27, 27, 0.05) 50%, rgba(126, 126, 126, 0.05) 50%, rgba(126, 126, 126, 0.05) 100%),
    radial-gradient(circle at 18% 51%, rgba(248, 248, 248, 0.05) 0%, rgba(248, 248, 248, 0.05) 50%, rgba(26, 26, 26, 0.05) 50%, rgba(26, 26, 26, 0.05) 100%),
    radial-gradient(circle at 29% 38%, rgba(160, 160, 160, 0.05) 0%, rgba(160, 160, 160, 0.05) 50%, rgba(212, 212, 212, 0.05) 50%, rgba(212, 212, 212, 0.05) 100%),
    linear-gradient(90deg, rgb(13, 20, 33), rgb(13, 20, 33));
}

.v-theme--light .contact-section {
  background-image: radial-gradient(circle at 20% 14%, rgba(27, 27, 27, 0.05) 0%, rgba(27, 27, 27, 0.05) 50%, rgba(126, 126, 126, 0.05) 50%, rgba(126, 126, 126, 0.05) 100%),
    radial-gradient(circle at 18% 51%, rgba(248, 248, 248, 0.05) 0%, rgba(248, 248, 248, 0.05) 50%, rgba(26, 26, 26, 0.05) 50%, rgba(26, 26, 26, 0.05) 100%),
    radial-gradient(circle at 29% 38%, rgba(160, 160, 160, 0.05) 0%, rgba(160, 160, 160, 0.05) 50%, rgba(212, 212, 212, 0.05) 50%, rgba(212, 212, 212, 0.05) 100%),
    linear-gradient(90deg, rgba(13, 20, 33, 0.26), rgba(13, 20, 33, 0.26));
}

.contact-section__header {
  text-align: center;
  padding: 1.5rem 1rem;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary) / 0.08) 0%,
    rgb(var(--v-theme-primary) / 0.03) 50%,
    transparent 100%
  );
  border: 1px solid rgb(var(--v-theme-primary) / 0.2);
  border-radius: 20px;
}

.v-theme--light .contact-section__header {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary) / 0.12) 0%,
    rgb(var(--v-theme-primary) / 0.05) 50%,
    transparent 100%
  );
  border-color: rgb(var(--v-theme-primary) / 0.25);
}

.contact-section__icon {
  color: rgb(var(--v-theme-primary));
  margin-bottom: 0.5rem;
}

.contact-section__title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem 0;
  color: inherit;
}

.contact-section__subtitle {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

.v-theme--light .contact-section__subtitle {
  color: rgba(0, 0, 0, 0.65);
}

.contact-section__card {
  border: 1px solid rgb(var(--v-theme-primary) / 0.25);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.06);
}

.v-theme--light .contact-section__card {
  border-color: rgb(var(--v-theme-primary) / 0.2);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.04);
}
</style>
