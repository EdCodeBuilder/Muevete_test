<template>
  <v-dialog v-model="model" v-bind="$attrs" @click:outside="close">
    <v-card>
      <v-toolbar dark :color="color">
        <v-toolbar-title v-text="header" />
        <v-spacer />
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'VCheckDialog',
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    useTrans: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'buttons.Delete',
    },
  },
  data: () => ({
    model: false,
    resolve: null,
    reject: null,
  }),
  computed: {
    header() {
      return this.useTrans ? this.$t(this.title) : this.title
    },
  },
  methods: {
    open() {
      this.model = true
      return Promise.resolve()
    },
    close() {
      this.model = false
      this.$emit('click:close')
    },
  },
}
</script>
