<template>
  <div>
    <v-snackbar
      v-for="(item, i) in items"
      :key="i"
      :value="i === 0"
      :color="item.color"
      :bottom="bottom"
      :top="top"
      :left="left"
      :right="right"
      :timeout="item.timeout || 5000"
      dark
    >
      <v-icon v-if="item.icon" color="white" class="mr-3">
        {{ item.icon }}
      </v-icon>

      {{ item.message }}

      <template #action>
        <v-icon size="16" @click="onClose(item.id)">mdi-close-circle</v-icon>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'SnackBarQueue',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    top: false,
    bottom: true,
    left: false,
    right: false,
    timeoutId: false,
    processing: false,
  }),
  computed: {
    showSnack: {
      get() {
        return this.$store.getters['app/getSnackBarStatus']
      },
      set(value) {
        this.$store.dispatch('app/toggleSnackBar', value)
      },
    },
  },
  watch: {
    items() {
      this.processItems()
    },
  },
  methods: {
    onSnackSetPosition() {
      const vm = this
      vm.top = false
      vm.bottom = false
      vm.left = false
      vm.right = false
      if (vm.items && Array.isArray(vm.items) && vm.items.length > 0) {
        vm[vm.items[0].position] = true
      } else {
        vm.bottom = true
      }
    },
    onClose(id) {
      this.showSnack = false
      this.$emit('close', id)
      this.removeItem(id)
    },
    processItems() {
      const vm = this
      vm.processing = true
      if (vm.items && Array.isArray(vm.items) && vm.items.length > 0) {
        vm.showSnack = true
        const item = vm.items[0]
        vm.onSnackSetPosition()
        // this.items = item
        vm.timeoutId = setTimeout(() => {
          vm.removeItem(item.id)
        }, item.timeout || 5000)
      }
      vm.processing = false
    },
    removeItem(id) {
      const vm = this
      clearTimeout(vm.timeoutId)
      /**
       * Emit remove event
       * @event remove
       * @type {number}
       */
      this.$emit('remove', id)
      vm.showSnack = false
      if (vm.items.length > 0) {
        return vm.processItems()
      }
    },
  },
}
</script>
