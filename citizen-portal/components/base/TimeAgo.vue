<template>
  <v-tooltip top>
    <template #activator="{ attrs, on }">
      <span v-bind="attrs" :class="classes" v-on="on">
        {{ loading ? $t('buttons.Loading') : timeAgo }}
      </span>
    </template>
    <span>{{ formatTime }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'TimeAgo',
  props: {
    dateTime: {
      type: String,
      default: undefined,
    },
    sufix: {
      type: String,
      default: undefined,
    },
    prefix: {
      type: String,
      default: undefined,
    },
    classes: {
      type: String,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: (vm) => ({
    timeAgo: vm.getTimeAgo(vm.dateTime),
    updater: null,
  }),
  computed: {
    formatTime() {
      return this.$moment(this.dateTime).isValid()
        ? this.$moment(this.dateTime).format('dddd, MMMM D YYYY, h:mm:ss a')
        : this.$moment().format('dddd, MMMM D YYYY, h:mm:ss a')
    },
  },
  watch: {
    '$i18n.locale'() {
      this.convert()
    },
  },
  mounted() {
    this.startUpdater()
  },
  beforeDestroy() {
    this.stopUpdater()
  },
  methods: {
    getTimeAgo(datetime) {
      let dateTime = this.$moment(datetime).isValid()
        ? this.$moment(datetime).locale(this.$i18n.locale).fromNow()
        : this.$moment().locale(this.$i18n.locale).fromNow()
      if (this.prefix) {
        dateTime = `${this.prefix} ${dateTime}`
      }
      if (this.sufix) {
        dateTime = `${dateTime} ${this.sufix}`
      }
      return dateTime
    },
    convert() {
      this.timeAgo = this.getTimeAgo(this.dateTime)
    },
    startUpdater() {
      this.updater = setInterval(() => {
        this.convert()
      }, 1000)
    },
    stopUpdater() {
      if (this.updater) {
        clearInterval(this.updater)
        this.updater = null
      }
    },
  },
}
</script>
