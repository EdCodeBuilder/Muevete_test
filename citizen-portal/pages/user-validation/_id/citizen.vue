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
                  <v-list-item v-if="canAssignValidator" @click="onAssign">
                    <v-list-item-icon>
                      <v-badge
                        color="success"
                        content="1"
                        overlap
                        :value="!!selectedItem.checker_id"
                      >
                        <v-icon>mdi-account-plus</v-icon>
                      </v-badge>
                    </v-list-item-icon>
                    <v-list-item-title>
                      <i18n path="titles.AssignValidator" />
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="assignStatus" @click="onStatus">
                    <v-list-item-icon>
                      <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      <i18n path="titles.AssignStatus" />
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
      ref="assignDialog"
      toolbar-color="primary"
      title="titles.AssignValidator"
      :show-btn="false"
      width="600"
    >
      <v-assignor-form
        v-if="selectedItem.id"
        :id="selectedItem.id"
        :validator-id="selectedItem.checker_id"
        @success="onSuccess"
      />
    </v-check-dialog>
    <v-check-dialog
      ref="statusDialog"
      toolbar-color="primary"
      title="titles.AssignStatus"
      :show-btn="false"
      width="600"
    >
      <v-status-form
        v-if="selectedItem.id"
        :id="selectedItem.id"
        :status-id="selectedItem.status_id"
        @success="onSuccess"
      />
    </v-check-dialog>
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
  </v-container>
</template>

<router lang="yaml">
meta:
  title: Citizen
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Profile } from '~/models/services/citizen/Profile'
import AbilityService from '~/models/services/citizen/AbilityService'
export default {
  name: 'Citizen',
  nuxtI18n: {
    paths: {
      en: '/users-validation/:id/citizen',
      es: '/validacion-de-usuarios/:id/ciudadano',
    },
  },
  components: {
    VCheckDialog: () => import('~/components/base/VCheckDialog'),
    VAssignorForm: () => import('~/components/citizen/VAssignorForm'),
    VStatusForm: () => import('~/components/citizen/VStatusForm'),
    VObservations: () => import('~/components/citizen/VObservations'),
    VUserActivities: () => import('~/components/citizen/VUserActivities'),
    VAttachments: () => import('~/components/citizen/VAttachments'),
    VMaterialCard: () => import('@/components/base/MaterialCard'),
    VTimeAgo: () => import('@/components/base/TimeAgo'),
    VUserAgent: () => import('~/components/base/VUserAgent'),
    VEmptyState: () => import('~/components/base/EmptyState'),
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
      const abilitiesProfile = service.canAnyAction(
        [
          'assignValidator',
          'assignStatus',
          'manage',
          'view',
          'create',
          'update',
          'destroy',
        ],
        service.models.PROFILE
      )
      const abilitiesFile = service.canAnyAction(
        ['assignStatus', 'manage', 'view', 'create', 'update', 'destroy'],
        service.models.FILES
      )
      return bouncer.canAny([
        ...abilitiesProfile,
        ...abilitiesFile,
        ...statusProfile,
        ...citizens,
        ...abilities,
      ])
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
    form: new Profile(),
    headers: [],
    selectedItem: {},
    history: [],
    requested_at: null,
  }),
  methods: {
    getUser() {
      this.loading = true
      this.form
        .show(this.$route.params.id)
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
    onAssign() {
      this.$refs.assignDialog.open()
    },
    onStatus() {
      this.$refs.statusDialog.open()
    },
    onSuccess() {
      this.getUser()
      this.$refs.assignDialog.close()
      this.$refs.statusDialog.close()
    },
    onHistory() {
      this.$refs.historyDialog.open()
    },
  },
  computed: {
    assignStatus() {
      const validator = this.bouncer.isA(
        this.ability_service.roles.ROLE_VALIDATOR
      )
      return this.bouncer.can(
        this.ability_service.assignStatus(this.ability_service.models.PROFILE),
        this.ability_service.models.PROFILE,
        validator ? this.selectedItem : null,
        'checker_id'
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
    canAssignValidator() {
      return this.canMakeAction(
        'assign-validator',
        this.ability_service.models.PROFILE
      )
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
      const abilitiesFile = this.ability_service.canAnyAction(
        ['assignStatus', 'manage', 'view', 'create', 'update', 'destroy'],
        this.ability_service.models.FILES
      )
      return this.bouncer.canAny(abilitiesFile)
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
