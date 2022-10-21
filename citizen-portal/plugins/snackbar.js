export default (context, inject) => {
  const snackbar = function (payload) {
    context.app.store.dispatch('app/toggleSnackBar', true)
    context.app.store.dispatch('app/setSnackBar', payload)
  }
  inject('snackbar', snackbar)
  context.$snackbar = snackbar
}
