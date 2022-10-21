// Utilities
import { make } from 'vuex-pathify'
import Bouncer from '~/utils/Bouncer'
import state from '~/store/app/state'

const mutations = {
  ...make.mutations(state),
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
  SET_DARK_TYPE(state, payload) {
    state.darkType = payload
  },
  SET_BAR_IMAGE(state, payload) {
    state.barImage = payload
  },
  SET_DRAWER(state, payload) {
    state.drawer = payload
  },
  SET_RIGHT_DRAWER(state, payload) {
    state.rightDrawer = payload
  },
  SET_CLIPPED(state, payload) {
    state.clipped = payload
  },
  SET_MINI_VARIANT(state, payload) {
    state.miniVariant = payload
  },
  SET_SCRIM(state, payload) {
    state.barColor = payload
  },
  SET_ACTIVE(state, payload) {
    state.activeColor = payload
  },
  SET_DARKER(state, payload) {
    state.darker = payload
  },
  SET_RTL(state, payload) {
    state.rtl = payload
  },
  SHOW_HIDE_SNACKBAR(state, payload) {
    state.showSnack = payload
  },
  SET_SNACKBAR(state, payload) {
    state.snackBar.push({
      id: `snack_${Math.random().toString(36).substr(2, 9)}`,
      color: payload.color || 'error',
      title: payload.title || '¡Error!',
      message:
        payload.message ||
        'Algo salió mal, estamos trabajando para resolver el inconveniente.',
      icon: payload.icon || 'mdi-bell-plus',
      position: payload.position || 'bottom',
      timeout: payload.timeout || 5000,
    })
  },
  REMOVE_FROM_SNACKBAR(state, payload) {
    const index = state.snackBar.findIndex((item) => item.id === payload)
    if (index !== -1) {
      state.snackBar.splice(index, 1)
    }
  },
  UNSET_SNACKBAR(state) {
    /*
    state.snackBar = {
      color: 'error',
      title: '¡Error!',
      message:
        'Algo salió mal, estamos trabajando para resolver el inconveniente.',
      icon: 'mdi-bell-plus',
      position: 'bottom',
      timeout: 5000,
    }
     */
    state.snackBar = []
  },
  SET_MENU_DRAWER(state, payload) {
    state.menu = payload
  },
  UNSET_MENU_DRAWER(state) {
    state.menu = []
  },
  SET_PERMISSIONS(state, payload) {
    state.permissions = payload
  },
  UNSET_PERMISSIONS(state) {
    state.permissions = []
  },
  SET_BOUNCER(state, payload) {
    state.bouncer = new Bouncer(payload)
  },
  UNSET_BOUNCER(state) {
    state.bouncer = new Bouncer({
      id: null,
      roles: [],
      abilities: [],
    })
  },
}

export default mutations
