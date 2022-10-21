<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <v-material-card class="mt-12" icon="mdi-account">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                <span
                  v-if="selectedItem.full_name"
                  v-text="selectedItem.full_name"
                />
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
                  <v-list-item @click="$router.back()">
                    <v-list-item-icon>
                      <v-icon>mdi-arrow-left</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      <i18n path="buttons.Back" />
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="getUser">
                    <v-list-item-icon>
                      <v-icon>mdi-refresh</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Refresh') }}
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
                  <v-list-item v-if="canViewHistoryAction" @click="onHistory">
                    <v-list-item-icon>
                      <v-icon>mdi-history</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.History') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <v-card-text>
            <v-skeleton-loader
              :loading="loading"
              type="list-item-avatar-two-line@10"
            >
              <v-row>
                <v-col cols="12">
                  <v-alert
                    type="info"
                    :color="selectedItem.schedule_status_color"
                  >
                    <span class="white--text font-weight-bold">
                      {{ selectedItem.schedule_status_name }}
                    </span>
                  </v-alert>
                </v-col>
                <v-col
                  v-for="(key, i) in userData"
                  :key="i"
                  cols="12"
                  sm="12"
                  md="6"
                >
                  <v-list v-if="!!selectedItem[key.value]">
                    <v-list-item>
                      <v-list-item-icon v-if="!!key.icon">
                        <v-icon v-text="key.icon" />
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="selectedItem[key.value]" />
                        <v-list-item-subtitle
                          v-if="!!key.text"
                          v-text="key.text"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-skeleton-loader>
          </v-card-text>
        </v-material-card>
      </v-col>
      <v-col v-if="canViewFile" cols="12">
        <v-material-card
          class="mt-12"
          icon="mdi-file-document-multiple-outline"
          :title="$t('titles.Attachment')"
        >
          <v-card-text>
            <v-attachments
              v-if="selectedItem.id"
              :profile-id="selectedItem.id"
              :show-assign-button="canAssignStatusFile"
              :show-history-button="canViewHistoryFile"
              :show-delete-button="canDestroyFile"
            />
          </v-card-text>
        </v-material-card>
      </v-col>
      <v-col v-if="canViewObservations" cols="12">
        <v-material-card
          class="mt-12"
          icon="mdi-comment-text-multiple-outline"
          :title="$t('titles.Observations')"
        >
          <v-card-text>
            <v-observations
              v-if="selectedItem.id"
              :profile-id="selectedItem.id"
              :show-history-button="canViewHistoryObservations"
            />
          </v-card-text>
        </v-material-card>
      </v-col>
      <v-col v-if="canViewActivities" cols="12">
        <v-material-card
          class="mt-12"
          icon="mdi-comment-text-multiple-outline"
          :title="$t('titles.ViewActivities')"
        >
          <v-card-text>
            <v-user-activities
              v-if="selectedItem.id"
              :profile-id="selectedItem.id"
            />
          </v-card-text>
        </v-material-card>
      </v-col>
    </v-row>
    <v-check-dialog
      ref="historyDialog"
      toolbar-color="primary"
      title="buttons.History"
      :show-btn="false"
      width="600"
    >
      <v-expansion-panels v-if="!!history.length">
        <v-expansion-panel v-for="(audit, i) in history" :key="i">
          <v-expansion-panel-header>
            <template #default>
              {{ audit.type_trans }}
              <v-spacer />
              <v-time-ago
                classes="caption"
                :prefix="audit.event"
                :date-time="audit.created_at"
              />
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card flat color="transparent">
              <v-card-title>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-avatar>
                        <v-icon>mdi-account</v-icon>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="audit.user" />
                      <v-list-item-subtitle v-text="audit.ip" />
                      <v-list-item-subtitle>
                        <v-time-ago
                          :prefix="audit.event"
                          :date-time="audit.created_at"
                        />
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-title>
              <v-card-text>
                <i18n class="display-1" tag="h3" path="form.new_values" />
                <v-json-pretty :data="audit.new_values" />
              </v-card-text>
              <v-divider />
              <v-card-text>
                <i18n class="display-1" tag="h3" path="form.old_values" />
                <v-json-pretty :data="audit.old_values" />
              </v-card-text>
              <v-card-actions class="text-center">
                <v-user-agent :user-agent="audit.user_agent" />
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-empty-state v-else icon="mdi-history" :label="$t('label.no_data')" />
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
        @submit="onSuccess"
      />
    </v-check-dialog>
  </v-container>
</template>

<router lang="yaml">
meta:
  title: Citizen
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Schedule } from '~/models/services/citizen/Schedule'
import AbilityService from '~/models/services/citizen/AbilityService'
export default {
  name: 'ScheduleCitizen',
  nuxtI18n: {
    paths: {
      en: '/schedules/:id/users/:citizenId',
      es: '/horarios/:id/usuarios/:citizenId',
    },
  },
  components: {
    VCheckDialog: () => import('~/components/base/VCheckDialog'),
    VObservations: () => import('~/components/citizen/VObservations'),
    VUserActivities: () => import('~/components/citizen/VUserActivities'),
    VAttachments: () => import('~/components/citizen/VAttachments'),
    VMaterialCard: () => import('@/components/base/MaterialCard'),
    VTimeAgo: () => import('@/components/base/TimeAgo'),
    VUserAgent: () => import('~/components/base/VUserAgent'),
    VEmptyState: () => import('~/components/base/EmptyState'),
    VSubscribeForm: () => import('@/components/citizen/VSubscribeForm'),
  },
  head: (vm) => ({
    title: vm.$t('titles.Citizen'),
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
      return bouncer.canAny([...statusProfile, ...citizens, ...abilities])
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  fetch() {
    this.getUser()
  },
  data: () => ({
    loading: false,
    form: new Schedule(),
    headers: [],
    selectedItem: {},
    history: [],
    requested_at: null,
  }),
  methods: {
    getUser() {
      this.loading = true
      this.form
        .citizen(this.$route.params.id, this.$route.params.citizenId)
        .then((response) => {
          this.selectedItem = response.data
          this.headers = response.details.headers
          this.history = response.data.audits || []
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onAssignStatusSign() {
      this.$refs.confirmDialog.open()
    },
    onSuccess() {
      this.getUser()
      this.$refs.confirmDialog.close()
    },
    onHistory() {
      this.$refs.historyDialog.open()
    },
  },
  computed: {
    canAssignStatus() {
      return this.canMakeAction(
        'assign-status',
        this.ability_service.models.CITIZEN_SCHEDULES
      )
    },
    userData() {
      return this.headers.filter((key) => {
        return !!this.selectedItem[key.value] && key.icon
      })
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.PROFILE)
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
    canViewFile() {
      return this.canView(this.ability_service.models.FILES)
    },
    canViewObservations() {
      return this.canView(this.ability_service.models.OBSERVATIONS)
    },
    canViewActivities() {
      const statusProfile = this.ability_service.canAnyAction(
        ['assignStatus'],
        this.ability_service.models.CITIZEN_SCHEDULES
      )
      const citizens = this.ability_service.manageAbilities(
        this.ability_service.models.CITIZEN_SCHEDULES
      )
      const abilities = this.ability_service.manageAbilities(
        this.ability_service.models.SCHEDULES
      )
      return this.bouncer.canAny([...statusProfile, ...abilities, ...citizens])
    },
  },
}
</script>
