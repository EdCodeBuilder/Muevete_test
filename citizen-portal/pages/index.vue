<script>
export default {
  name: 'Index',
  middleware: [
    function ({ app, redirect }) {
      if (app.$auth.loggedIn) {
        redirect(app.localePath({ name: 'home' }))
      } else {
        redirect(app.localePath({ name: 'login' }))
      }
    },
  ],
}
</script>
