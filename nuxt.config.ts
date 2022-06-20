import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // buildModules: ['nuxt-windicss'],

  css: ['@/assets/scss/main.scss'],

  runtimeConfig: {
    public: {
      apiUrl: '',
      backendUrl: '',
    },
  },
})
