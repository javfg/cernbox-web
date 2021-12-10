import translations from '../l10n/translations'
import App from './App.vue'

// just a dummy function to trick gettext tools
function $gettext(msg) {
  return msg
}

const route = {
  components: {
    fullscreen: App
  },
  meta: {
    title: $gettext('Draw.io'),
    hideHeadbar: true,
    patchCleanPath: true
  }
}

const routes = [
  {
    ...route,
    name: 'edit',
    path: '/edit/:filePath*'
  },
  {
    ...route,
    name: 'public',
    path: '/public/:filePath*',
    meta: {
      ...route.meta,
      auth: false
    }
  }
]

const appInfo = {
  name: 'Draw.io',
  id: 'draw-io',
  icon: 'grid_on',
  extensions: [
    {
      extension: 'drawio',
      newTab: true,
      routeName: 'draw-io-edit',
      canBeDefault: true,
      newFileMenu: {
        menuTitle($gettext) {
          return $gettext('New Draw.io document')
        }
      },
      routes: [
        'files-personal',
        'files-favorites',
        'files-shared-with-others',
        'files-shared-with-me'
      ]
    },
    {
      extension: 'drawio',
      newTab: true,
      routeName: 'draw-io-public',
      canBeDefault: true,
      newFileMenu: {
        menuTitle($gettext) {
          return $gettext('New Draw.io document')
        }
      },
      routes: ['files-public-list']
    },
    {
      extension: 'vsdx',
      newTab: true,
      routeName: 'draw-io-edit',
      canBeDefault: true,
      routes: [
        'files-personal',
        'files-favorites',
        'files-shared-with-others',
        'files-shared-with-me'
      ]
    },
    {
      extension: 'vsdx',
      newTab: true,
      routeName: 'draw-io-public',
      canBeDefault: true,
      routes: ['files-public-list']
    }
  ]
}

export default {
  appInfo,
  routes,
  translations
}
