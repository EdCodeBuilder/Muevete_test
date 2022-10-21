<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <base-material-card class="mt-6" icon="mdi-bell">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                <i18n path="titles.Notifications" />
              </v-toolbar-title>
              <v-spacer />
              <v-menu offset-y left>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip left>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        :aria-label="$t('buttons.MoreOptions')"
                        icon
                        v-bind="attrs"
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.MoreOptions') }}</span>
                  </v-tooltip>
                </template>
                <v-list dense>
                  <v-list-item @click="$fetch">
                    <v-list-item-icon>
                      <v-icon>mdi-refresh</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Refresh') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="markAllAsRead">
                    <v-list-item-icon>
                      <v-icon>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      <i18n path="buttons.MarkAsRead" />
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <v-card-text>
            <v-data-iterator
              :loading="loading"
              :items="items"
              :options.sync="pagination"
              :items-per-page.sync="itemsPerPage"
              :server-items-length="total"
              item-key="name"
            >
              <template v-slot:default="{ items }">
                <v-list>
                  <v-list-item v-for="item in items" :key="item.id">
                    <v-list-item-icon>
                      <v-icon :color="item.read_at ? '' : 'success'">
                        mdi-bell
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content @click="onClickNotification(item)">
                      <v-list-item-title v-text="item.data.title" />
                      <v-list-item-subtitle
                        class="caption"
                        v-text="item.data.subject"
                      />
                      <v-list-item-subtitle
                        class="caption"
                        v-text="item.data.user"
                      />
                      <v-list-item-subtitle
                        class="caption"
                        v-text="item.data.created_at"
                      />
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            :aria-label="$t('buttons.MarkAsRead')"
                            icon
                            small
                            color="success"
                            v-bind="attrs"
                            v-on="on"
                            @click="markAsRead(item)"
                          >
                            <v-icon small>mdi-check-all</v-icon>
                          </v-btn>
                        </template>
                        <i18n path="buttons.MarkAsRead" tag="span" />
                      </v-tooltip>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            :aria-label="$t('buttons.Delete')"
                            icon
                            small
                            color="error"
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
                  </v-list-item>
                </v-list>
              </template>
              <template #no-data>
                <empty-state
                  v-if="items.length === 0"
                  icon="mdi-bell-off"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :description="$t('titles.EmptyNotifications')"
                >
                  <v-btn
                    :aria-label="$t('buttons.Refresh')"
                    color="primary"
                    @click="$fetch"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    <i18n path="buttons.Refresh" />
                  </v-btn>
                </empty-state>
              </template>
              <template #no-results>
                <empty-state
                  v-if="items.length === 0"
                  icon="mdi-bell-off"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :description="$t('titles.EmptyNotifications')"
                >
                  <v-btn
                    :aria-label="$t('buttons.Refresh')"
                    color="primary"
                    @click="$fetch"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    <i18n path="buttons.Refresh" />
                  </v-btn>
                </empty-state>
              </template>
            </v-data-iterator>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<router lang="yaml">
meta:
  title: Notifications
</router>

<script>
import { has } from 'lodash'
import { Notification } from '~/models/services/auth/Notification'

export default {
  name: 'Notifications',
  auth: 'auth',
  nuxtI18n: {
    paths: {
      en: '/notifications',
      es: '/notificaciones',
    },
  },
  components: {
    BaseMaterialCard: () => import('~/components/base/MaterialCard'),
    EmptyState: () => import('~/components/base/EmptyState'),
  },
  data: () => ({
    loading: false,
    form: new Notification(),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  }),
  watch: {
    'pagination.page'() {
      return this.$fetch()
    },
    itemsPerPage() {
      return this.$fetch()
    },
  },
  fetch() {
    this.loading = true
    const params = {
      page: this.pagination.page,
      per_page: this.itemsPerPage,
      type: process.env.VUE_APP_NOTIFICATION_TYPE,
    }
    this.form.index({ params }).then((response) => {
      if (has(response, 'data.data')) {
        this.items = response.data.data
        this.total = response.data.total
      }
      this.loading = false
    })
  },
  methods: {
    onClickNotification(item) {
      this.form
        .show(item.id)
        .then(() => this.$fetch)
        .finally(() => {
          this.$router.push(this.localePath(item.data.url))
        })
    },
    markAllAsRead() {
      this.form.store().finally(() => this.$fetch)
    },
    markAsRead(item) {
      this.form.show(item.id).finally(() => this.$fetch)
    },
    onDelete(item) {
      this.form.destroy(item.id).finally(() => this.$fetch)
    },
  },
}
</script>
