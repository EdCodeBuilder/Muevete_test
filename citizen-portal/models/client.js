let app
export function setClient(newApp) {
  app = newApp
}

const service = {
  $app() {
    if (!app) {
      throw new Error('App not installed')
    } else {
      return app
    }
  },
}

export default service
