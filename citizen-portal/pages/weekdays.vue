<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="weekdays"
    card-title="titles.WeekDays"
    card-icon="mdi-card-text-outline"
    :model="model"
    :show-excel-button="false"
    :show-create-button="canCreateAction"
    :show-update-button="canUpdateAction"
    :show-delete-button="canDeleteAction"
    :show-history-button="canViewHistoryAction"
  >
    <template #form="{ model }">
      <v-generic-form
        @success="$refs.tableCard.refresh()"
        @error="$refs.tableCard.refresh()"
        :model="model"
      />
    </template>
  </v-data-table-card>
</template>

<router lang="yaml">
meta:
  title: WeekDays
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { WeekDay } from '~/models/services/citizen/WeekDay'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'WeekDays',
  nuxtI18n: {
    paths: {
      en: '/weekdays',
      es: '/dias',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.WeekDays'),
  }),
  auth: 'auth',
  middleware: ['permissions'],
  components: {
    VDataTableCard: () => import('@/components/base/VDataTableCard'),
    VGenericForm: () => import('@/components/citizen/VGenericForm'),
  },
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    permissions(bouncer, to, from) {
      const service = new AbilityService()
      const abilities = service.manageAbilities(service.models.DAYS)
      return bouncer.canAny(abilities)
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    model: new WeekDay(),
  }),
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.DAYS)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.DAYS)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.DAYS)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.DAYS)
    },
  },
}
</script>
