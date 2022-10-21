<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="daily"
    card-title="titles.DailyHours"
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
  title: DailyHours
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { DailyHour } from '~/models/services/citizen/DailyHour'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'DailyHours',
  nuxtI18n: {
    paths: {
      en: '/daily-hours',
      es: '/horas',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.DailyHours'),
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
      const abilities = service.manageAbilities(service.models.HOURS)
      return bouncer.canAny(abilities)
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    model: new DailyHour(),
  }),
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.HOURS)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.HOURS)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.HOURS)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.HOURS)
    },
  },
}
</script>
