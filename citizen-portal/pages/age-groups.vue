<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="ageGroups"
    card-title="titles.AgeGroups"
    card-icon="mdi-card-text-outline"
    :model="model"
    :show-excel-button="false"
    :show-create-button="canCreateAction"
    :show-update-button="canUpdateAction"
    :show-delete-button="canDeleteAction"
    :show-history-button="canViewHistoryAction"
  >
    <template #form="{ model }">
      <v-age-form
        @success="$refs.tableCard.refresh()"
        @error="$refs.tableCard.refresh()"
        :form-data="model.data()"
      />
    </template>
  </v-data-table-card>
</template>

<router lang="yaml">
meta:
  title: AgeGroups
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { AgeGroup } from '~/models/services/citizen/AgeGroup'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'AgeGroups',
  nuxtI18n: {
    paths: {
      en: '/age-groups',
      es: '/grupos-de-edades',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.AgeGroups'),
  }),
  auth: 'auth',
  middleware: ['permissions'],
  components: {
    VDataTableCard: () => import('@/components/base/VDataTableCard'),
    VAgeForm: () => import('@/components/citizen/VAgeForm'),
  },
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    permissions(bouncer, to, from) {
      const service = new AbilityService()
      const abilities = service.manageAbilities(service.models.AGES)
      return bouncer.canAny(abilities)
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    model: new AgeGroup(),
  }),
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.AGES)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.AGES)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.AGES)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.AGES)
    },
  },
}
</script>
