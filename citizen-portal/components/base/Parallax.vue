<template>
  <div :style="styles">
    <slot />
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Parallax',
  data() {
    return {
      styles: {},
      debounceTimeout: 6,
    }
  },
  mounted() {
    const self = this
    window.addEventListener('scroll', function () {
      // if (window.innerWidth > 991) {
      self.checkForParallax(this.scrollY)
      // }
    })
  },
  methods: {
    handleScroll(scrollVal) {
      const oVal = scrollVal / 3
      this.styles = {
        transform: `translate3d(0, ${oVal}px,0)`,
      }
    },
    checkForParallax(scrollVal) {
      const fn = _.debounce(
        () => this.handleScroll(scrollVal),
        this.debounceTimeout
      )
      fn()
    },
  },
}
</script>
