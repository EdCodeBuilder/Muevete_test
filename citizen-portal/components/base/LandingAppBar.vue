<template>
  <v-app-bar
    v-scroll="onScroll"
    :dark="dark"
    elevate-on-scroll
    fixed
    :color="color"
  >
    <v-container class="px-0 text-right d-flex align-center">
      <v-btn
        v-if="backButton"
        :aria-label="$t('buttons.Back')"
        class="hidden-md-and-up"
        icon
        @click="$router.back()"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title
        class="font-weight-light hidden-xs-only"
        v-text="title"
      />
      <v-spacer />
      <v-btn
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        min-height="48"
        min-width="40"
        :aria-label="item.text"
        exact
        text
      >
        <v-icon
          :left="$vuetify.breakpoint.mdAndUp"
          size="20"
          v-text="item.icon"
        />

        <span class="hidden-sm-and-down" v-text="item.text" />
      </v-btn>
      <Language />
      <v-menu left>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip left>
            <template #activator="{ on: tooltip }">
              <v-btn
                :aria-label="$t('sidebar.dark')"
                icon
                v-bind="attrs"
                v-on="{ ...menu, ...tooltip }"
              >
                <v-icon>mdi-theme-light-dark</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('sidebar.dark') }}</span>
          </v-tooltip>
        </template>
        <v-card flat>
          <DarkLight />
        </v-card>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'LandingCoreAppBar',
  components: {
    Language: () => import('~/components/base/Language'),
    DarkLight: () => import('~/components/base/DarkLight'),
  },
  data: (vm) => ({
    dark: true,
    color: 'transparent',
    items: [
      {
        icon: 'mdi-file',
        text: vm.$t('titles.Passport'),
        to: vm.localePath({ name: 'index' }),
      },
      {
        icon: 'mdi-fingerprint',
        text: vm.$t('titles.Login'),
        to: vm.localePath({ name: 'login' }),
      },
    ],
  }),
  computed: {
    backButton() {
      return !this.$route.name.includes('index')
    },
    title() {
      return this.$t('titles.Main')
    },
    darkTheme() {
      return this.$store.getters['app/getIsDark']
    },
  },
  methods: {
    onScroll() {
      const color = this.darkTheme ? '' : 'white'
      this.color = window.scrollY > 100 ? color : 'transparent'
      this.dark = !(window.scrollY > 100)
    },
  },
}
</script>
