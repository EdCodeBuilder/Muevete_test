<template>
  <v-app>
    <dashboard-drawer :expand-on-hover.sync="expandOnHover" :menu="items" />
    <dashboard-app-bar v-model="expandOnHover" />
    <v-main>
      <v-container>
        <v-offline />
        <v-banner
          v-if="isDev"
          elevation="2"
          outlined
          transition="slide-y-transition"
        >
          <v-icon slot="icon" color="primary" size="36">mdi-dev-to</v-icon>
          <i18n path="dev" />
        </v-banner>
        <nuxt />
      </v-container>
      <snack />
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="!$vuetify.rtl"
      temporary
      fixed
      width="300"
    >
      <dashboard-settings />
    </v-navigation-drawer>
    <dashboard-footer />
    <update-notification />
  </v-app>
</template>

<script>
// Utilities
import { call } from 'vuex-pathify'
import AppBar from '@/components/dashboard/AppBar'
import Drawer from '@/components/dashboard/Drawer'
import SnackBar from '@/components/base/SnackBar'
import VOffline from '@/components/base/VOffline'
import DashboardFooter from '@/components/dashboard/DashboardFooter'
import Settings from '@/components/dashboard/Settings'
import Vue from 'vue'
import GlobalMixin from '@/mixins'
import { Menu } from '~/models/services/citizen/Menu'
Vue.use(GlobalMixin)
export default {
  name: 'DashboardLayout',
  components: {
    DashboardAppBar: AppBar,
    DashboardDrawer: Drawer,
    DashboardFooter,
    DashboardSettings: Settings,
    Snack: SnackBar,
    VOffline,
    UpdateNotification: () => import('@/components/base/UpdateAvailable'),
  },
  data() {
    return {
      expandOnHover: false,
      title: 'S.I.M. 2.0',
      model: new Menu(),
    }
  },
  fetch() {
    this.getMenu()
  },
  mounted() {
    this.init()
  },
  computed: {
    isDev() {
      const test = process.env.VUE_APP_API_URL_BASE || ''
      return test.includes('api-dev') || test.includes('test')
    },
    rightDrawer: {
      get() {
        return this.$store.getters['app/getStatusRightDrawer']
      },
      set(val) {
        this.$store.dispatch('app/toggleRightDrawer', val)
      },
    },
    items: {
      get() {
        return this.$store.getters['app/getMenuDrawer']
      },
      set(val) {
        this.$store.dispatch('app/setMenuDrawer', val)
      },
    },
  },
  methods: {
    init: call('app/init'),
    getMenu() {
      this.model
        .index()
        .then((response) => {
          this.items = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
    },
  },
}
</script>
