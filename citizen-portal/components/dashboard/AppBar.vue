<template>
  <v-app-bar
    id="app-bar-dashboard"
    :clipped-left="clip"
    fixed
    app
    height="45"
    color="transparent"
  >
    <v-btn
      icon
      @click="
        $vuetify.breakpoint.smAndDown
          ? setDrawer(!drawer)
          : $emit('input', !value)
      "
    >
      <v-icon v-if="value">mdi-view-quilt</v-icon>
      <v-icon v-else>mdi-dots-vertical</v-icon>
    </v-btn>

    <v-btn class="hidden-sm-and-down" icon @click.stop="setClipped">
      <v-icon>mdi-application</v-icon>
    </v-btn>

    <v-toolbar-title
      :class="{ 'hidden-sm-and-down': $route.path !== localePath('/') }"
      class="font-weight-light"
      v-text="title"
    />

    <v-spacer />

    <div class="mx-3" />

    <v-btn class="ml-2" icon>
      <v-offline-icon />
    </v-btn>

    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          :aria-label="$t('titles.Dashboard')"
          v-bind="attrs"
          :to="localePath({ name: 'home' })"
          exact
          class="ml-2"
          icon
          v-on="on"
        >
          <v-icon>mdi-view-dashboard</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('titles.Dashboard') }}</span>
    </v-tooltip>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
      :close-on-content-click="false"
    >
      <template #activator="{ attrs, on }">
        <v-btn class="ml-2" icon v-bind="attrs" v-on="on">
          <v-badge color="red" overlap bordered :value="unreadNotification > 0">
            <template #badge>
              <div>{{ badge }}</div>
            </template>
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-card
        class="mx-auto"
        max-width="400"
        :min-width="$vuetify.breakpoint.mdAndUp ? '400' : undefined"
      >
        <v-card-title class="white--text primary">
          <i18n path="titles.Notifications" />
          <v-spacer />
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                :aria-label="$t('buttons.MarkAsRead')"
                icon
                small
                dark
                :loading="deleting"
                :disabled="deleting"
                v-bind="attrs"
                v-on="on"
                @click="markAllAsRead"
              >
                <v-icon>mdi-check-all</v-icon>
              </v-btn>
            </template>
            <i18n path="buttons.MarkAsRead" tag="span" />
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                :aria-label="$t('buttons.Refresh')"
                icon
                small
                dark
                :loading="deleting"
                :disabled="deleting"
                v-bind="attrs"
                v-on="on"
                @click="$fetch"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('buttons.Refresh') }}</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text />
        <v-virtual-scroll
          v-if="notifications.length > 0"
          :items="notifications"
          :item-height="100"
          height="300"
        >
          <template #default="{ item }">
            <app-bar-item>
              <v-list-item-icon class="hidden-sm-and-down">
                <v-icon :color="!item.read_at ? 'success' : ''">
                  mdi-bell
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content @click="onReadNotification(item)">
                <v-list-item-title>
                  {{ item.data.title }} -
                  <time-ago :date-time="item.data.created_at" />
                </v-list-item-title>
                <v-list-item-subtitle
                  class="caption"
                  style="white-space: break-spaces"
                  v-text="item.data.subject"
                >
                </v-list-item-subtitle>
                <v-list-item-subtitle class="caption" v-text="item.data.user" />
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      color="error"
                      :loading="deleting"
                      :disabled="deleting"
                      v-bind="attrs"
                      v-on="on"
                      @click="onDelete(item)"
                    >
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Delete') }}</span>
                </v-tooltip>
              </v-list-item-action>
            </app-bar-item>
          </template>
        </v-virtual-scroll>
        <v-card-text v-else>
          <empty-state
            icon="mdi-bell-off"
            :size="200"
            :description="$t('titles.EmptyNotifications')"
          >
          </empty-state>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :aria-label="$t('titles.ViewAllNotifications')"
            block
            text
            small
            :to="localePath({ name: 'notifications' })"
          >
            <i18n path="titles.ViewAllNotifications" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-menu
      bottom
      left
      min-width="200"
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template #activator="{ attrs, on }">
        <v-btn class="ml-2" icon v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list :tile="false" flat nav>
        <app-bar-item :to="localePath(profile)">
          <v-list-item-icon>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="$t('titles.Profile')" />
        </app-bar-item>
        <app-bar-item @click.native="onSetRightDrawer">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="$t('titles.Settings')" />
        </app-bar-item>
        <v-divider class="mb-2 mt-2" />
        <app-bar-item @click.native="onLogout">
          <v-list-item-icon>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="$t('titles.Logout')" />
        </app-bar-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
// Components
import { has } from 'lodash'
import { remove } from 'lodash'
import { VHover, VListItem } from 'vuetify/lib'
import VOfflineIcon from '@/components/base/VOfflineIcon'
import TimeAgo from '@/components/base/TimeAgo'
import { Notification } from '~/models/services/auth/Notification'
export default {
  name: 'AppBar',
  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    'white--text primary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                },
                this.$slots.default
              )
            },
          },
        })
      },
    },
    VOfflineIcon,
    TimeAgo,
    EmptyState: () => import('~/components/base/EmptyState'),
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    clip: false,
    deleting: false,
    form: new Notification(),
    notifications: [],
    profile: {
      name: 'user-profile',
    },
    interval: null,
    help: process.env.VUE_APP_MANUAL,
  }),
  fetch() {
    this.deleting = true
    const params = {
      type: process.env.VUE_APP_NOTIFICATION_TYPE,
    }
    this.form.index({ params }).then((response) => {
      this.deleting = false
      if (has(response, 'data.data')) {
        this.notifications = response.data.data || []
      }
    })
  },
  computed: {
    badge() {
      return this.unreadNotification > 98 ? '99+' : this.unreadNotification
    },
    loggedIn() {
      return this.$store.state.auth.loggedIn
    },
    unreadNotification() {
      return this.notifications.filter((n) => n.read_at === null).length
    },
    title() {
      return this.$t(`titles.${this.$route.meta.title || 'Dashboard'}`)
    },
    drawer() {
      return this.$store.getters['app/getStatusDrawer']
    },
    clipped: {
      get() {
        return this.$store.getters['app/getClipped']
      },
      set(val) {
        this.$store.dispatch('app/toggleClipped', val)
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
    rightDrawer: {
      get() {
        return this.$store.getters['app/getStatusRightDrawer']
      },
      set(val) {
        this.$store.dispatch('app/toggleRightDrawer', val)
      },
    },
  },
  mounted() {
    const that = this
    this.interval = setInterval(that.getNotifications.bind(that), 30000)
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    getNotifications() {
      if (this.loggedIn) {
        this.$fetch()
      }
    },
    setClipped() {
      this.clip = !this.clip
      this.clipped = this.clip
    },
    setDrawer(val) {
      this.$store.dispatch('app/toggleDrawer', val)
    },
    onLogout() {
      this.$auth
        .logout()
        .then(() => {
          this.$snackbar({
            message: 'Se ha cerrado sesión satisfactoriamente',
            color: 'success',
          })
        })
        .finally(() => {
          this.$router.push(this.localePath({ name: 'login' }))
          this.$store.dispatch('app/unsetMenuDrawer')
          this.$store.dispatch('app/unsetBouncer')
          if (this.interval) {
            clearInterval(this.interval)
          }
        })
    },
    onSetRightDrawer() {
      this.$store.dispatch('app/toggleRightDrawer', true)
    },
    onReadNotification(item) {
      this.deleting = true
      this.form
        .show(item.id)
        .then(() => this.$fetch)
        .finally(() => {
          this.deleting = false
          this.$router.push(this.localePath(item.data.url))
        })
    },
    markAllAsRead() {
      this.deleting = true
      this.form
        .store()
        .then(() => {
          this.deleting = false
        })
        .finally(() => this.$fetch)
    },
    onDelete(item) {
      this.deleting = true
      this.form
        .destroy(item.id)
        .then(() => {
          this.notifications = remove(
            this.notifications,
            (object) => object.id !== item.id
          )
          this.deleting = false
        })
        .finally(() => this.$fetch)
    },
  },
}
</script>

<style lang="scss">
#notification {
  .v-list {
    height: 500px; /* or any height you want */
    overflow-y: auto;
  }
}
</style>
