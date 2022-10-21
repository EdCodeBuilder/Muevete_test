import { setClient } from '@/models/client'

export default ({ app, $axios, redirect, error, store }) => {
  $axios.setHeader('X-Localization', app.i18n.locale)
  $axios.setHeader('X-Requested-With', 'XMLHttpRequest')
  $axios.setHeader('Accept', 'application/json')
  $axios.setHeader('Content-Type', 'application/json')
  const csfr = app.$cookies.get('XSRF-TOKEN')
  if (csfr) {
    $axios.setHeader('X-XSRF-TOKEN', csfr)
  }
  $axios.onError((errors) => {
    if (errors.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line
        console.log('Response')
        // eslint-disable-next-line
        console.log(errors.response)
      }
      if (errors.response.status === 401) {
        // eslint-disable-next-line
        console.log(errors.response)
        if (app.$auth.loggedIn) {
          app.$auth.logout().finally(() => {
            store.dispatch('app/unsetMenuDrawer')
            store.dispatch('app/unsetBouncer')
            redirect(app.localePath({ name: 'login' }))
          })
        } else {
          store.dispatch('app/unsetMenuDrawer')
          store.dispatch('app/unsetBouncer')
          redirect(app.localePath({ name: 'login' }))
        }
      } else if (
        ![401, 403, 422, 429, 404, 419, 504].includes(errors.response.status)
      ) {
        // eslint-disable-next-line
        console.log(errors.response)
        error({
          statusCode: errors.response.status,
          message: errors.response.data.message,
        })
      } else if ([504].includes(errors.response.status)) {
        // eslint-disable-next-line
        console.log(errors.response)
        error({
          statusCode: errors.response.status,
          message:
            'El servidor S.I.M. ha tardado en responder a tu solicitud, es posible que se estén realizando muchas solicitudes en este momento y el servidor esté congestionado. Intenta nuevamente en unos instantes y si el problema persiste, comunícate con soporte.',
        })
      }
    } else if (errors.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      if (process.env.NODE_ENV === 'production') {
        redirect(app.localePath({ name: 'login' }))
      }
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line
        console.log('Request')
        // eslint-disable-next-line
        console.log(errors.request)
        error({
          statusCode: 500,
          message: errors.request.response || app.i18n.t('errors.request'),
        })
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      // eslint-disable-next-line
      console.error('Error', errors)
      if (!$axios.isCancel(errors)) {
        error({
          statusCode: 500,
          message: app.i18n.t('errors.message'),
        })
      }
    }
  })
  setClient(app)
}
