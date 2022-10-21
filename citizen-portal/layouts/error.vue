<template>
  <v-container
    :style="!$store.state.auth.loggedIn ? 'margin-top: -1%' : ''"
    class="error-page fill-height"
    tag="section"
  >
    <v-row
      class="text-right fill-height my-auto"
      justify="center"
      align="center"
    >
      <v-col cols="auto">
        <div
          v-if="error.statusCode === 404"
          id="404-error"
          style="max-width: 400px"
        />
        <div v-else id="cable-error" style="max-width: 500px" />
        <h1
          v-if="error.statusCode !== 404"
          :class="{ 'white--text': !$store.state.auth.loggedIn }"
          class="title font-weight-black"
        >
          {{ `Error: ${error.statusCode}` }}
        </h1>
        <div
          v-if="error.statusCode === 404"
          :class="{
            'white--text': !$store.state.auth.loggedIn,
            'display-3': $vuetify.breakpoint.mdAndUp,
            'display-2': $vuetify.breakpoint.smAndDown,
          }"
          class="mb-5"
        >
          {{ pageNotFound }}
        </div>
        <div
          v-else
          :class="{
            'white--text': !$store.state.auth.loggedIn,
            'display-3': $vuetify.breakpoint.mdAndUp,
            'display-2': $vuetify.breakpoint.smAndDown,
          }"
          class="mb-5"
        >
          {{ error.message || otherError }}
        </div>
        <v-btn color="primary" :to="localePath({ name: 'index' })">
          {{ $t('buttons.Error') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<router lang="yaml">
meta:
  title: Error
</router>

<script>
import lottie from 'lottie-web/build/player/lottie'
import * as error404 from '~/static/lottie/404.json'
import * as cable from '~/static/lottie/cable.json'
export default {
  layout(ctx) {
    return ctx.app.store.state.auth.loggedIn ? 'empty' : 'password'
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
  computed: {
    pageNotFound() {
      return this.$t('titles.NotFound')
    },
    otherError() {
      return this.$t('texts.Error')
    },
  },
  mounted() {
    lottie.loadAnimation({
      container: document.getElementById('404-error'), // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: error404.default,
    })
    lottie.loadAnimation({
      container: document.getElementById('cable-error'), // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: cable.default,
    })
  },
}
</script>

<style lang="sass" scoped>
.error-page
  h1.title
    font-family: "Roboto Slab", "Times New Roman", serif
    font-size: 80px!important
    letter-spacing: 2px!important
    font-weight: 700!important
    margin-bottom: 50px
@media(max-width:960px)
  .error-page
    h1.title
      font-size: 20px!important
      letter-spacing: 0px!important
      font-weight: 700!important
</style>
