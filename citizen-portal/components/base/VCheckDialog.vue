<template>
  <v-dialog
    v-model="model"
    v-bind="$attrs"
    :max-width="width"
    @click:outside="onCancel"
  >
    <v-card>
      <v-toolbar dark :color="toolbarColor">
        <v-toolbar-title v-text="header" />
        <v-spacer />
        <slot name="toolbar-buttons" />
        <v-btn :aria-label="$t('buttons.Close')" icon dark @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-3">
        <slot />
      </v-card-text>
      <v-card-actions v-if="showBtn">
        <v-spacer />
        <v-btn :aria-label="cancelBtn" text color="error" @click="onCancel">
          {{ cancelBtn }}
        </v-btn>
        <v-btn :aria-label="okBtn" text color="success" @click="onOk">
          {{ okBtn }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'VCheckDialog',
  props: {
    toolbarColor: {
      type: String,
      default: 'error',
    },
    width: {
      type: [Number, String],
      default: '300',
    },
    useTrans: {
      type: Boolean,
      default: true,
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'buttons.Delete',
    },
    okBtnText: {
      type: String,
      default: 'buttons.Accept',
    },
    cancelBtnText: {
      type: String,
      default: 'buttons.Cancel',
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
    okBtn() {
      return this.okBtnText.includes('.')
        ? this.$t(this.okBtnText)
        : this.okBtnText
    },
    cancelBtn() {
      return this.cancelBtnText.includes('.')
        ? this.$t(this.cancelBtnText)
        : this.cancelBtnText
    },
  },
  methods: {
    open() {
      this.model = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close() {
      this.model = false
      return this.reject && this.reject(false)
    },
    onClose() {
      this.model = false
      return this.reject && this.reject(false)
    },
    onCancel() {
      this.model = false
      return this.reject && this.reject(false)
    },
    onOk() {
      this.model = false
      return this.resolve && this.resolve(true)
    },
  },
}
</script>
