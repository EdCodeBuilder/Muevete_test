<template>
  <h1 :class="classes">
    <slot />
  </h1>
</template>

<script>
export default {
  name: 'LandingHeading',
  computed: {
    classes() {
      return this.$vuetify.breakpoint.smAndDown
        ? 'display-4 font-weight-black mb-10'
        : 'brand'
    },
  },
}
</script>

<style lang="sass" scoped>
.brand
  font-size: 6rem
  font-weight: 600
  display: inline-block
  position: relative
  text-shadow: 0 15px 102.86px rgba(0,0,0,.7), 0 15px 40.02px rgba(0,0,0,.21)
</style>
