<template>
  <v-data-table-card
    ref="tableCard"
    storage-path="profileTypes"
    card-title="titles.ProfileTypes"
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
  title: ProfileTypes
</router>

<script>
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import { ProfileType } from '~/models/services/citizen/ProfileType'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'ProfileTypes',
  nuxtI18n: {
    paths: {
      en: '/profile-types',
      es: '/tipos-de-perfiles',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.ProfileTypes'),
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
      const abilities = service.manageAbilities(service.models.PROFILE_TYPES)
      return bouncer.canAny(abilities)
    },
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    model: new ProfileType(),
  }),
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.PROFILE_TYPES)
    },
    canUpdateAction() {
      return this.canManageOrUpdate(this.ability_service.models.PROFILE_TYPES)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.PROFILE_TYPES)
    },
    canViewHistoryAction() {
      return this.canViewHistory(this.ability_service.models.PROFILE_TYPES)
    },
  },
}
</script>
