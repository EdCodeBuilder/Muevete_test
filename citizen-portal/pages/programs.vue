<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="programs"
    card-title="titles.Programs"
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
  title: Programs
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { Program } from '~/models/services/citizen/Program'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'Programs',
  nuxtI18n: {
    paths: {
      en: '/programs',
      es: '/programas',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.Programs'),
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
      const abilities = service.manageAbilities(service.models.PROGRAMS)
      return bouncer.canAny(abilities)
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    model: new Program(),
  }),
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.PROGRAMS)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.PROGRAMS)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.PROGRAMS)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.PROGRAMS)
    },
  },
}
</script>
