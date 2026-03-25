export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: (titleChunk?: string) =>
        titleChunk ? `${titleChunk} · TaskOrbit` : 'TaskOrbit',
      link: [
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon.png' },
      ],
    },
  },
  devServer: {
    port: 3002,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5001/api'
    }
  },
  css: ['~/assets/css/main.css'],
})
