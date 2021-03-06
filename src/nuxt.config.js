import { langConfig } from './config/langConfig'
import { bootstrapConfig } from './config/bootstrapConfig'
import { momentConfig } from './config/momentConfig'
import { toastConfig } from './config/toastConfig'
import { yandexMetrikaConfig } from './config/yandexMetrikaConfig'
// import { PWAConfig } from './config/PWAConfig'

// const env = require('dotenv').config()?.parsed

export default {
  render: {
    resourceHints: false,
    bundleRenderer: {
      shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type),
    },
  },

  hooks: {
    'vue-renderer:ssr:context'(context) {
      const routePath = JSON.stringify(context.nuxt.routePath)
      context.nuxt = { serverRendered: true, routePath }
    },
  },

  head: {
    title: 'Erriour.me',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'author',
        name: 'author',
        content: 'Vladimir Gonchar (https://vk.com/erriour)',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/static/favicon.svg' },
      {
        rel: 'prefetch',
        type: 'image/svg+xml',
        href: '/static/favicon.svg',
        as: 'image',
      },
    ],
  },

  css: ['~/assets/scss/bootstrap.scss', '~/assets/scss/global.scss'],

  plugins: [
    { src: '~/plugins/headMixin', ssr: true },
    { src: '~/plugins/localStorage', ssr: false },
    { src: '~/plugins/axios', ssr: true },
    { src: '~/plugins/vViewer', ssr: true },
    { src: '~/plugins/vueGates', ssr: false },
    { src: '~/plugins/init', ssr: false },
    { src: '~/plugins/vueTelInput', ssr: false },
    { src: '~/plugins/lazySizes', ssr: true },
    { src: '~/plugins/globalComponents', ssr: true },
  ],

  components: false,

  buildModules: ['@nuxtjs/eslint-module'],

  modules: [
    '@nuxtjs/dotenv',
    'cookie-universal-nuxt',
    ['@nuxtjs/toast', toastConfig],
    ['@nuxtjs/i18n', langConfig],
    '@nuxtjs/axios',
    ['bootstrap-vue/nuxt', bootstrapConfig],
    ['@nuxtjs/moment', momentConfig],
    '@nuxtjs/svg-sprite',
    ['@nuxtjs/yandex-metrika', yandexMetrikaConfig],
    'nuxt-vue-multiselect',
    // ['@nuxtjs/pwa', PWAConfig],
  ],

  svgSprite: {
    input: '~/assets/sprites',
    output: '~/static/static/sprites',
  },

  loading: { color: '#0095ff', throttle: 0 },

  build: {
    analyze: false, // True to get packages diagram
    extractCSS: process.env.NODE_ENV !== 'development',

    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ],
    },

    loaders: {
      vue: {
        compiler: require('vue-template-babel-compiler'),
      },
    },

    // Don't save cache in dev (for CloudFlare)
    devMiddleware: {
      headers: {
        'Cache-Control': 'no-store',
        Vary: '*',
      },
    },

    '@fullhuman/postcss-purgecss': {
      content: [
        './pages/**/*.vue',
        './layouts/**/*.vue',
        './components/**/*.vue',
        './content/**/*.md',
        './content/**/*.json',
      ],
      whitelist: [
        'html',
        'body',
        'has-navbar-fixed-top',
        'nuxt-link-exact-active',
        'nuxt-progress',
      ],
      whitelistPatternsChildren: [/svg-inline--fa/, /__layout/, /__nuxt/],
    },

    extend(config, { isDev, isClient, loaders: { vue } }) {
      // Image lazy load
      if (isClient) {
        vue.transformAssetUrls.img = ['data-src', 'src']
        vue.transformAssetUrls.source = ['data-srcset', 'srcset']
      }

      // ESLint tests
      if (isDev) {
        config.resolve.symlinks = false
      }

      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
}
