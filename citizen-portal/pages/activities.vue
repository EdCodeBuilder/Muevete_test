<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="activities"
    card-title="titles.Activities"
    card-icon="mdi-card-text-outline"
    :model="model"
    :show-excel-button="false"
    :show-create-button="canCreateAction"
    :show-update-button="canUpdateAction"
    :show-delete-button="canDeleteAction"
    :show-history-button="canViewHistoryAction"
  >
    <template #[`item.is_initiate`]="{ item }">
      {{ item.is_initiate ? 'SI' : 'NO' }}
    </template>
    <template #form="{ model }">
      <v-activity-form
        @success="$refs.tableCard.refresh()"
        @error="$refs.tableCard.refresh()"
        :form-data="model.data()"
      />
    </template>
  </v-data-table-card>
</template>

<router lang="yaml">
meta:
  title: Activities
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Activity } from '~/models/services/citizen/Activity'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'Activities',
  nuxtI18n: {
    paths: {
      en: '/activities',
      es: '/actividades',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.Activities'),
  }),
  auth: 'auth',
  middleware: ['permissions'],
  components: {
    VDataTableCard: () => import('@/components/base/VDataTableCard'),
    VActivityForm: () => import('@/components/citizen/VActivityForm'),
  },
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    permissions(bouncer, to, from) {
      const service = new AbilityService()
      const abilities = service.manageAbilities(service.models.ACTIVITIES)
      return bouncer.canAny(abilities)
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    model: new Activity(),
  }),
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.ACTIVITIES)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.ACTIVITIES)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.ACTIVITIES)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.ACTIVITIES)
    },
  },
}
</script>
