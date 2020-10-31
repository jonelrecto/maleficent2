// Configuration for your app
// let jquery = require('node_modules/jquery/src/jquery.js')

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'vuechart',
      'firebase',
      'vuefire',
      'lodash',
      'vue-calendar',
      'moment',
      'vuelidate',
      'vue-currency',
      'vuechartkick',
      'xlsx-vue',
      'dayspan',
      'vuetify'
    ],
    css: [
      'app.styl',
      'vuecal.css'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons', // optional, you are not bound to it
      // 'ionicons',
      'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
      }
    },
    devServer: {
      // https: true,
      port: 8082,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QLayoutFooter',
        'QPageContainer',
        'QTabs',
        'QTab',
        'QTabPane',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QRouteTab',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QField',
        'QInput',
        'QScrollArea',
        'QItemSeparator',
        'QItemTile',
        'QCollapsible',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QFab',
        'QFabAction',
        'QPageSticky',
        'QModal',
        'QModalLayout',
        'QSelect',
        'QToggle',
        'QCheckbox',
        'QRange',
        'QChip',
        'QSearch',
        'QRadio',
        'QOptionGroup',
        'QInnerLoading',
        'QSpinner',
        'QSpinnerGears',
        'QSpinnerTail',
        'QEditor',
        'QUploader',
        'QCard',
        'QCardTitle',
        'QCardMain',
        'QCardSeparator',
        'QCardActions',
        'QDatetime',
        'QPopover',
        'QBtnGroup',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QCardMedia',
        'QParallax',
        'QAutocomplete',
        'QBtnToggle',
        'QTree',
        'QChatMessage',
        'QSpinnerCube',
        'QBreadcrumbs',
        'QBreadcrumbsEl',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QRating',
        'QProgress',
        'QBtnDropdown'
      ],
      directives: [
        'Ripple',
        'CloseOverlay'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'LocalStorage',
        'Loading'
      ],
      config: {
        brand: {
          saladyellow: '#c5b513'
        },
        loading: {
          message: 'Please Wait',
          messageColor: 'white',
          spinnerSize: 100, // in pixels
          spinnerColor: 'white',
          customClass : 'bg-faded'
        }
      },
      iconSet: 'mdi'
      // i18n: 'de' // Quasar language  
    },
    // animations: 'all' --- includes all animations
    animations: [
      'slideInLeft',
      'slideOutLeft'
    ],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        name: 'Maleficent Model Academy App',
        short_name: 'MMA',
        description: 'Modeling Management',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
