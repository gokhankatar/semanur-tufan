export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/images/logo_small.png" },
      ],
      style: [
        {
          textContent: '@layer vuetify-core, vuetify-components, vuetify-overrides, vuetify-utilities, vuetify-final;',
          tagPriority: 1,
        },
      ],
      script: [
        {
          innerHTML: `(function(){if(typeof document==='undefined')return;var t=localStorage.getItem('semanur-tufan-theme')||'dark';var isLight=t==='light';var el=document.documentElement;el.style.backgroundColor=isLight?'#FFFFFF':'#0D1421';el.setAttribute('data-initial-theme',t);})();`,
          tagPriority: 100,
        },
      ],
    },
  },
  runtimeConfig: {
    mail: process.env.MAIL_USER || '',
    mailPassword: process.env.MAIL_PASSWORD || '',
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      adminEmail: process.env.ADMIN_EMAIL || 'gokgerdandergisi@gmail.com',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://semanur-tufan.vercel.app',
    },
  },
  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-lodash'
  ],
  devServer: {
    host: "0.0.0.0",
    port: 5000,
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "dark",
        themes: {
          dark: {
            dark: true,
            colors: {
              background: "#0D1421",
              surface: "#0D1421",
              primary: "#69F0AE",
              secondary: "#D1D1D1",
              error: "#CF6679",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
            },
          },
          light: {
            dark: false,
            colors: {
              background: "#FFFFFF",
              surface: "#FFFFFF",
              primary: "#3156FA",
              secondary: "#424242",
              error: "#B00020",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
            },
          },
        },
      },
    },
  },
})