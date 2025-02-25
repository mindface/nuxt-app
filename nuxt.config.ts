import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  runtimeConfig: {
    app: {
      apiKey: process.env.API_KEY,
      localUrl: process.env.LOCAL_URL
    }
  },
  experimental: {
    viewTransition: true
  },
  // devtools: { enabled: true },
  srcDir: 'src/',

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    // '@nuxtjs/i18n',
  ],

  build: {
    transpile: ['jspdf', 'html2canvas']
  },

  css: ['/assets/style/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite:{
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('custom-')
    }
  },

  imports: {
    autoImport: true,
    dirs: [
      "src/**",
      "clients",
    ],
  },

  compatibilityDate: '2025-02-06',
})