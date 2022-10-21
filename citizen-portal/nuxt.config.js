export default {
  ssr: false,
  dev: process.env.NODE_ENV !== 'production',
  server: {
    host: '0.0.0.0' // default: localhost
  },
  env: {
    baseURL: process.env.VUE_APP_BASE_URL
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.VUE_APP_TITLE,
    title: process.env.VUE_APP_TITLE || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.VUE_APP_DESCRIPTION || ''
      },
      { name: 'msapplication-TileColor', content: '#594d95' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${process.env.VUE_APP_PUBLIC_PATH}/favicon.ico` },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto+Slab:100,200,300,400,500,600,700,800,900&display=swap' }
    ],
  },
  /*
  generate: {
    dir: 'orfeo-dashboard',
  },
   */
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#594d95', height: '5px' },
  loadingIndicator: {
    name: 'pulse',
    color: '#594d95',
    background: 'white'
  },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/main.sass',
    'vue-json-pretty/lib/styles.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false },
    { src: '~/plugins/chartist', ssr: false },
    { src: '~/plugins/copy', ssr: false },
    { src: '~/plugins/apexcharts', ssr: false },
    { src: '~/plugins/google-maps', ssr: false },
    { src: '~/plugins/tiptap', ssr: false },
    { src: '~/plugins/consent', ssr: false },
    { src: '~/plugins/youtube', ssr: false },
    { src: '~/plugins/json-pretty' },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/i18n' },
    { src: '~/plugins/string' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/snackbar' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
    'lodash',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'nuxt-axios-duplicate-blocker',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/auth-next',
    'cookie-universal-nuxt',
    '@nuxtjs/recaptcha',
    '@nuxtjs/router-extras',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'nuxt-vuex-router-sync',
    [
      'nuxt-i18n',
      {
        locales: [
          {
            code: 'en',
            iso: 'en-US',
            name: 'English',
            file: 'en.js'
          },
          {
            code: 'es',
            iso: 'es-CO',
            name: 'Español',
            file: 'es.js'
          },
        ],
        defaultLocale: 'es',
        vueI18n: {
          locales: ['es', 'en'],
          locale: 'es',
          fallbackLocale: 'es',
          silentTranslationWarn: true,
        },
        lazy: true,
        langDir: 'locales/',
        //rootRedirect: '/es',
        strategy: 'prefix',
        seo: true,
        detectBrowserLanguage: false,
      }
    ]
  ],

  // PWA
  pwa: {
    meta: {
      name: process.env.VUE_APP_MANIFIEST_TITLE,
      author: process.env.VUE_APP_AUTHOR,
      description: process.env.VUE_APP_DESCRIPTION,
      mobileAppIOS: true,
      nativeUI: false,
      appleStatusBarStyle: 'default', // default - black - black-translucent
      lang: 'es',
    },
    manifest: {
      name: process.env.VUE_APP_MANIFIEST_TITLE,
      short_name: process.env.VUE_APP_TITLE,
      description: process.env.VUE_APP_DESCRIPTION,
      theme_color: '#ffffff',
      lang: 'es',
      start_url: `${process.env.VUE_APP_PUBLIC_PATH}/es/iniciar-sesion?standalone=true`,
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.VUE_APP_API_URL_BASE,
  },
  moment: {
    timezone: true,
    defaultLocale: 'es',
    locales: ['es'],
    defaultTimezone: 'America/Bogota'
  },
  recaptcha: {
    hideBadge: true, // Hide badge element (v3 & v2 via size=invisible)
    siteKey: process.env.VUE_APP_CAPTCHA_SITE, // Site key for requests
    version: 2, // Version
    size: 'compact' // Size: 'compact', 'normal', 'invisible' (v2)
  },
  auth: {
    redirect: false,
    rewriteRedirects: false,
    /*
    redirect: {
      login: '/login',
      logout: '/login',
      callback: false,
      home: '/',
    },
     */
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
          maxAge: 28799,
          required: true,
          type: 'Bearer'
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 28799 * 2,
        },
        user: {
          property: 'data',
          autoFetch: true
        },
        endpoints: {
          login: {
            url: `/${process.env.VUE_APP_API_PREFIX}/login`,
            method: 'post',
            propertyName: 'access_token'
          },
          refresh: {
            url: '/oauth/token/refresh',
            method: 'post'
          },
          logout: {
            url: '/api/logout',
            method: 'post'
          },
          user: {
            url: '/api/user',
            method: 'get',
            propertyName: 'data'
          }
        },
        autoLogout: true,
      },
    },
    plugins: ['@/plugins/auth.js']
  },
  router: {
    base: process.env.VUE_APP_PUBLIC_PATH,
    middleware: ['i18n', 'auth'],
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    optionsPath: "./plugins/vuetify.js",
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
  },
  /*
   ** Build configuration
   */
  build: {
    // Add exception
    transpile: [
      "vee-validate/dist/rules"
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
}
