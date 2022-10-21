<template>
  <v-app>
    <dashboard-app-bar />
    <v-main>
      <v-container>
        <v-offline />
        <nuxt />
      </v-container>
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
    <snack />
    <update-notification />
  </v-app>
</template>

<script>
import AppBar from '@/components/dashboard/AppBar'
import SnackBar from '@/components/base/SnackBar'
import DashboardFooter from '@/components/dashboard/DashboardFooter'
import Settings from '@/components/dashboard/Settings'
import VOffline from '~/components/base/VOffline'
export default {
  name: 'DashboardLayout',
  components: {
    DashboardAppBar: AppBar,
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
    }
  },
  computed: {
    rightDrawer: {
      get() {
        return this.$store.getters['app/getStatusRightDrawer']
      },
      set(val) {
        this.$store.dispatch('app/toggleRightDrawer', val)
      },
    },
  },
}
</script>
