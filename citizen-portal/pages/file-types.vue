<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="fileTypes"
    card-title="titles.FileTypes"
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
  title: FileTypes
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { FileType } from '~/models/services/citizen/FileType'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'FileTypes',
  nuxtI18n: {
    paths: {
      en: '/file-types',
      es: '/tipos-de-archivos',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.FileTypes'),
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
      const abilities = service.manageAbilities(service.models.FILE_TYPES)
      return bouncer.canAny(abilities)
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    model: new FileType(),
  }),
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.FILE_TYPES)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.FILE_TYPES)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.FILE_TYPES)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.FILE_TYPES)
    },
  },
}
</script>
