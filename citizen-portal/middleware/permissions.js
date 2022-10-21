import { has } from 'lodash'
import { setClient } from '~/models/client'
import { Auth } from '~/models/services/auth/Auth'
import { Model } from '~/models/Model'
import Bouncer from '~/utils/Bouncer'
export default async function (context) {
  setClient(context.app)
  context.app.store.dispatch('app/unsetBouncer')
  const meta = context.route.meta[0]
  let model = {}
  const loggedIn = context.app.store.state.auth
  console.log(loggedIn)
  if (has(loggedIn, 'loggedIn') && loggedIn.loggedIn && meta.permissionsUrl) {
    model = new Auth(meta.permissionsUrl)
  }
  const user = {
    id: null,
    roles: [],
    abilities: [],
  }
  if (model && model instanceof Model) {
    const response = await model.index()
    user.roles = response.data.roles || []
    user.abilities = response.data.abilities || []
    user.id = response.data.id || null
    context.app.store.dispatch('app/setBouncer', user)
  } else {
    context.app.store.dispatch('app/setBouncer', user)
  }
  const bouncer = new Bouncer(user)
  context.$bouncer = bouncer
  context.$can = bouncer.can.bind(bouncer)
  context.$canAny = bouncer.canAny.bind(bouncer)
  context.$cannot = bouncer.cannot.bind(bouncer)
  context.$isA = bouncer.isA.bind(bouncer)
  context.$isAn = bouncer.isAn.bind(bouncer)
  context.$isNotA = bouncer.isNotA.bind(bouncer)
  context.$isNotAn = bouncer.isNotAn.bind(bouncer)
  if (has(meta, 'permissions') || has(meta, 'roles')) {
    if (typeof meta.permissions === 'function') {
      if (!meta.permissions(bouncer)) {
        // Push notification to inform user they do not have permission
        context.app.$snackbar({
          message: context.app.i18n.t('errors.permissions'),
        })
        // redirect to a universal page they will have access to
        context.redirect(
          context.app.localePath({
            name: 'home',
            replace: true,
          })
        )
      }
    } else if (
      (has(meta, 'permissions') && bouncer.cannot(meta.permissions)) ||
      (has(meta, 'roles') && bouncer.isNotA(meta.roles))
    ) {
      // Push notification to inform user they do not have permission
      context.app.$snackbar({
        message: context.app.i18n.t('errors.permissions'),
      })
      // redirect to a universal page they will have access to
      context.redirect(
        context.app.localePath({
          name: 'home',
          replace: true,
        })
      )
    }
  }
}
