<template>
  <v-list-item
    link
    :href="href"
    :rel="href && href !== '#' ? 'noopener' : undefined"
    :target="href && href !== '#' ? '_blank' : undefined"
    :to="item.to ? localePath(item.to) : undefined"
    :active-class="`${activeColor} ${
      !$vuetify.theme.dark ? 'white' : 'white'
    }--text`"
    :exact="item.exact"
    @click="callback"
  >
    <v-list-item-icon
      v-if="text"
      :class="iconClasses"
      class="v-list-item__icon--text"
      v-text="computedText"
    />

    <v-list-item-icon v-else-if="item.icon">
      <v-icon :class="iconClasses" v-text="item.icon" />
    </v-list-item-icon>

    <v-list-item-content v-if="item.title || item.subtitle">
      <v-list-item-title class="text-capitalize" v-text="item.title" />
      <v-list-item-subtitle v-if="item.subtitle" v-text="item.subtitle" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Themeable from 'vuetify/lib/mixins/themeable'
export default {
  name: 'Item',
  mixins: [Themeable],
  props: {
    item: {
      type: Object,
      default: () => ({
        href: undefined,
        icon: undefined,
        subtitle: undefined,
        title: undefined,
        to: undefined,
      }),
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iconClasses() {
      if (!this.$vuetify.rtl && this.miniVariant) {
        return 'ml-5'
      } else if (this.$vuetify.rtl && this.miniVariant) {
        return 'mr-1'
      } else {
        return ''
      }
    },
    computedText() {
      if (!this.item || !this.item.title) return ''

      let text = ''

      this.item.title.split(' ').forEach((val) => {
        text += val.substring(0, 1)
      })

      return text.toUpperCase()
    },
    href() {
      return !this.item.to
        ? this.item.href || (!this.item.to ? undefined : undefined)
        : undefined
    },
    activeColor() {
      return this.$store.getters['app/getActiveColor']
    },
    miniVariant: {
      get() {
        return this.$store.getters['app/getMiniVariant']
      },
      set(val) {
        this.$store.dispatch('app/toggleMiniVariant', val)
      },
    },
    callback() {
      if (typeof this.item.callback === 'function') {
        return this.item.callback
      }
      return () => ({})
    },
  },
}
</script>
