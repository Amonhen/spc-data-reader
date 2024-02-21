// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  css: [
      '~/assets/scss/main.scss'
  ],
  modules: [
      'nuxt-electron'
  ],
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          args.reload()
        },
      },
    ],
    renderer: {},
  },
  runtimeConfig: {

  },
  router: {
    options: {
      hashMode: true,
    },
  },
})
