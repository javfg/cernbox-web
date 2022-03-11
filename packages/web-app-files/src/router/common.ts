import { RouteComponents } from './router'
import { Location, RouteConfig } from 'vue-router'
import { createLocation, $gettext, isLocationActiveDirector } from './utils'

type commonTypes = 'files-common-favorites' | 'files-common-search' | 'files-common-trash' | 'files-common-home'

export const createLocationCommon = (name: commonTypes, location = {}): Location =>
  createLocation(name, location)

export const locationFavorites = createLocationCommon('files-common-favorites')
export const locationTrash = createLocationCommon('files-common-trash')
export const locationSearch = createLocationCommon('files-common-search')
export const locationHome = createLocationCommon('files-common-home')

export const isLocationCommonActive = isLocationActiveDirector<commonTypes>(
  locationFavorites,
  locationSearch,
  locationTrash,
  locationHome
)

export const buildRoutes = (components: RouteComponents): RouteConfig[] => [
  {
    path: '/search',
    component: components.App,
    children: [
      {
        name: locationSearch.name,
        path: 'list/:page?',
        component: components.SearchResults,
        meta: {
          hideFilelistActions: true,
          hasBulkActions: true,
          title: $gettext('Search results'),
          contextQueryItems: ['term', 'provider']
        }
      }
    ]
  },
  {
    path: '/trash',
    component: components.App,
    children: [
      {
        name: locationTrash.name,
        path: '',
        component: components.Trashbin,
        meta: {
          hideFilelistActions: true,
          hasBulkActions: true,
          title: $gettext('Deleted files')
        }
      }
    ]
  },
  {
    path: '/favorites',
    component: components.App,
    children: [
      {
        name: locationFavorites.name,
        path: '',
        component: components.Favorites,
        meta: {
          hideFilelistActions: true,
          hasBulkActions: false,
          title: $gettext('Favorite files')
        }
      }
    ]
  },
  {
    path: '/home',
    components: {
      app: components.App
    },
    children: [
      {
        name: locationHome.name,
        path: '',
        component: components.Home,
        meta: {
          hideFilelistActions: true,
          hasBulkActions: false,
          title: $gettext('Home')
        }
      }
    ]
  }
]
