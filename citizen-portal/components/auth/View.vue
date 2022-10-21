<template>
  <v-main
    id="pages"
    :class="$vuetify.theme.dark ? undefined : 'grey lighten-3'"
  >
    <v-container class="fill-height" style="max-width: 1785px" fluid>
      <div id="blobs-animation" />
      <nuxt />
    </v-container>
  </v-main>
</template>

<script>
import lottie from 'lottie-web/build/player/lottie'
import * as blob from '~/static/lottie/blob.json'
export default {
  name: 'CoreView',
  computed: {
    styles() {
      const paddingTop = this.$vuetify.breakpoint.mdAndUp ? 175 : 100
      const paddingBottom = this.$vuetify.breakpoint.mdAndUp ? 175 : 150
      return {
        padding: `${paddingTop}px 0 ${paddingBottom}px 0`,
      }
    },
  },
  mounted() {
    lottie.loadAnimation({
      container: document.getElementById('blobs-animation'), // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: blob.default,
      rendererSettings: {
        viewBoxSize: '-100 0 800 800',
      },
    })
  },
}
</script>
