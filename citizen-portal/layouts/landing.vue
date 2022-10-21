<template>
  <v-app>
    <app-bar :dark="true" />
    <v-landing-parallax>
      <v-jumbotron :src="bg" opacity="0.3">
        <v-container class="fill-height justify-center" tag="section">
          <v-row align="center" class="text-center" justify="center">
            <v-col class="mb-10">
              <v-landing-heading v-text="title" />
              <v-landing-subheading v-text="author" />
              <v-btn
                outlined
                icon
                class="mt-4"
                @click="$vuetify.goTo(target, options)"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-jumbotron>
    </v-landing-parallax>
    <nuxt />
    <core-footer />
    <snack />
    <update-notification />
  </v-app>
</template>

<script>
export default {
  name: 'Landing',
  auth: false,
  components: {
    AppBar: () => import('~/components/base/LandingAppBar'),
    VLandingParallax: () => import('~/components/base/Parallax'),
    VJumbotron: () => import('~/components/base/Jumbotron'),
    VLandingHeading: () => import('~/components/base/Heading'),
    VLandingSubheading: () => import('~/components/base/Subheading'),
    CoreFooter: () => import('~/components/base/LandingFooter'),
    Snack: () => import('~/components/base/SnackBar'),
    UpdateNotification: () => import('@/components/base/UpdateAvailable'),
  },
  data: () => ({
    bg: require('@/static/login.jpg'),
    duration: 300,
    offset: 0,
    easing: 'easeInOutCubic',
    target: '#certificates',
  }),
  computed: {
    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing,
      }
    },
    title() {
      return process.env.VUE_APP_DRAWER
    },
    author() {
      return process.env.VUE_APP_AUTHOR
    },
  },
}
</script>

<style lang="sass" scoped>
.theme--light
  .main
    background: #FFFFFF
    position: relative
.theme--dark
  .main
    background: #1E1E1E
    position: relative
</style>
