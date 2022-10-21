import Vue from 'vue'
import cookieconsent from 'vue-cookieconsent-component'

export default ({ app }) => {
  Vue.component('CookieConsent', cookieconsent)
}
