import VuexPersistence from 'vuex-persist'
import localForage from 'localforage'
import { v4 as uuidv4 } from 'uuid'
import Crypto from 'crypto-js'

const dev = process.env.NODE_ENV !== 'production'

localForage.config({
  name: process.env.VUE_APP_INDEX_DB_NAME || 'vuetify_app',
  version: 1.0,
  storeName: process.env.VUE_APP_INDEX_DB_NAME || 'vuetify_app',
  description: 'Store attributes in the browser for offline use.',
})

const cookieName = 'citizen_application_id'

const storageKey = process.env.VUE_APP_STORAGE_KEY

export default ({ app, store }) => {
  // Get the encryption token from cookie or generate a new one.
  const encryptionToken = app.$cookies.get(cookieName) || uuidv4()
  // Store the encryption token in a secure cookie.
  app.$cookies.set(cookieName, encryptionToken, { secure: dev, maxAge: 180 })

  const storageLocal = {
    getItem: () => {
      // Get the store from local storage.
      const store = window.localStorage.getItem(storageKey)
      if (store) {
        try {
          // Decrypt the store retrieved from local storage
          // using our encryption token stored in cookies.
          if (dev) {
            return JSON.parse(store)
          } else {
            const bytes = Crypto.AES.decrypt(store, encryptionToken)
            return JSON.parse(bytes.toString(Crypto.enc.Utf8))
          }
        } catch (e) {
          // The store will be reset if decryption fails.
          window.localStorage.removeItem(storageKey)
        }
      }
      return null
    },
    setItem: (key, value) => {
      // Encrypt the store using our encryption token stored in cookies.
      let store = value
      if (!dev) {
        store = Crypto.AES.encrypt(value, encryptionToken).toString()
      }
      // Save the encrypted store in local storage.
      return window.localStorage.setItem(storageKey, store)
    },
    removeItem: () => window.localStorage.removeItem(storageKey),
  }

  new VuexPersistence({
    strictMode: false,
    asyncStorage: true,
    key: process.env.VUE_APP_INDEX_DB_NAME || 'vuetify_app',
    storage: localForage,
    modules: ['route', 'portal'],
  }).plugin(store)

  new VuexPersistence({
    strictMode: false,
    asyncStorage: false,
    key: process.env.VUE_APP_INDEX_DB_NAME || 'vuetify_app',
    storage: storageLocal,
    modules: ['app'],
  }).plugin(store)
}
