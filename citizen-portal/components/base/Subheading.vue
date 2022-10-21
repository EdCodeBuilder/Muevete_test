<template>
  <h3 :class="classes">
    <slot />
  </h3>
</template>

<script>
export default {
  name: 'LandingSubHeading',
  computed: {
    classes() {
      return this.$vuetify.breakpoint.smAndDown
        ? 'display-serif-2 font-weight-bold'
        : 'subtitle'
    },
  },
}
</script>

<style lang="sass" scoped>
.subtitle
  font-family: "Roboto Slab", "Times New Roman", serif
  font-size: 1.5rem
  max-width: 500px
  margin: 0px auto 0
  text-shadow: 0 15px 102.86px rgba(0,0,0,.7), 0 15px 40.02px rgba(0,0,0,.21)
</style>
