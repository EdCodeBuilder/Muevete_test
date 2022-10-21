<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col class="my-4" cols="12" sm="12" lg="4">
        <v-stats-card
          color="primary"
          icon="mdi-ticket"
          :title="$t('form.quota')"
          :value="schedule.quota"
          animated-number
          with-formatter
          :progress="loading"
          sub-icon="mdi-ticket-confirmation"
          :sub-text="schedule.quota"
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
                @click="getData"
                v-on="on"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('buttons.Refresh') }}</span>
          </v-tooltip>
        </v-stats-card>
      </v-col>
      <v-col class="my-4" cols="12" sm="12" lg="4">
        <v-stats-card
          color="success"
          icon="mdi-ticket"
          :title="$t('form.taken')"
          :value="schedule.users_schedules_count"
          animated-number
          with-formatter
          :progress="loading"
          sub-icon="mdi-ticket-confirmation"
          :sub-text="schedule.users_schedules_count"
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
                @click="getData"
                v-on="on"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('buttons.Refresh') }}</span>
          </v-tooltip>
        </v-stats-card>
      </v-col>
      <v-col class="my-4" cols="12" sm="12" lg="4">
        <v-stats-card
          color="danger"
          icon="mdi-ticket"
          :title="$t('form.quota_less')"
          :value="schedule.left"
          animated-number
          with-formatter
          :progress="loading"
          sub-icon="mdi-ticket-confirmation"
          :sub-text="schedule.left"
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
                @click="getData"
                v-on="on"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('buttons.Refresh') }}</span>
          </v-tooltip>
        </v-stats-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.program_name" />
                      <v-list-item-subtitle v-text="$t('form.program')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.activity_name" />
                      <v-list-item-subtitle v-text="$t('form.activity')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.stage_name" />
                      <v-list-item-subtitle v-text="$t('form.stage')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.park_code" />
                      <v-list-item-subtitle v-text="$t('form.park_code')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.park_name" />
                      <v-list-item-subtitle v-text="$t('form.park')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.park_address" />
                      <v-list-item-subtitle v-text="$t('form.address')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.weekday_name" />
                      <v-list-item-subtitle v-text="$t('form.weekday')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.daily_name" />
                      <v-list-item-subtitle v-text="$t('form.daily')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.start_date" />
                      <v-list-item-subtitle v-text="$t('form.start_date')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.final_date" />
                      <v-list-item-subtitle v-text="$t('form.final_date')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.min_age" />
                      <v-list-item-subtitle v-text="$t('form.min_age')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.max_age" />
                      <v-list-item-subtitle v-text="$t('form.max_age')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="schedule.is_paid ? $t('Yes') : $t('No')"
                      />
                      <v-list-item-subtitle v-text="$t('form.is_paid')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="schedule.is_initiate ? $t('Yes') : $t('No')"
                      />
                      <v-list-item-subtitle v-text="$t('form.is_initiate')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="schedule.is_activated ? $t('Yes') : $t('No')"
                      />
                      <v-list-item-subtitle v-text="$t('form.is_activated')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="schedule.created_at" />
                      <v-list-item-subtitle v-text="$t('form.created_at')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                <i18n path="titles.Users" />
              </v-toolbar-title>
              <v-spacer />
              <v-time-ago
                :loading="loading"
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
                  <v-list-item @click="onFilter">
                    <v-list-item-icon>
                      <v-badge color="red" dot overlap :value="filterBadge > 0">
                        <v-icon>mdi-filter-variant</v-icon>
                      </v-badge>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('titles.Filters') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="onExcel">
                    <v-list-item-icon>
                      <v-icon>mdi-cloud-download</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Excel') }}
                    </v-list-item-title>
                  </v-list-item>
                  <slot name="toolbarActions" />
                  <v-list-item @click="getUsers">
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
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader
              ref="skeleton"
              :loading="loading"
              transition="scale-transition"
              type="table"
              class="mx-auto"
            >
              <v-data-table
                :options.sync="pagination"
                :items-per-page.sync="itemsPerPage"
                :server-items-length="total"
                :headers="headers"
                :show-expand="expanded && expanded.length > 0"
                :items="users"
                item-key="id"
                :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
                @update:sort-by="getUsers"
                @update:sort-desc="getUsers"
              >
                <template #top>
                  <v-toolbar flat color="transparent">
                    <v-text-field
                      v-model="query"
                      append-icon="mdi-magnify"
                      clearable
                      :label="$t('label.find_by_any')"
                      persistent-hint
                      :hint="$t('helper.Find')"
                      @click:append="onSearch"
                      @click:clear="onClearSearch"
                    >
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-btn
                          :aria-label="$t('titles.Filters')"
                          color="primary"
                          class="mr-2 my-2 hidden-sm-and-down"
                          fab
                          small
                          v-on="on"
                          @click="onFilter"
                        >
                          <v-badge color="red" dot :value="filterBadge > 0">
                            <v-icon color="white" dark>
                              mdi-filter-variant
                            </v-icon>
                          </v-badge>
                        </v-btn>
                      </template>
                      <i18n path="titles.Filters" tag="span" />
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-btn
                          :aria-label="$t('buttons.Excel')"
                          color="primary"
                          class="mr-2 my-2 hidden-sm-and-down"
                          :loading="loading"
                          :disabled="loading"
                          fab
                          small
                          v-on="on"
                          @click="onExcel"
                        >
                          <v-icon color="white" dark>mdi-cloud-download</v-icon>
                        </v-btn>
                      </template>
                      <i18n path="buttons.Excel" tag="span" />
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-btn
                          :aria-label="$t('buttons.Refresh')"
                          color="primary"
                          class="mr-2 my-2 hidden-sm-and-down"
                          :loading="loading"
                          :disabled="loading"
                          fab
                          small
                          v-on="on"
                          @click="getUsers"
                        >
                          <v-icon color="white" dark>mdi-reload</v-icon>
                        </v-btn>
                      </template>
                      <i18n path="buttons.Refresh" tag="span" />
                    </v-tooltip>
                  </v-toolbar>
                </template>
                <template #[`item.actions`]="{ item }">
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
                      <v-list-item
                        :to="
                          localePath({
                            name: 'schedules-id-users-citizenId',
                            params: {
                              id: $route.params.id,
                              citizenId: item.id,
                            },
                          })
                        "
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-text</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          <i18n path="titles.Details" />
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="canViewObservations"
                        @click="onComment(item)"
                      >
                        <v-list-item-icon>
                          <v-badge
                            color="red"
                            :content="item.observations_count"
                            overlap
                            :value="item.observations_count"
                          >
                            <v-icon>mdi-comment-text-multiple-outline</v-icon>
                          </v-badge>
                        </v-list-item-icon>
                        <v-list-item-title>
                          <i18n path="titles.ViewObservations" />
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="canViewFile" @click="onFiles(item)">
                        <v-list-item-icon>
                          <v-badge
                            color="red"
                            :content="item.files_count"
                            overlap
                            :value="item.files_count"
                          >
                            <v-icon>mdi-file-document-multiple-outline</v-icon>
                          </v-badge>
                        </v-list-item-icon>
                        <v-list-item-title>
                          <i18n path="titles.ViewAttachment" />
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="canAssignStatus"
                        @click="onAssignStatusSign(item)"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          <i18n path="titles.AssignStatusSign" />
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
                <template #[`item.schedule_status_name`]="{ item }">
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <v-avatar
                        :color="item.schedule_status_color"
                        size="15"
                        v-on="on"
                      />
                    </template>
                    <span v-text="item.schedule_status_name" />
                  </v-tooltip>
                </template>
                <template #[`item.status`]="{ item }">
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <v-avatar :color="item.color" size="15" v-on="on" />
                    </template>
                    <span v-text="item.status" />
                  </v-tooltip>
                </template>
                <template #[`item.profile_type`]="{ item }">
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <v-icon v-on="on">
                        {{
                          item.profile_type_id === 1
                            ? 'mdi-human-male-female'
                            : 'mdi-human-capacity-decrease'
                        }}
                      </v-icon>
                    </template>
                    <span v-text="item.profile_type" />
                  </v-tooltip>
                </template>
                <template #[`item.email`]="{ item }">
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <v-btn
                        icon
                        small
                        :href="`mailto:${item.email}`"
                        target="_blank"
                        v-on="on"
                      >
                        <v-icon>mdi-email</v-icon>
                      </v-btn>
                    </template>
                    <span v-text="item.email" />
                  </v-tooltip>
                </template>
                <template #expanded-item="{ headers: data, item }">
                  <td :colspan="data.length" width="100%">
                    <v-row
                      v-for="(expanded_item, key) in expanded"
                      :key="`expanded-${key}`"
                    >
                      <v-col cols="12" sm="12" md="6">
                        <div class="font-weight-bold">
                          {{ expanded_item.text }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        {{ item[expanded_item.value] }}
                      </v-col>
                    </v-row>
                  </td>
                </template>
              </v-data-table>
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-check-dialog
      ref="observationDialog"
      toolbar-color="primary"
      title="titles.Observations"
      :show-btn="false"
      width="600"
    >
      <v-observations
        v-if="selectedItem.id"
        :profile-id="selectedItem.id"
        :show-history-button="canViewHistoryObservations"
      />
    </v-check-dialog>
    <v-check-dialog
      ref="attachmentsDialog"
      toolbar-color="primary"
      title="titles.Attachment"
      :show-btn="false"
      width="600"
    >
      <v-attachments
        v-if="selectedItem.id"
        :profile-id="selectedItem.id"
        :show-assign-button="canAssignStatusFile"
        :show-history-button="canViewHistoryFile"
        :show-delete-button="canDestroyFile"
      />
    </v-check-dialog>
    <v-check-dialog
      ref="filtersDialog"
      toolbar-color="primary"
      title="titles.Filters"
      :show-btn="false"
      width="600"
    >
      <v-profile-filter @submit="onMakeFilter" />
    </v-check-dialog>
    <v-check-dialog
      ref="confirmDialog"
      toolbar-color="primary"
      title="titles.AssignStatusSign"
      :show-btn="false"
      width="600"
    >
      <v-input
        prepend-icon="mdi-account"
        :label="`${selectedItem.name} ${selectedItem.surname}`"
        :hint="$t('inputs.Username')"
        persistent-hint
      />
      <v-subscribe-form
        v-if="selectedItem.id"
        :profile-id="selectedItem.id"
        :schedule-id="$route.params.id"
        :status-id="selectedItem.schedule_status_id"
        @submit="onCloseDelete"
      />
    </v-check-dialog>
  </v-container>
</template>

<router lang="yaml">
meta:
  title: UsersSchedules
</router>

<script>
import FileSaver from 'file-saver'
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Schedule } from '~/models/services/citizen/Schedule'
import { Arrow } from '~/plugins/Arrow'
import Base64ToBlob from '~/utils/Base64ToBlob'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'ScheduleUsers',
  head: (vm) => ({
    title: vm.$t('titles.UsersSchedules'),
  }),
  auth: 'auth',
  middleware: ['permissions'],
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    permissions(bouncer, to, from) {
      const service = new AbilityService()
      const statusProfile = service.canAnyAction(
        ['assignStatus'],
        service.models.CITIZEN_SCHEDULES
      )
      const citizens = service.manageAbilities(service.models.CITIZEN_SCHEDULES)
      const abilities = service.manageAbilities(service.models.SCHEDULES)
      return bouncer.canAny([...statusProfile, ...abilities, ...citizens])
    },
  },
  components: {
    VStatsCard: () => import('~/components/base/MaterialStatsCard'),
    VCheckDialog: () => import('~/components/base/VCheckDialog'),
    VObservations: () => import('~/components/citizen/VObservations'),
    VSubscribeForm: () => import('~/components/citizen/VSubscribeForm'),
    VAttachments: () => import('~/components/citizen/VAttachments'),
    VProfileFilter: () => import('~/components/citizen/VProfileFilter'),
    VTimeAgo: () => import('~/components/base/TimeAgo'),
  },
  nuxtI18n: {
    paths: {
      en: '/schedules/:id/users',
      es: '/horarios/:id/usuarios',
    },
  },
  fetch() {
    this.getData()
    this.getUsers()
  },
  created() {
    this.drawerModel = new Menu()
  },
  watch: {
    'pagination.page'() {
      return this.form && this.getUsers()
    },
    itemsPerPage() {
      return this.form && this.getUsers()
    },
  },
  data: () => ({
    arrow: new Arrow(window, window.document, 'primary'),
    loading: false,
    form: new Schedule(),
    schedule: {
      quota: 0,
      users_schedules_count: 0,
      left: 0,
    },
    users: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    headers: [],
    expanded: [],
    itemsPerPageArray: [10, 30, 30, 50, 100],
    query: null,
    timeOut: null,
    requested_at: null,
    selectedItem: {},
    filters: {},
    citizen_schedules: [],
  }),
  methods: {
    getData() {
      this.loading = true
      this.schedule.quota = 0
      this.schedule.users_schedules_count = 0
      this.schedule.left = 0
      this.form
        .show(this.$route.params.id)
        .then((response) => {
          this.schedule = {
            left:
              parseInt(response.data.quota) -
              parseInt(response.data.users_schedules_count),
            ...response.data,
          }
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
    getUsers() {
      this.loading = true
      const params = {
        query: this.query,
        per_page: this.itemsPerPage,
        page: this.pagination.page,
        column: this.pagination.sortBy,
        order: this.pagination.sortDesc,
        ...this.filters,
      }
      this.form
        .profiles(this.$route.params.id, { params })
        .then((response) => {
          this.users = response.data
          this.total = response.meta.total
          this.headers = response.details.headers
          this.expanded = response.details.expanded || []
          this.requested_at = response.requested_at
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onSearch() {
      this.pagination.page = 1
      this.getUsers()
    },
    onClearSearch() {
      const that = this
      this.timeOut = setTimeout(function () {
        that.pagination.page = 1
        that.getUsers()
      }, 200)
    },
    onComment(item) {
      const that = this
      this.selectedItem = {}
      this.$nextTick(function () {
        that.selectedItem = item
        that.$refs.observationDialog.open().catch(() => {
          that.selectedItem = {}
        })
      })
    },
    onFiles(item) {
      const that = this
      this.selectedItem = {}
      this.$nextTick(function () {
        that.selectedItem = item
        that.$refs.attachmentsDialog.open().catch(() => {
          that.selectedItem = {}
        })
      })
    },
    onAssignStatusSign(item) {
      this.selectedItem = item
      this.$refs.confirmDialog.open().catch(() => {
        this.selectedItem = {}
      })
    },
    onCloseDelete() {
      this.selectedItem = {}
      this.$refs.confirmDialog.close()
      this.getUsers()
      this.getData()
    },
    onSuccess() {
      this.selectedItem = {}
      this.getData()
      this.getUsers()
      this.$refs.observationDialog.close()
      this.$refs.attachmentsDialog.close()
    },
    onFilter() {
      this.$refs.filtersDialog.open()
    },
    onMakeFilter(data) {
      this.$refs.filtersDialog.close()
      this.filters = data
      const that = this
      this.$nextTick(function () {
        that.getUsers()
      })
    },
    onExcel() {
      this.loading = true
      const params = {
        query: this.query,
        ...this.filters,
      }
      this.form
        .excel(this.$route.params.id, { params })
        .then((response) => {
          FileSaver.saveAs(
            new Base64ToBlob(response.data.file).blob(),
            response.data.name
          )
        })
        .then(() => {
          this.arrow.show(6000)
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {
    filterBadge() {
      return Object.keys(this.filters).length
    },
    canAssignStatus() {
      return this.canMakeAction(
        'assign-status',
        this.ability_service.models.CITIZEN_SCHEDULES
      )
    },
    canViewObservations() {
      return this.canView(this.ability_service.models.OBSERVATIONS)
    },
    canViewFile() {
      return this.canView(this.ability_service.models.FILES)
    },
    canViewHistoryObservations() {
      return this.canViewHistory(this.ability_service.models.OBSERVATIONS)
    },
    canViewHistoryFile() {
      return this.canViewHistory(this.ability_service.models.FILES)
    },
    canDestroyFile() {
      return this.canManageOrDestroy(this.ability_service.models.FILES)
    },
    canAssignStatusFile() {
      return this.canMakeAction(
        'assign-status',
        this.ability_service.models.FILES
      )
    },
  },
  beforeDestroy() {
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
  },
}
</script>
