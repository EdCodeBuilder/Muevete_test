<template>
  <v-menu
    bottom
    content-class="dropdown-menu"
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon v-if="$i18n.locale === 'es'">$vuetify.icons.es</v-icon>
        <v-icon v-else>$vuetify.icons.en</v-icon>
      </v-btn>
    </template>
    <v-list :tile="false" flat nav>
      <app-bar-item>
        <v-list-item-title @click.stop="onChangeLang('es')">
          <v-icon>$vuetify.icons.es</v-icon> ES
        </v-list-item-title>
      </app-bar-item>
      <app-bar-item>
        <v-list-item-title @click.stop="onChangeLang('en')">
          <v-icon>$vuetify.icons.en</v-icon> EN
        </v-list-item-title>
      </app-bar-item>
    </v-list>
  </v-menu>
</template>

<script>
// Components
import { VHover, VListItem } from 'vuetify/lib'
export default {
  name: 'Language',
  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text primary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                },
                this.$slots.default
              )
            },
          },
        })
      },
    },
  },
  methods: {
    onChangeLang(lang) {
      this.$i18n.locale = lang
      this.$i18n.setLocaleCookie(lang)
      this.$axios.setHeader('X-Localization', lang)
      this.$store.dispatch('app/setLocale', lang)
      this.$nuxt.$router.replace(this.switchLocalePath(lang))
    },
  },
}
</script>
