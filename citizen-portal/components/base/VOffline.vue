<template>
  <offline :slot-name="slotName" @detected-condition="isOnline">
    <template #[onlineSlot]>
      <v-banner
        v-model="message"
        :single-line="$vuetify.breakpoint.mdAndUp"
        :two-line="$vuetify.breakpoint.smAndDown"
        transition="slide-y-transition"
      >
        <v-icon slot="icon" color="success" size="36">
          mdi-wifi-strength-3
        </v-icon>
        {{ $t('errors.online') }}
        <template #actions>
          <v-btn color="primary" text @click="message = false">OK</v-btn>
        </template>
      </v-banner>
    </template>
    <template #[offlineSlot]>
      <v-banner
        v-model="message"
        :single-line="$vuetify.breakpoint.mdAndUp"
        :two-line="$vuetify.breakpoint.smAndDown"
        transition="slide-y-transition"
      >
        <v-icon slot="icon" color="warning" size="36">
          mdi-wifi-strength-3-alert
        </v-icon>
        {{ $t('errors.offline') }}
        <template #actions>
          <v-btn color="primary" text @click="message = false">OK</v-btn>
        </template>
      </v-banner>
    </template>
  </offline>
</template>

<script>
import Offline from '@/components/base/Offline'
export default {
  name: 'VOffline',
  components: {
    Offline,
  },
  data: () => ({
    timer: null,
    onLine: true,
    onlineSlot: 'online',
    offlineSlot: 'offline',
    message: false,
  }),
  computed: {
    slotName() {
      return this.onLine ? this.onlineSlot : this.offlineSlot
    },
  },
  watch: {
    message(val) {
      if (val) {
        const that = this
        this.timer = setTimeout(function () {
          that.message = false
        }, 8000)
      }
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    isOnline(e) {
      this.onLine = e
      this.message = true
    },
  },
}
</script>
