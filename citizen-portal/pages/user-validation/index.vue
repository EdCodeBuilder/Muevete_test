<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="users"
    card-title="titles.UserValidation"
    card-icon="mdi-card-text-outline"
    :model="form"
    show-actions-as-menu
    :show-create-button="false"
    :show-update-button="false"
    :show-delete-button="false"
    :show-history-button="canViewHistoryAction"
    :additional-params="filters"
  >
    <template #toolbarActions>
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
    </template>
    <template #toolbarTableAppend>
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
              <v-icon color="white" dark>mdi-filter-variant</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <i18n path="titles.Filters" tag="span" />
      </v-tooltip>
    </template>
    <template #actionsMenu="{ item }">
      <v-list-item
        :to="
          localePath({
            name: 'user-validation-id-citizen',
            params: { id: item.id },
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
      <v-list-item v-if="canAssignValidator" @click="onAssign(item)">
        <v-list-item-icon>
          <v-badge
            color="success"
            content="1"
            overlap
            :value="!!item.checker_id"
          >
            <v-icon>mdi-account-plus</v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title>
          <i18n path="titles.AssignValidator" />
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="assignStatus(item)" @click="onStatus(item)">
        <v-list-item-icon>
          <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <i18n path="titles.AssignStatus" />
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canViewObservations" @click="onComment(item)">
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
            :color="fileColor(item)"
            :content="fileValue(item)"
            overlap
            :value="fileValue(item)"
          >
            <v-icon>mdi-file-document-multiple-outline</v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title>
          <i18n path="titles.ViewAttachment" />
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canViewActivities" @click="onActivities(item)">
        <v-list-item-icon>
          <v-badge
            :color="item.activities_count > 0 ? 'green' : 'red'"
            :content="item.activities_count"
            overlap
            :value="item.activities_count"
          >
            <v-icon>mdi-soccer</v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title>
          <i18n path="titles.ViewActivities" />
        </v-list-item-title>
      </v-list-item>
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
    <template #[`item.phone`]="{ item }">
      <v-tooltip v-if="item.whatsapp" top>
        <template #activator="{ on }">
          <v-btn icon small :href="item.whatsapp" target="_blank" v-on="on">
            <v-icon>mdi-whatsapp</v-icon>
          </v-btn>
        </template>
        <span v-text="item.phone" />
      </v-tooltip>
      <v-tooltip v-else-if="item.phone" top>
        <template #activator="{ on }">
          <v-btn small :href="`tel:${item.phone}`" target="_blank" v-on="on">
            {{ item.phone }}
          </v-btn>
        </template>
        <span v-text="item.phone" />
      </v-tooltip>
    </template>
    <template #dialogs>
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
        ref="profileActivitiesDialog"
        toolbar-color="primary"
        title="titles.ViewActivities"
        :show-btn="false"
        width="600"
      >
        <v-user-activities
          v-if="selectedItem.id"
          :profile-id="selectedItem.id"
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
    </template>
  </v-data-table-card>
</template>

<router lang="yaml">
meta:
  title: UserValidation
</router>

<script>
import { get } from 'lodash'
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Profile } from '~/models/services/citizen/Profile'
import AbilityService from '~/models/services/citizen/AbilityService'
export default {
  name: 'UserValidation',
  nuxtI18n: {
    paths: {
      en: '/users-validation',
      es: '/validacion-de-usuarios',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.UserValidation'),
  }),
  auth: 'auth',
  middleware: ['permissions'],
  components: {
    VDataTableCard: () => import('~/components/base/VDataTableCard'),
    VCheckDialog: () => import('~/components/base/VCheckDialog'),
    VAssignorForm: () => import('~/components/citizen/VAssignorForm'),
    VStatusForm: () => import('~/components/citizen/VStatusForm'),
    VObservations: () => import('~/components/citizen/VObservations'),
    VAttachments: () => import('~/components/citizen/VAttachments'),
    VProfileFilter: () => import('~/components/citizen/VProfileFilter'),
    VUserActivities: () => import('~/components/citizen/VUserActivities'),
  },
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    permissions(bouncer, to, from) {
      const service = new AbilityService()
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
      return bouncer.canAny([...abilitiesProfile, ...abilitiesFile])
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    form: new Profile(),
    selectedItem: {},
    filters: {},
  }),
  methods: {
    fileColor(item) {
      const files = parseInt(get(item, 'files_count'))
      const pendingFiles = parseInt(get(item, 'pending_files_count'))
      const result = files - pendingFiles
      return result === 0 ? 'green' : 'red'
    },
    fileValue(item) {
      const files = parseInt(get(item, 'files_count'))
      const pendingFiles = parseInt(get(item, 'pending_files_count'))
      const result = files - pendingFiles
      return result === 0 ? files : pendingFiles
    },
    onAssign(item) {
      const that = this
      this.selectedItem = {}
      this.$nextTick(function () {
        that.selectedItem = item
        that.$refs.assignDialog.open().catch(() => {
          that.selectedItem = {}
        })
      })
    },
    onStatus(item) {
      const that = this
      this.selectedItem = {}
      this.$nextTick(function () {
        that.selectedItem = item
        that.$refs.statusDialog.open().catch(() => {
          that.selectedItem = {}
        })
      })
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
    onSuccess() {
      this.selectedItem = {}
      this.$refs.tableCard.getData()
      this.$refs.assignDialog.close()
      this.$refs.statusDialog.close()
      this.$refs.observationDialog.close()
      this.$refs.attachmentsDialog.close()
    },
    onFilter() {
      this.$refs.filtersDialog.open()
    },
    onActivities(item) {
      const that = this
      this.selectedItem = {}
      this.$nextTick(function () {
        that.selectedItem = item
        that.$refs.profileActivitiesDialog.open().catch(() => {
          that.selectedItem = {}
        })
      })
    },
    onMakeFilter(data) {
      this.$refs.filtersDialog.close()
      this.filters = data
      const that = this
      this.$nextTick(function () {
        that.$refs.tableCard.getData()
      })
    },
    assignStatus(item) {
      const validator = this.bouncer.isA(
        this.ability_service.roles.ROLE_VALIDATOR
      )
      return this.bouncer.can(
        this.ability_service.assignStatus(this.ability_service.models.PROFILE),
        this.ability_service.models.PROFILE,
        validator ? item : null,
        'checker_id'
      )
    },
  },
  computed: {
    filterBadge() {
      return Object.keys(this.filters).length
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.PROFILE)
    },
    canViewObservations() {
      return this.canView(this.ability_service.models.OBSERVATIONS)
    },
    canViewHistoryObservations() {
      return this.canViewHistory(this.ability_service.models.OBSERVATIONS)
    },
    canViewFile() {
      const abilitiesFile = this.ability_service.canAnyAction(
        ['assignStatus', 'manage', 'view', 'create', 'update', 'destroy'],
        this.ability_service.models.FILES
      )
      return this.bouncer.canAny(abilitiesFile)
    },
    canViewHistoryFile() {
      return this.canViewHistory(this.ability_service.models.FILES)
    },
    canDestroyFile() {
      return this.canManageOrDestroy(this.ability_service.models.FILES)
    },
    canAssignValidator() {
      return this.canMakeAction(
        'assign-validator',
        this.ability_service.models.PROFILE
      )
    },
    canAssignStatusFile() {
      return this.canMakeAction(
        'assign-status',
        this.ability_service.models.FILES
      )
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
