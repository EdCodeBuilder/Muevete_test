<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col
        v-for="(counter, i) in counters.counters"
        :key="`stats-${i}`"
        class="my-4"
        cols="12"
        sm="12"
        lg="3"
      >
        <v-stats-card
          :color="counter.color"
          :icon="counter.icon"
          :title="counter.name"
          :value="counter.value"
          animated-number
          with-formatter
          :progress="finding"
          sub-icon="mdi-ticket-confirmation"
          :sub-text="counter.value"
        >
          <v-tooltip top>
            <template #activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                class="mx-1"
                color="primary"
                light
                icon
                x-small
                @click="getCounters"
                v-on="on"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('buttons.Refresh') }}</span>
          </v-tooltip>
        </v-stats-card>
      </v-col>
      <v-col class="my-4" cols="12">
        <v-material-card icon="mdi-domain">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                <i18n path="titles.Stages" />
              </v-toolbar-title>
              <v-spacer />
              <v-time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="requested_at"
              />
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
                  <v-list-item @click="getCounters">
                    <v-list-item-icon>
                      <v-icon>mdi-refresh</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Refresh') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-list dense>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon v-text="'mdi-domain'" />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t('titles.UsersByStage') }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <v-data-table
                  dense
                  :loading="finding"
                  :options.sync="pagination"
                  :headers="headers"
                  :items="counters.activities.data"
                  :server-items-length="counters.activities.total"
                  :footer-props="{
                    'items-per-page-options': itemsPerPageArray,
                  }"
                  hide-default-header
                >
                  <template #[`item.icon`]>
                    <v-icon>mdi-domain</v-icon>
                  </template>
                </v-data-table>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <v-card
                  color="transparent elevation-0"
                  class="v-card--plan mx-auto px-2 text-center"
                  max-width="100%"
                >
                  <i18n
                    path="Total"
                    tag="div"
                    class="body-2 text-uppercase grey--text"
                  />
                  <v-avatar size="130">
                    <v-icon color="success" size="64" v-text="'mdi-account'" />
                  </v-avatar>
                  <h2 class="display-serif-3 font-weight-bold">
                    {{ counters.total }}
                  </h2>
                  <v-card-text v-if="canViewUsers">
                    <v-btn
                      color="success"
                      :to="localePath({ name: 'user-validation' })"
                      v-text="$t('titles.UserValidation')"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Dashboard } from '~/models/services/citizen/Dashboard'

export default {
  name: 'Dashboard',
  nuxtI18n: {
    paths: {
      en: '/dashboard',
      es: '/dashboard',
    },
  },
  auth: 'auth',
  middleware: ['permissions'],
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
  },
  created() {
    this.drawerModel = new Menu()
  },
  components: {
    VMaterialCard: () => import('~/components/base/MaterialCard'),
    VStatsCard: () => import('@/components/base/MaterialStatsCard'),
    VTimeAgo: () => import('~/components/base/TimeAgo'),
  },
  data: () => ({
    form: new Dashboard(),
    finding: false,
    headers: [
      { value: 'icon', text: '' },
      { value: 'name', text: '' },
      { value: 'users_count', text: '' },
    ],
    counters: {
      activities: [],
      counters: [],
      total: 0,
    },
    itemsPerPageArray: [10],
    pagination: {},
    requested_at: null,
  }),
  head: () => ({
    title: 'Dashboard',
  }),
  fetch() {
    this.getCounters()
  },
  watch: {
    'pagination.page'() {
      return this.form && this.getCounters()
    },
  },
  methods: {
    getCounters() {
      this.finding = true
      const params = {
        per_page: this.itemsPerPage,
        page: this.pagination.page,
      }
      this.form
        .index({ params })
        .then((response) => {
          this.counters = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
    // Loading
    start() {
      this.finding = true
    },
    stop() {
      this.finding = false
    },
  },
  computed: {
    canViewUsers() {
      const abilitiesProfile = this.ability_service.canAnyAction(
        [
          'assignValidator',
          'assignStatus',
          'manage',
          'view',
          'create',
          'update',
          'destroy',
        ],
        this.ability_service.models.PROFILE
      )
      return this.bouncer.canAny(abilitiesProfile)
    },
  },
}
</script>
