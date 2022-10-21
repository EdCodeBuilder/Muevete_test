<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="stages"
    card-title="titles.Stages"
    card-icon="mdi-card-text-outline"
    :model="model"
    :show-excel-button="false"
    :show-create-button="canCreateAction"
    :show-update-button="canUpdateAction"
    :show-delete-button="canDeleteAction"
    :show-history-button="canViewHistoryAction"
  >
    <template #form="{ model }">
      <v-stage-form
        @success="$refs.tableCard.refresh()"
        @error="$refs.tableCard.refresh()"
        :form-data="model.data()"
      />
    </template>
  </v-data-table-card>
</template>

<router lang="yaml">
meta:
  title: Stages
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Stage } from '~/models/services/citizen/Stage'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'Stages',
  nuxtI18n: {
    paths: {
      en: '/stages',
      es: '/escenarios',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.Stages'),
  }),
  auth: 'auth',
  middleware: ['permissions'],
  components: {
    VDataTableCard: () => import('@/components/base/VDataTableCard'),
    VStageForm: () => import('@/components/citizen/VStageForm'),
  },
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    permissions(bouncer, to, from) {
      const service = new AbilityService()
      const abilities = service.manageAbilities(service.models.STAGES)
      return bouncer.canAny(abilities)
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    model: new Stage(),
  }),
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.STAGES)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.STAGES)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.STAGES)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.STAGES)
    },
  },
}
</script>
