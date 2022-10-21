import { make } from 'vuex-pathify'
import state from '~/store/portal/state'

const defaultState = state()

export default {
  actions: {
    ...make.actions(state),
    reset: ({ commit }) => {
      return new Promise((resolve) => {
        commit('RESET_STATE', defaultState)
        resolve()
      })
    },
  },
  getters: make.getters(state),
  mutations: {
    ...make.mutations(state),
    RESET_STATE(state, payload) {
      state = payload
    },
  },
  state,
}
