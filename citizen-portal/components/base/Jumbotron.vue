<template>
  <v-img
    aspect-ratio="16/9"
    :src="src"
    :gradient="gradient"
    :height="height"
    :min-height="minHeight"
  >
    <v-overlay :height="height" :opacity="opacity">
      <slot />
    </v-overlay>
  </v-img>
</template>

<script>
export default {
  props: {
    gradient: {
      type: String,
      default: 'to top, rgba(0,0,0,.32), rgba(0,0,0,.32)',
    },
    height: {
      type: [Number, String],
      default: '30vh',
    },
    minHeight: {
      type: [Number, String],
      default: '100vh',
    },
    src: {
      type: String,
      default: undefined,
      required: true,
    },
    opacity: {
      type: String,
      default: '0',
      required: true,
    },
  },
}
</script>
