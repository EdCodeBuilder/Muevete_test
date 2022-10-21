<template>
  <v-card v-bind="$attrs" color="transparent" flat :class="classes">
    <v-avatar v-if="!infoHorizontal && icon" size="70">
      <v-icon :color="iconColor" :size="iconSize">{{ icon }}</v-icon>
    </v-avatar>
    <h4 v-if="subtitle" class="display-serif-2 info-title">
      <v-icon
        v-if="infoHorizontal && icon"
        class="mr-2"
        size="40"
        :color="iconColor"
        v-text="icon"
      ></v-icon>
      {{ subtitle }}
    </h4>
    <v-card-text class="font-weight-light grey--text">
      <slot></slot>
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'InfoContent',
  props: {
    icon: {
      type: String,
      default: 'mdi-alert',
    },
    iconColor: {
      type: String,
      default: 'info',
    },
    iconSize: {
      type: Number,
      default: 61.6,
    },
    subtitle: {
      type: String,
      default: undefined,
    },
    textCenter: Boolean,
    textRight: Boolean,
    textLeft: Boolean,
    infoHorizontal: Boolean,
  },
  computed: {
    classes() {
      return {
        'mx-auto pb-4 px-2': true,
        'info-horizontal text-left': this.infoHorizontal,
        'text-right': this.textRight,
        'text-left': this.textLeft,
        'text-center': this.textCenter,
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.info-title
  margin-top: 30px
</style>
