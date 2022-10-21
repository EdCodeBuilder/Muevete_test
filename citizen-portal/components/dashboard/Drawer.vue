<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="drawerDark"
    :expand-on-hover="expandOnHover"
    :mini-variant="miniVariant"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    :clipped="clipped"
    fixed
    app
    mini-variant-width="75"
    width="260"
  >
    <template #img="props">
      <v-img :gradient="`to bottom, ${bgColor}`" v-bind="props" />
    </template>
    <v-list>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title
            class="text-uppercase font-weight-regular display-2"
          >
            <div :class="$vuetify.rtl ? 'ml-3' : 'mr-3'" class="logo-mini">
              {{ miniText }}
            </div>
            <div class="logo-normal">{{ completeText }}</div>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider class="mb-1" />
    <v-list nav expand dense>
      <base-item-group :item="profile" />
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav dense>
      <div />
      <template v-for="(item, i) in menu">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        />
        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Item from '@/components/base/Item'
import ItemGroup from '@/components/base/ItemGroup'
export default {
  name: 'Drawer',
  components: {
    BaseItem: Item,
    BaseItemGroup: ItemGroup,
  },
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: [Array],
      default: () => [],
    },
  },
  computed: {
    drawerDark() {
      return ![
        'rgba(228, 226, 226, 0.3), rgba(255, 255, 255, 0.8)',
        'rgba(33, 147, 176, .2), rgba(109, 213, 237, .6)',
      ].includes(this.bgColor)
    },
    activeColor: {
      get() {
        return this.$store.getters['app/getActiveColor']
      },
      set(val) {
        this.$store.dispatch('app/setActiveColor', val)
      },
    },
    bgColor: {
      get() {
        return this.$store.getters['app/getBarColor']
      },
      set(val) {
        this.$store.dispatch('app/serBarColor', val)
      },
    },
    barImage: {
      get() {
        return this.$store.getters['app/gerBarImage']
      },
      set(val) {
        this.$store.dispatch('app/setBarImage', val)
      },
    },
    clipped: {
      get() {
        return this.$store.getters['app/getClipped']
      },
      set(val) {
        return this.$store.dispatch('app/toggleClipped', val)
      },
    },
    miniVariant: {
      get() {
        return this.$store.getters['app/getMiniVariant']
      },
      set(val) {
        this.$store.dispatch('app/toggleMiniVariant', val)
      },
    },
    drawer: {
      get() {
        return this.$store.getters['app/getStatusDrawer']
      },
      set(val) {
        this.$store.dispatch('app/toggleDrawer', val)
      },
    },
    computedItems() {
      return this.items.map(this.mapItem)
    },
    username() {
      return this.$store.state.auth.user
        ? this.$store.state.auth.user.username
        : 'SIM'
    },
    profile() {
      return {
        avatar: this.username,
        group: 'SIM',
        title: this.username,
        children: [
          {
            to: { name: 'user-profile' },
            title: this.$t('titles.Profile'),
            exact: true,
          },
          {
            title: this.$t('titles.Settings'),
            href: undefined,
            callback: this.onSetRightDrawer,
          },
          {
            title: this.$t('titles.Logout'),
            href: undefined,
            callback: this.onLogout,
          },
        ],
      }
    },
    miniText() {
      return process.env.VUE_APP_DRAWER_MINI
    },
    completeText() {
      return process.env.VUE_APP_DRAWER
    },
  },
  watch: {
    '$vuetify.breakpoint.smAndDown'(val) {
      this.$emit('update:expandOnHover', !val)
    },
  },
  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      }
    },
    onSetRightDrawer() {
      this.$store.dispatch('app/toggleRightDrawer', true)
    },
    onLogout() {
      this.$auth
        .logout()
        .catch((errors) => {
          this.$snackbar({
            message: errors.response ? errors.response.data.message : errors,
          })
        })
        .finally(() => {
          this.$router.push(this.localePath({ name: 'login' }))
          this.$store.dispatch('app/unsetMenuDrawer')
          this.$store.dispatch('app/unsetBouncer')
        })
    },
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

    .v-list-group--sub-group
      display: block !important

  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 10px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
