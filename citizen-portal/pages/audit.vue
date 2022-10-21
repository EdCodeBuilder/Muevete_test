<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <base-material-card class="mt-12" icon="mdi-magnify">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                <i18n path="titles.Audit" />
              </v-toolbar-title>
              <v-spacer />
              <time-ago
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
                  <v-list-item @click="getData">
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
            <v-skeleton-loader
              ref="skeleton"
              :loading="finding"
              transition="scale-transition"
              type="table"
              class="mx-auto"
            >
              <v-data-table
                :options.sync="pagination"
                :items-per-page.sync="itemsPerPage"
                :server-items-length="total"
                :headers="headers"
                :items="items"
                item-key="id"
                show-expand
                :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
              >
                <template #[`item.event`]="{ item }">
                  <v-chip
                    :color="item.color"
                    class="overline mb-3"
                    style="white-space: break-spaces"
                    small
                    v-text="item.event"
                  />
                </template>
                <template #[`item.tags`]="{ item }">
                  <v-chip
                    color="primary"
                    class="overline mb-3"
                    style="white-space: break-spaces"
                    small
                    v-text="item.tags"
                  />
                </template>
                <template #expanded-item="{ headers: data, item }">
                  <td :colspan="data.length" width="100%">
                    <v-row
                      v-for="(expanded_item, key) in expanded"
                      :key="`expanded-${key}`"
                    >
                      <v-col
                        v-if="expanded_item.value === 'new_values'"
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <div class="font-weight-bold">
                          {{ expanded_item.text }}
                        </div>
                      </v-col>
                      <v-col
                        v-else-if="expanded_item.value === 'old_values'"
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <div class="font-weight-bold">
                          {{ expanded_item.text }}
                        </div>
                      </v-col>
                      <v-col v-else cols="12" sm="12" md="6">
                        <div class="font-weight-bold">
                          {{ expanded_item.text }}
                        </div>
                      </v-col>
                      <v-col
                        v-if="expanded_item.value === 'new_values'"
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-json-pretty :data="item[expanded_item.value]" />
                      </v-col>
                      <v-col
                        v-else-if="expanded_item.value === 'old_values'"
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-json-pretty :data="item[expanded_item.value]" />
                      </v-col>
                      <v-col v-else cols="12" sm="12" md="6">
                        <template v-if="expanded_item.value === 'user_agent'">
                          <v-user-agent
                            :user-agent="item[expanded_item.value]"
                          />
                        </template>
                        <template v-else>
                          {{ item[expanded_item.value] }}
                        </template>
                      </v-col>
                    </v-row>
                  </td>
                </template>
              </v-data-table>
            </v-skeleton-loader>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<router lang="yaml">
meta:
  title: Audit
</router>

<script>
import { Api } from '~/models/Api'
import { Audit } from '~/models/services/citizen/Audit'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'Audit',
  nuxtI18n: {
    paths: {
      en: '/audit',
      es: '/auditoria',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.Audit'),
  }),
  components: {
    BaseMaterialCard: () => import('~/components/base/MaterialCard'),
    TimeAgo: () => import('~/components/base/TimeAgo'),
    VUserAgent: () => import('~/components/base/VUserAgent'),
  },
  auth: 'auth',
  middleware: ['permissions'],
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    permissions(bouncer, to, from) {
      const service = new AbilityService()
      const abilities = service.view(service.models.AUDITS)
      return bouncer.can(abilities)
    },
  },
  data: () => ({
    finding: false,
    requested_at: null,
    form: new Audit(),
    items: [],
    headers: [],
    expanded: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  }),
  watch: {
    'pagination.page'() {
      return this.getData()
    },
    itemsPerPage() {
      return this.getData()
    },
  },
  methods: {
    // Audit
    getData() {
      this.start()
      const params = {
        per_page: this.itemsPerPage,
        page: this.pagination.page,
      }
      this.form
        .index({ params })
        .then((response) => {
          this.items = response.data
          this.headers = response.details.headers
          this.total = response.meta.total
          this.expanded = response.details.expanded
          this.requested_at = response.requested_at
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    // Loader
    start() {
      this.finding = true
    },
    stop() {
      this.finding = false
    },
  },
}
</script>
