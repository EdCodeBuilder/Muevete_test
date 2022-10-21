<template>
  <v-scale-transition origin="center center">
    <div
      class="v-empty-state"
      :class="[emptyStateClasses]"
      :style="emptyStateStyles"
    >
      <div class="v-empty-state-container">
        <template v-if="icon">
          <v-icon class="v-empty-state-icon">{{ icon }}</v-icon>
        </template>
        <strong v-if="label" class="v-empty-state-label grey--text">{{
          label
        }}</strong>
        <p v-if="description" class="v-empty-state-description grey--text">
          {{ description }}
        </p>

        <slot />
      </div>
    </div>
  </v-scale-transition>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    rounded: Boolean,
    size: {
      type: Number,
      default: 420,
    },
    icon: {
      type: String,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    emptyStateClasses() {
      return {
        'v-rounded': this.rounded,
      }
    },
    emptyStateStyles() {
      if (this.rounded) {
        const size = this.size + 'px'

        return {
          width: size,
          height: size,
        }
      }
      return {}
    },
  },
}
</script>
