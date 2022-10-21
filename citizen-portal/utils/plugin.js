import { Model } from '~/models/Model'
const initBouncer = (context, inject, model) => {
  return new Promise((resolve) => {
    const user = {
      id: null,
      roles: [],
      abilities: [],
    }
    if (model && model instanceof Model) {
      model
        .index()
        .then((response) => {
          user.roles = response.data.roles
          user.abilities = response.data.abilities
          user.id = response.data.id
        })
        .finally(() => {
          context.app.store.dispatch('app/setBouncer', user)
          resolve(user)
        })
    } else {
      context.app.store.dispatch('app/setBouncer', user)
      resolve(user)
    }
  })
}

export default initBouncer
