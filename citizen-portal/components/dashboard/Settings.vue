<template>
  <v-card
    id="settings"
    class="text-center mb-0"
    color="transparent"
    flat
    width="300"
  >
    <v-card-text>
      <v-btn v-if="!!pwa" block class="my-2" color="primary" @click="install">
        {{ $t('sidebar.install') }}
        <v-icon right dark>mdi-plus-circle</v-icon>
      </v-btn>
      <v-divider class="my-4 secondary" />
      <strong class="mb-3 d-inline-block">
        {{ $t('sidebar.filters') }}
      </strong>
      <v-item-group v-model="color">
        <v-item v-for="c in colors" :key="c" :value="c">
          <template #default="{ active, toggle }">
            <v-avatar
              :class="active && 'v-settings__item--active'"
              :color="c"
              class="v-settings__item mx-1"
              size="20"
              @click="toggle"
            />
          </template>
        </v-item>
      </v-item-group>
      <v-divider class="my-4 secondary" />
      <strong class="mb-3 d-inline-block">
        {{ $t('sidebar.background') }}
      </strong>
      <v-item-group v-model="scrim">
        <v-item
          v-for="screen in scrims"
          :key="screen"
          :value="screen"
          class="mx-1"
        >
          <template #default="{ active, toggle }">
            <v-avatar
              :class="active && 'v-settings__item--active'"
              :color="screen"
              class="v-settings__item"
              size="24"
              @click="toggle"
            />
          </template>
        </v-item>
      </v-item-group>
      <v-divider class="my-4 secondary" />
      <strong class="mb-3 d-inline-block">
        {{ $t('sidebar.dark') }}
      </strong>
      <DarkLight />
      <v-divider class="my-4 secondary" />
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          {{ $t('sidebar.language') }}
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <language />
        </v-col>
      </v-row>
      <v-divider class="my-4 secondary" />
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          {{ $t('sidebar.image') }}
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-switch
            v-model="showImg"
            class="ma-0 pa-0"
            color="secondary"
            hide-details
          />
        </v-col>
      </v-row>
      <v-divider class="my-4 secondary" />
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          {{ $t('sidebar.rtl') }}
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn icon @click.stop="$vuetify.rtl = !$vuetify.rtl">
            <v-icon>mdi-swap-horizontal</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-4 secondary" />

      <strong class="mb-3 d-inline-block">
        {{ $t('sidebar.images') }}
      </strong>

      <v-item-group v-model="image" class="d-flex justify-space-between mb-3">
        <v-item v-for="img in images" :key="img" :value="img" class="mx-1">
          <template #default="{ active, toggle }">
            <v-sheet
              :class="active && 'v-settings__item--active'"
              class="d-inline-block v-settings__item"
              @click="toggle"
            >
              <v-img :src="img" height="100" width="50" />
            </v-sheet>
          </template>
        </v-item>
      </v-item-group>
    </v-card-text>
  </v-card>
</template>

<script>
// Utilities
import { call, get } from 'vuex-pathify'
// Mixins
import DarkLight from '@/components/base/DarkLight'
import Language from '@/components/base/Language'
import Proxyable from 'vuetify/lib/mixins/proxyable'

export default {
  name: 'DashboardCoreSettings',
  components: {
    DarkLight,
    Language,
  },
  mixins: [Proxyable],
  data: () => ({
    colors: [
      'primary',
      'red',
      'pink',
      'purple',
      'indigo',
      'blue',
      'light-blue',
      'teal',
      'cyan',
      'green',
      'lime',
      'amber',
      'orange',
      'deep-orange',
      'brown',
      'grey',
      'blue-grey',
      'black',
    ],
    image: require('@/static/sidebar/sidebar-1.jpg'),
    images: [
      require('@/static/sidebar/sidebar-1.jpg'),
      require('@/static/sidebar/sidebar-2.jpg'),
      require('@/static/sidebar/sidebar-3.jpg'),
      require('@/static/sidebar/sidebar-4.jpg'),
    ],
    menu: false,
    saveImage: '',
    scrim: 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
    scrims: [
      'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
      'rgba(228, 226, 226, 0.3), rgba(255, 255, 255, 0.8)',
      'rgba(244, 67, 54, .3), rgba(244, 67, 54, .8)',
      'rgba(39, 167, 54, .3), rgba(39, 167, 54, .8)',
      'rgba(33, 147, 176, .2), rgba(109, 213, 237, .6)',
    ],
    showImg: true,
  }),
  computed: {
    pwa: get('app/sw@install'),
    barImage: {
      get() {
        return this.$store.getters['app/gerBarImage']
      },
      set(val) {
        this.$store.dispatch('app/setBarImage', val)
      },
    },
    bgColor: {
      get() {
        return this.$store.getters['app/getBarColor']
      },
      set(val) {
        this.$store.dispatch('app/setBarColor', val)
      },
    },
    drawer: {
      get() {
        return this.$store.getters['app/getStatusDrawer']
      },
      set(val) {
        this.$store.dispatch('app/toggleDrawer', val)
      },
    },
    color: {
      get() {
        return this.$store.getters['app/getActiveColor']
      },
      set(val) {
        const color = val || 'primary'
        this.$store.dispatch('app/setActiveColor', color)
      },
    },
    rtl: {
      get() {
        return this.$store.getters['app/getRTL']
      },
      set(val) {
        this.$store.dispatch('app/toggleRTL', val)
      },
    },
  },
  watch: {
    '$vuetify.theme.dark'(val) {
      this.$store.dispatch('app/toggleDarker', val)
    },
    showImg(val) {
      if (!val) {
        this.saveImage = this.barImage
        this.$store.dispatch('app/setBarImage', '')
      } else if (this.saveImage) {
        this.$store.dispatch('app/setBarImage', this.saveImage)
        this.saveImage = ''
      } else {
        this.$store.dispatch('app/setBarImage', val)
      }
    },
    image(val) {
      this.$store.dispatch('app/setBarImage', val)
    },
    scrim(val) {
      this.$store.dispatch(
        'app/setBarColor',
        val || 'rgba(228, 226, 226, 0.3), rgba(255, 255, 255, 0.8)'
      )
    },
    '$vuetify.rtl'(val) {
      this.rtl = val
    },
  },
  mounted() {
    this.$vuetify.rtl = this.rtl
  },
  methods: {
    install: call('app/install'),
  },
}
</script>

<style lang="sass">
.v-settings
  .v-item-group > *
    cursor: pointer

  &__item
    border-width: 3px
    border-style: solid
    border-color: transparent !important

    &--active
      border-color: #00cae3 !important
</style>
