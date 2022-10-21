<template>
  <v-snack-bar-queue
    :items="snackBar"
    @remove="removeItem"
    @close="removeItem"
  />
</template>

<script>
export default {
  name: 'SnackBar',
  components: {
    VSnackBarQueue: () => import('./SnackBarQueue'),
  },
  data: () => ({
    items: [
      {
        color: 'error',
        title: '¡Error!',
        message:
          'Algo salió mal, estamos trabajando para resolver el inconveniente.',
        icon: 'mdi-bell-plus',
        position: 'bottom',
        timeout: 5000,
      },
      {
        color: 'success',
        title: '¡Error!',
        message: 'Mensaje 2',
        icon: 'mdi-bell-plus',
        position: 'bottom',
        timeout: 5000,
      },
      {
        color: 'warning',
        title: '¡Error!',
        message: 'Mensaje 3',
        icon: 'mdi-bell-plus',
        position: 'bottom',
        timeout: 5000,
      },
    ],
  }),
  computed: {
    snackBar: {
      get() {
        return this.$store.getters['app/getSnackBar']
      },
      set(value) {
        this.$store.dispatch('app/setSnackBar', value)
      },
    },
  },
  created() {
    /*
    this.items.map((i) => {
      return (this.snackBar = i)
    })
     */
  },
  methods: {
    removeItem(id) {
      if (id) {
        this.$store.dispatch('app/removeFromSnackBar', id)
      }
    },
  },
}
</script>
