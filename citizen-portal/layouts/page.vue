<template>
  <v-app>
    <app-bar />
    <CoreView />
    <CoreFooter />
    <Snack />
    <cookie-consent
      :message="message"
      :href="href"
      :link-label="$t('buttons.LearnMore')"
      :button-label="$t('buttons.Accept')"
    />
    <update-notification />
  </v-app>
</template>

<script>
export default {
  name: 'AuthPage',
  components: {
    AppBar: () => import('~/components/auth/AppBar'),
    CoreView: () => import('~/components/auth/View'),
    CoreFooter: () => import('~/components/auth/AuthFooter'),
    Snack: () => import('~/components/base/SnackBar'),
    UpdateNotification: () => import('@/components/base/UpdateAvailable'),
  },
  computed: {
    message() {
      return 'Nuestro sitio web utiliza cookies propias y de terceros con el fin de proporcionarle una mejor experiencia de navegación y brindarle servicios personalizados. Si hace clic en el botón Aceptar o si continúa navegando, nos confirma que usted acepta su uso. Puede obtener más información'
    },
    href() {
      return 'https://bogota.gov.co/historico-alcaldia/politica-de-confidencialidad-y-terminos-de-uso'
    },
  },
}
</script>

<style lang="scss">
// required and to get updates
@import './node_modules/vue-cookieconsent-component/src/scss/cookie-consent';
// example or use it
@import './node_modules/vue-cookieconsent-component/src/scss/cookie-consent-bottom';
@import './node_modules/vue-cookieconsent-component/src/scss/cookie-consent-transition';
</style>
