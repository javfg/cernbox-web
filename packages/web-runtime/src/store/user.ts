import { setUser as sentrySetUser } from '@sentry/vue'

const getInitialState = () => ({
  id: '',
  uuid: '',
  displayname: '',
  email: '',
  isLightweight: false,
  capabilities: [],
  version: {},
  groups: [],
  quota: null,
  language: null,
  role: null,
  roles: [],
  disableNotifications: false,
})
const state = getInitialState()

const getters = {
  /**
   * The `getToken` getter is deprecated. Please use getters['runtime/auth/accessToken'] instead.
   *
   * @param state
   * @param getters
   * @param rootState
   * @param rootGetters
   */
  getToken: (state, getters, rootState, rootGetters) => rootGetters['runtime/auth/accessToken'],
  capabilities: (state) => state.capabilities,
  quota: (state) => state.quota,
  user: (state) => state, 
  language: (state) => state.language,
  disableNotifications: (state) => state.disableNotifications
}

const mutations = {
  SET_USER(state, user) {
    let email
    if (Object.keys(user.email).length === 0) {
      email = ''
    } else {
      email = user.email
    }
    state.displayname = user.displayname
    state.id = user.id
    state.uuid = user.uuid
    state.username = user.username
    state.email = email
    state.groups = user.groups
    state.language = user.language
    state.role = user.role
    state.isLightweight = user.isLightweight
    state.disableNotifications = user.disableNotifications
    sentrySetUser({ username: user.id })
  },
  SET_CAPABILITIES(state, data) {
    state.capabilities = data.capabilities
    state.version = data.version
  },
  /**
   * Legacy for oC10, in OCIS quota sticks on the respective drive
   * @param state
   * @param quota
   * @constructor
   */
  SET_QUOTA(state, quota) {
    // Turn strings into ints
    quota.free = parseInt(quota.free)
    quota.relative = parseFloat(quota.relative)
    quota.used = parseInt(quota.used)
    quota.total = parseInt(quota.total)

    state.quota = quota
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  },
  RESET_USER(state) {
    Object.assign(state, getInitialState())
  },
  SET_LANGUAGE(state, language) {
    state.language = language
  },
  SET_NOTIFICATION(state, disableNotifications) {
    state.disableNotifications = disableNotifications
  }
}

const actions = {
  resetUserState(context) {
    if (context.state.id === '') {
      return
    }
    // reset user
    context.commit('RESET_USER')
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
