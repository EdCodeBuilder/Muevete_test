<template>
  <v-item-group v-model="themeType" class="mx-auto row row--dense" mandatory>
    <v-col
      v-for="{ icon, text, value } in items"
      :key="value"
      cols="12"
      md="6"
      sm="12"
    >
      <v-item :value="value">
        <template #default="{ active, toggle }">
          <v-card
            :color="active ? 'primary' : ``"
            :dark="!$vuetify.theme.dark && active"
            class="v-card--group py-3 px-4 text-center position-relative cursor-pointer d-flex align-center justify-space-between"
            rounded
            flat
            @click="toggle"
          >
            <i18n :path="text" />
            <v-icon v-text="icon" />
          </v-card>
        </template>
      </v-item>
    </v-col>
  </v-item-group>
</template>

<script>
export default {
  name: 'DarkLight',
  data: () => ({
    items: [
      {
        text: 'Claro',
        icon: 'mdi-white-balance-sunny',
        value: 'light',
      },
      {
        text: 'Oscuro',
        icon: 'mdi-weather-night',
        value: 'dark',
      },
      {
        text: 'Auto',
        icon: 'mdi-theme-light-dark',
        value: 'auto',
      },
      {
        text: 'Sistema',
        icon: 'mdi-laptop',
        value: 'system',
      },
    ],
    timer: null,
  }),
  computed: {
    darkTheme() {
      return this.$store.getters['app/getIsDark']
    },
    themeType: {
      get() {
        return this.$store.getters['app/getThemeType']
      },
      set(val) {
        this.$store.dispatch('app/setTheme', val)
      },
    },
  },
  watch: {
    themeType(val) {
      this.onDark(val)
    },
  },
  mounted() {
    this.$vuetify.theme.dark = this.darkTheme
    this.onDark(this.themeType)
  },
  beforeDestroy() {
    this.clearTimeOut()
  },
  methods: {
    onDark(val) {
      switch (val) {
        case 'light':
          this.clearTimeOut()
          this.$nextTick(function () {
            this.setStore(false)
          })
          break
        case 'system':
          this.clearTimeOut()
          this.$nextTick(function () {
            const result = window.matchMedia('(prefers-color-scheme: dark)')
              .matches
            this.setStore(!!result)
          })
          break
        case 'dark':
          this.clearTimeOut()
          this.$nextTick(function () {
            this.setStore(true)
          })
          break
        case 'auto':
          this.autoTheme()
          break
      }
    },
    autoTheme() {
      const startAt = this.normalizeTime('06:00')
      const endAt = this.normalizeTime('18:00')
      const now = new Date().getTime()
      const result =
        (endAt < now && now > startAt) || (startAt > now && now < endAt)
      if (this.themeType === 'auto') {
        this.setStore(result)
        this.clearTimeOut()
        this.timer = setTimeout(this.autoTheme, 1000 * 60)
      } else {
        this.clearTimeOut()
      }
    },
    normalizeTime(time) {
      const date = new Date()
      const normalized = time.split(':')
      return date.setHours(normalized[0], normalized[1], 0, 0)
    },
    clearTimeOut() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    setStore(value) {
      this.$store.dispatch('app/toggleDarker', value).then(() => {
        this.$vuetify.theme.dark = this.darkTheme
      })
    },
  },
}
</script>
