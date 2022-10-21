<template>
  <v-main
    id="pages"
    :class="$vuetify.theme.dark ? undefined : 'grey lighten-3'"
  >
    <v-img
      :class="{
        'v-image--sm': $vuetify.breakpoint.smAndDown,
        'v-image--md': $vuetify.breakpoint.mdAndDown,
      }"
      :src="require(`~/static/login.jpg`)"
      gradient="to top, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)"
      min-height="100%"
    >
      <v-responsive
        :style="styles"
        min-height="100vh"
        class="d-flex align-center"
      >
        <nuxt />
      </v-responsive>
    </v-img>
  </v-main>
</template>

<script>
export default {
  name: 'PasswordView',
  computed: {
    styles() {
      const paddingTop = this.$vuetify.breakpoint.mdAndUp ? 175 : 100
      const paddingBottom = this.$vuetify.breakpoint.mdAndUp ? 175 : 150
      return {
        padding: `${paddingTop}px 0 ${paddingBottom}px 0`,
      }
    },
  },
}
</script>
