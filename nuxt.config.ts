import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  runtimeConfig: {
    app: {
      apiKey: process.env.API_KEY,
      localUrl: process.env.LOCAL_URL
    }
  },
  // io: {
  //   sockets: [{
  //     name: 'main',
  //     url: 'http://localhost:3000'
  //   }]
  // },
  nitro: {
    experimental: {
      websocket: true
    },
    routeRules: {
      '/socket.io/**': {
        proxy: 'http://localhost:3000/socket.io/'
      },
    },
    devProxy: {
      "/socket.io/": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
  experimental: {
    viewTransition: true
  },
  devtools: { enabled: true },
  srcDir: 'src/',

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    'nuxt-socket-io',
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