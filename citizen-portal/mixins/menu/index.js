/**
 * Mixin for set Drawer Dynamic
 */

const DrawerMixin = {
  install(Vue) {
    Vue.mixin({
      data: () => ({
        drawerModel: null,
        permissions: {},
      }),
      computed: {
        menuItems: {
          get() {
            return this.$store.getters['app/getMenuDrawer']
          },
          set(val) {
            this.$store.dispatch('app/setMenuDrawer', val)
          },
        },
      },
      mounted() {
        this.setMenu()
      },
      methods: {
        setMenu() {
          if (this.drawerModel) {
            this.drawerModel
              .index()
              .then((response) => {
                this.menuItems = response.data
              })
              .catch((errors) => {
                this.$snackbar({ message: errors.message })
              })
          }
        },
      },
    })
  },
}

export default DrawerMixin
