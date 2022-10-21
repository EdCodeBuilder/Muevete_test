<template>
  <offline @detected-condition="isOnline">
    <template #online>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-if="onLine" v-bind="attrs" color="success" v-on="on">
            mdi-wifi
          </v-icon>
          <v-icon v-else v-bind="attrs" color="error" v-on="on">
            mdi-wifi-off
          </v-icon>
        </template>
        <span>{{ $t(`errors.${onLine ? 'online' : 'offline'}`) }}</span>
      </v-tooltip>
    </template>
  </offline>
</template>

<script>
import Offline from '@/components/base/Offline'
export default {
  name: 'VOfflineIcon',
  components: {
    Offline,
  },
  data: () => ({
    onLine: true,
  }),
  methods: {
    isOnline(e) {
      this.onLine = e
    },
  },
}
</script>
