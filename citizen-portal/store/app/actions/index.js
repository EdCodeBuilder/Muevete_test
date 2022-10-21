// Utilities
import { make } from 'vuex-pathify'
import state from '~/store/app/state'

const IN_BROWSER = typeof window !== 'undefined'

const actions = {
  ...make.actions(state),
  init: ({ commit }) => {
    if (!IN_BROWSER) return

    window.addEventListener('beforeinstallprompt', (e) => {
      // Intercept default PWA install prompt
      e.preventDefault()

      commit('sw', { ...state.sw, install: e })
    })

    document.addEventListener('swupdatefound', (e) => {
      commit('sw', { ...state.sw, update: e.detail })
    })
  },
  install: async ({ commit, state }) => {
    const response = await state.sw.install.prompt()
    const accepted = response.userChoice.outcome === 'accepted'

    if (accepted) console.log(`[sw:passport] Installing Passport App...`)

    commit('snackbar', false)
  },
  update: async ({ commit, state }) => {
    console.log(`[sw:passport] Updating documentation content...`)

    await state.sw.update.waiting.postMessage('sw:update')

    commit('snackbar', false)
  },
  setBarImage: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_BAR_IMAGE', payload)
      resolve()
    })
  },
  toggleClipped: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_CLIPPED', payload)
      resolve()
    })
  },
  toggleMiniVariant: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_MINI_VARIANT', payload)
      resolve()
    })
  },
  toggleDrawer: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_DRAWER', payload)
      resolve()
    })
  },
  toggleRTL: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_RTL', payload)
      resolve()
    })
  },
  setTheme: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_DARK_TYPE', payload)
      resolve()
    })
  },
  toggleRightDrawer: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_RIGHT_DRAWER', payload)
      resolve()
    })
  },
  toggleDarker: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_DARKER', payload)
      if (payload) {
        commit('SET_SCRIM', 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)')
      }
      resolve()
    })
  },
  setBarColor: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_SCRIM', payload)
      resolve()
    })
  },
  setActiveColor: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_ACTIVE', payload)
      resolve()
    })
  },
  setLocale: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_LANG', payload)
      resolve()
    })
  },
  toggleSnackBar: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SHOW_HIDE_SNACKBAR', payload)
      resolve()
    })
  },
  setSnackBar: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_SNACKBAR', payload)
      resolve()
    })
  },
  removeFromSnackBar: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('REMOVE_FROM_SNACKBAR', payload)
      resolve()
    })
  },
  unsetSnackBar: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('UNSET_SNACKBAR')
      resolve()
    })
  },
  unsetMenuDrawer: ({ commit }) => {
    return new Promise((resolve) => {
      commit('UNSET_MENU_DRAWER')
      resolve()
    })
  },
  setMenuDrawer: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_MENU_DRAWER', payload)
      resolve()
    })
  },
  setPermissions: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_PERMISSIONS', payload)
      resolve()
    })
  },
  unsetPermissions: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('UNSET_PERMISSIONS', payload)
      resolve()
    })
  },
  setBouncer: ({ commit }, payload) => {
    return new Promise((resolve) => {
      commit('SET_BOUNCER', payload)
      resolve()
    })
  },
  unsetBouncer: ({ commit }) => {
    return new Promise((resolve) => {
      commit('UNSET_BOUNCER')
      resolve()
    })
  },
}

export default actions
