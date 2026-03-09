<template>
  <div class="admin-section pt-5" >
    <h2 class="text-headline-small mb-5">Özet</h2>

    <!-- 1. Hızlı Erişim -->
    <v-card variant="outlined" class="admin-ozet__quick-bar mb-6" rounded="xl">
      <v-card-text class="pa-4">
        <v-row align="center">
          <v-col cols="12" class="mb-3">
            <span class="admin-ozet__quick-label d-inline-flex align-center ga-2">
              <v-icon icon="mdi-lightning-bolt" size="20" class="admin-ozet__lightning" />
              Hızlı Erişim
            </span>
          </v-col>
          <v-col cols="12">
            <div class="admin-ozet__quick-chips">
              <v-chip
                v-for="link in quickLinks"
                :key="link.id"
                variant="flat"
                size="small"
                :prepend-icon="link.icon"
                :class="['admin-ozet__quick-chip rounded', link.chipClass]"
                @click="$emit('navigate', link.id)"
                :text="link.title"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 2. Profil kartı -->
    <v-card variant="outlined" class="admin-ozet__profil-card mb-6" rounded="xl">
      <v-card-text class="pa-4 pa-md-6">
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="auto" class="d-flex align-center ga-3 mb-4 mb-md-0 admin-ozet__profil-click" @click="avatarInput?.click()">
            <v-avatar size="72" color="primary" variant="tonal">
              <v-img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" cover />
              <v-icon v-else icon="mdi-account" size="40" />
            </v-avatar>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="$emit('avatar-change', $event)"
            />
            <div>
              <p class="text-body-large font-weight-medium mb-1">{{ authStore.user?.email }}</p>
              <p class="text-body-small text-medium-emphasis mb-0">Son giriş: {{ lastLoginFormatted }}</p>
            </div>
          </v-col>
          <v-col cols="12" md="auto" class="d-flex ga-2">
            <v-btn
              variant="tonal"
              size="small"
              prepend-icon="mdi-camera"
              :loading="avatarLoading"
              rounded="lg"
              @click="avatarInput?.click()"
            >
              Fotoğraf
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              prepend-icon="mdi-lock-reset"
              rounded="lg"
              @click="$emit('navigate', 'profil')"
            >
              Profil
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 3. İstatistik kartları -->
    <v-row class="mb-8 admin-ozet__stat-row" align="stretch" justify="start">
      <v-col
        v-for="card in statCards"
        :key="card.id"
        cols="12"
        sm="6"
        md="4"
        lg="4"
      >
        <v-card
          variant="outlined"
          class="admin-ozet__stat-card"
          rounded="xl"
          height="100%"
          @click="$emit('navigate', card.id)"
        >
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="auto" class="mr-3">
                <v-avatar size="40" color="primary" variant="tonal" rounded="lg">
                  <v-icon :icon="card.icon" size="24" />
                </v-avatar>
              </v-col>
              <v-col class="flex-grow-1 min-width-0">
                <span class="admin-ozet__stat-value d-block">{{ card.value }}</span>
                <span class="admin-ozet__stat-label">{{ card.label }}</span>
              </v-col>
              <v-col cols="auto">
                <v-icon icon="mdi-arrow-right" size="18" class="text-medium-emphasis" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 4. Grafikler -->
    <v-row class="mb-8" justify="start">
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="admin-ozet__chart-card" rounded="xl">
          <v-card-title class="text-body-large font-weight-medium py-3 d-flex align-center ga-2">
            <v-icon icon="mdi-chart-bar" size="20" />
            İçerik Dağılımı
            <span class="text-medium-emphasis">({{ icerikDagilimToplam }})</span>
          </v-card-title>
          <v-card-text class="pt-0">
            <v-sparkline
              :model-value="sparklineData"
              type="bar"
              :height="100"
              :padding="8"
              :line-width="2"
              :label-size="7"
              show-labels
              :labels="sparklineLabels"
              color="primary"
              fill
              class="admin-ozet__sparkline-bar"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="admin-ozet__chart-card" rounded="xl">
          <v-card-title class="text-body-large font-weight-medium py-3 d-flex align-center ga-2">
            <v-icon icon="mdi-chart-timeline-variant" size="20" />
            Dergi Yükleme Sıklığı
            <span class="text-medium-emphasis">({{ dergiYuklemeToplam }})</span>
          </v-card-title>
          <v-card-text class="pt-0">
            <v-sparkline
              :model-value="journalTrendData"
              type="trend"
              :height="100"
              :padding="8"
              :smooth="8"
              :line-width="2"
              :label-size="7"
              :show-labels="journalTrendData.length > 0"
              :labels="journalTrendLabels"
              :color="sparklineTrendColor"
              fill
              :gradient="sparklineGradient"
              gradient-direction="top"
              auto-draw
              :auto-draw-duration="800"
              class="admin-ozet__sparkline-trend"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { AdminSectionId } from "~/utils/adminMenu";

const authStore = useAuthStore();
const theme = useTheme();
const sparklineTrendColor = computed(() =>
  theme.global.current.value.dark ? "#69F0AE" : "#3156FA"
);
const sparklineGradient = computed(() =>
  theme.global.current.value.dark ? ["#69F0AE", "#69F0AE40"] : ["#3156FA", "#3156FA40"]
);

const props = defineProps<{
  stats: {
    journalCount: number;
    blogCount: number;
    calismaCount: number;
    todoCount: number;
    subscriberCount: number;
    artworkCount: number;
    commentCount: number;
  };
  userProfile: { avatar_url?: string } | null;
  lastLoginFormatted: string;
  avatarLoading: boolean;
}>();

defineEmits<{
  "avatar-change": [e: Event];
  navigate: [section: AdminSectionId];
}>();

const avatarInput = ref<HTMLInputElement | null>(null);

const quickLinks = [
  { id: "dergi" as AdminSectionId, icon: "mdi-book-open-variant", title: "Dergiler", chipClass: "chip--blue" },
  { id: "eserler" as AdminSectionId, icon: "mdi-file-document-edit-outline", title: "Gelen Eserler", chipClass: "chip--purple" },
  { id: "yorumlar" as AdminSectionId, icon: "mdi-comment-multiple-outline", title: "Gelen Yorumlar", chipClass: "chip--indigo" },
  { id: "aboneler" as AdminSectionId, icon: "mdi-email-multiple", title: "Aboneler", chipClass: "chip--teal" },
  { id: "blog" as AdminSectionId, icon: "mdi-post", title: "Bloglar", chipClass: "chip--amber" },
  { id: "calisma" as AdminSectionId, icon: "mdi-briefcase", title: "Çalışmalar", chipClass: "chip--green" },
  { id: "todo" as AdminSectionId, icon: "mdi-format-list-checks", title: "Yapılacaklar", chipClass: "chip--rose" },
];

const statCards = computed(() => [
  { id: "dergi" as AdminSectionId, icon: "mdi-book-open-variant", value: props.stats.journalCount, label: "Dergiler" },
  { id: "eserler" as AdminSectionId, icon: "mdi-file-document-edit-outline", value: props.stats.artworkCount, label: "Gelen Eserler" },
  { id: "yorumlar" as AdminSectionId, icon: "mdi-comment-multiple-outline", value: props.stats.commentCount, label: "Gelen Yorumlar" },
  { id: "aboneler" as AdminSectionId, icon: "mdi-email-multiple", value: props.stats.subscriberCount, label: "Abone" },
  { id: "blog" as AdminSectionId, icon: "mdi-post", value: props.stats.blogCount, label: "Blog" },
  { id: "calisma" as AdminSectionId, icon: "mdi-briefcase", value: props.stats.calismaCount, label: "Çalışma" },
  { id: "todo" as AdminSectionId, icon: "mdi-format-list-checks", value: props.stats.todoCount, label: "Yapılacak" },
]);

const sparklineData = computed(() => [
  props.stats.journalCount,
  props.stats.blogCount,
  props.stats.calismaCount,
  props.stats.artworkCount,
  props.stats.todoCount,
  props.stats.subscriberCount,
  props.stats.commentCount,
]);
const sparklineLabels = ["Dergi", "Blog", "Çalışma", "Eser", "Todo", "Abone", "Yorum"];
const icerikDagilimToplam = computed(() =>
  sparklineData.value.reduce((a, b) => a + b, 0)
);

const { fetchJournals } = useJournals();
const journalTrendData = ref<number[]>([]);
const journalTrendLabels = ref<string[]>([]);
const dergiYuklemeToplam = computed(() =>
  journalTrendData.value.reduce((a, b) => a + b, 0)
);

const loadJournalTrend = async () => {
  try {
    const journals = await fetchJournals();
    const now = new Date();
    const months: number[] = [];
    const labels: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = journals.filter((j) => {
        const ct = j.created_at;
        if (!ct) return false;
        const sec = "seconds" in ct ? ct.seconds : (ct as { seconds: number }).seconds;
        const jDate = new Date(sec * 1000);
        return jDate.getMonth() === d.getMonth() && jDate.getFullYear() === d.getFullYear();
      }).length;
      months.push(count);
      labels.push(d.toLocaleDateString("tr-TR", { month: "short", year: "2-digit" }));
    }
    journalTrendData.value = months.length > 0 ? months : [0];
    journalTrendLabels.value = labels.length > 0 ? labels : [""];
  } catch {
    journalTrendData.value = [0];
    journalTrendLabels.value = [""];
  }
};

onMounted(loadJournalTrend);
</script>

<style scoped>
.admin-section {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  text-align: left;
  animation: fadeIn 0.3s ease;
  display: block;
  margin: 0;
  padding: 0;
}
.admin-section .v-row {
  justify-content: flex-start !important;
  margin-inline: 0 !important;
  max-width: none !important;
}

.admin-ozet__quick-bar {
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.15);
  background: rgb(var(--v-theme-primary) / 0.4) !important;
}
.v-theme--dark .admin-ozet__quick-bar {
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.4) !important;
  background: rgb(var(--v-theme-primary) / 0.55) !important;
}
.admin-ozet__quick-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(var(--v-theme-primary));
}
.admin-ozet__lightning {
  animation: lightningBlink 1.5s ease-in-out infinite;
}
@keyframes lightningBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.admin-ozet__quick-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
@media (max-width: 600px) {
  .admin-ozet__quick-chips {
    flex-direction: column;
  }
  .admin-ozet__quick-chip {
    width: 100%;
    justify-content: flex-start;
  }
}
.admin-ozet__quick-chip {
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  border: none !important;
}
.admin-ozet__quick-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
}
/* Chip gradient renkleri */
.admin-ozet__quick-chip.chip--blue {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%) !important;
  color: white !important;
}
.admin-ozet__quick-chip.chip--purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%) !important;
  color: white !important;
}
.admin-ozet__quick-chip.chip--teal {
  background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%) !important;
  color: white !important;
}
.admin-ozet__quick-chip.chip--amber {
  background: linear-gradient(135deg, #f59e0b 0%, #eab308 100%) !important;
  color: white !important;
}
.admin-ozet__quick-chip.chip--green {
  background: linear-gradient(135deg, #22c55e 0%, #10b981 100%) !important;
  color: white !important;
}
.admin-ozet__quick-chip.chip--rose {
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%) !important;
  color: white !important;
}
.admin-ozet__quick-chip.chip--indigo {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
  color: white !important;
}
.v-theme--dark .admin-ozet__quick-chip.chip--blue {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%) !important;
}
.v-theme--dark .admin-ozet__quick-chip.chip--purple {
  background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%) !important;
}
.v-theme--dark .admin-ozet__quick-chip.chip--teal {
  background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%) !important;
}
.v-theme--dark .admin-ozet__quick-chip.chip--amber {
  background: linear-gradient(135deg, #d97706 0%, #ca8a04 100%) !important;
}
.v-theme--dark .admin-ozet__quick-chip.chip--green {
  background: linear-gradient(135deg, #16a34a 0%, #059669 100%) !important;
}
.v-theme--dark .admin-ozet__quick-chip.chip--rose {
  background: linear-gradient(135deg, #e11d48 0%, #db2777 100%) !important;
}
.v-theme--dark .admin-ozet__quick-chip.chip--indigo {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important;
}

/* Chart label boyutları - küçük, taşmıyor */
.admin-ozet__sparkline-bar :deep(text),
.admin-ozet__sparkline-trend :deep(text) {
  font-size: 7px !important;
  font-weight: 500;
}
.admin-ozet__chart-card .v-card-text {
  overflow: hidden;
  max-width: 100%;
}

.admin-ozet__chart-card {
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  background: rgb(var(--v-theme-primary) / 0.4) !important;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.15);
}
.v-theme--dark .admin-ozet__chart-card {
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  background: rgb(var(--v-theme-primary) / 0.55) !important;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.4);
}
/* Dergi yükleme grafiği - siyah çizgi yerine primary renk (fallback) */
.admin-ozet__sparkline-trend :deep(svg path),
.admin-ozet__sparkline-trend :deep(svg polyline) {
  stroke: rgb(var(--v-theme-primary)) !important;
}

.admin-ozet__stat-row {
  --v-row-gutter: 12px;
}
.admin-ozet__stat-card {
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.12);
  min-height: 88px;
  background: rgb(var(--v-theme-primary) / 0.4) !important;
}
.admin-ozet__stat-card:hover {
  border-color: rgba(0, 0, 0, 0.45) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
}
.v-theme--dark .admin-ozet__stat-card {
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.4) !important;
  background: rgb(var(--v-theme-primary) / 0.55) !important;
}
.v-theme--dark .admin-ozet__stat-card:hover {
  border-color: rgba(255, 255, 255, 0.25) !important;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.5);
}
.admin-ozet__stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.admin-ozet__stat-label {
  font-size: 0.8125rem;
  font-weight: 500;
  opacity: 0.85;
}

.admin-ozet__profil-card {
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  background: rgb(var(--v-theme-primary) / 0.4) !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.15);
}
.admin-ozet__profil-click {
  cursor: pointer;
}
.v-theme--dark .admin-ozet__profil-card {
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  background: rgb(var(--v-theme-primary) / 0.55) !important;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.4);
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
