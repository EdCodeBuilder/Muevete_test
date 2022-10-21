<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="schedules"
    card-title="titles.Schedules"
    card-icon="mdi-calendar"
    :model="model"
    custom-expanded
    show-actions-as-menu
    :additional-params="filters"
    :show-excel-button="false"
    :show-create-button="canCreateAction"
    :show-update-button="canUpdateAction"
    :show-delete-button="canDeleteAction"
    :show-history-button="canViewHistoryAction"
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
      <v-list-item v-if="canCreateAction" @click="onMassive">
        <v-list-item-icon>
          <v-icon>mdi-cloud-upload</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('titles.Massive') }}
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
    <template #[`item.id`]="{ item }">
      <nuxt-link
        :to="
          localePath({ name: 'schedules-id-users', params: { id: item.id } })
        "
        v-text="item.id"
      />
    </template>
    <template #[`item.is_activated`]="{ item }">
      <i18n :path="item.is_activated ? 'Yes' : 'No'" />
    </template>
    <template #[`item.is_paid`]="{ item }">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            :color="item.is_paid ? 'primary' : ''"
            v-bind="attrs"
            v-on="on"
          >
            {{ item.is_paid ? 'mdi-currency-usd' : 'mdi-currency-usd-off' }}
          </v-icon>
        </template>
        <i18n :path="item.is_paid ? 'Yes' : 'No'" tag="span" />
      </v-tooltip>
    </template>
    <template #actionsMenu="{ item }">
      <v-list-item @click="onExcel(item)">
        <v-list-item-icon>
          <v-icon>mdi-cloud-download</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('buttons.Excel') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #customExpanded="{ item, expanded }">
      <v-row v-for="(expanded_item, key) in expanded" :key="`expanded-${key}`">
        <v-col cols="12" sm="12" md="6">
          <div class="font-weight-bold">
            {{ expanded_item.text }}
          </div>
        </v-col>
        <v-col
          v-if="expanded_item.value === 'is_initiate'"
          cols="12"
          sm="12"
          md="6"
        >
          <i18n :path="item.is_initiate ? 'Yes' : 'No'" />
        </v-col>
        <v-col v-else cols="12" sm="12" md="6">
          {{ item[expanded_item.value] }}
        </v-col>
      </v-row>
    </template>
    <template #form="{ model }">
      <v-schedule-form
        @success="$refs.tableCard.refresh()"
        @error="$refs.tableCard.refresh()"
        :form-data="model.data()"
      />
    </template>
    <template #dialogs>
      <v-check-dialog
        ref="filtersDialog"
        toolbar-color="primary"
        title="titles.Filters"
        :show-btn="false"
        width="600"
      >
        <v-schedule-filter @submit="onMakeFilter" />
      </v-check-dialog>
      <v-check-dialog
        v-if="canCreateAction"
        ref="massiveDialog"
        toolbar-color="primary"
        title="titles.Massive"
        :show-btn="false"
        width="600"
        fullscreen
      >
        <VScheduleMassiveForm @success="onSuccess" />
      </v-check-dialog>
    </template>
  </v-data-table-card>
</template>

<router lang="yaml">
meta:
  title: Schedules
</router>

<script>
import FileSaver from 'file-saver'
import Base64ToBlob from '~/utils/Base64ToBlob'
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Schedule } from '~/models/services/citizen/Schedule'
import { Arrow } from '~/plugins/Arrow'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'Schedules',
  nuxtI18n: {
    paths: {
      en: '/schedules',
      es: '/horarios',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.Schedules'),
  }),
  auth: 'auth',
  middleware: ['permissions'],
  components: {
    VDataTableCard: () => import('~/components/base/VDataTableCard'),
    VScheduleForm: () => import('~/components/citizen/VScheduleForm'),
    VScheduleMassiveForm: () =>
      import('~/components/citizen/VScheduleMassiveForm'),
    VCheckDialog: () => import('@/components/base/VCheckDialog'),
    VScheduleFilter: () => import('@/components/citizen/VScheduleFilter'),
  },
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
  data: () => ({
    arrow: new Arrow(window, window.document, 'primary'),
    model: new Schedule(),
    filters: {},
  }),
  methods: {
    onExcel(item) {
      this.loading = true
      this.model
        .excel(item.id)
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
    onFilter() {
      this.$refs.filtersDialog.open()
    },
    onSuccess() {
      this.$refs.massiveDialog.close()
      const that = this
      this.$nextTick(function () {
        that.$refs.tableCard.getData()
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
    onMassive() {
      this.$refs.massiveDialog.open()
    },
  },
  computed: {
    filterBadge() {
      return Object.keys(this.filters).length
    },
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.SCHEDULES)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.SCHEDULES)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.SCHEDULES)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.SCHEDULES)
    },
  },
}
</script>
