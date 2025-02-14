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
    // '@nuxtjs/i18n',
  ],

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

  compatibilityDate: '2025-02-06',
})