export default function ({ $auth, route, redirect, app }) {
  // If the user is not authenticated and needs reset password
  if (route.query.passport) {
    return redirect(app.localePath({ name: 'validate-passport' }), route.query)
  }
}
