export default ({ app }) => {
  app.$auth.onRedirect((to) => {
    return app.localePath(to)
  })
}
