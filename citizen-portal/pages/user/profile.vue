<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col class="mt-8" cols="12" sm="12" md="4">
        <base-material-card
          class="v-card-profile"
          :ident-icon="profile.username || 'SIM'"
        >
          <v-card-text class="text-center">
            <h4 class="display-serif-2 font-weight-bold">{{ shortName }}</h4>

            <h6 class="subtitle-1 mb-1 grey--text mb-3">
              {{ profile.description }}
            </h6>

            <p class="font-weight-light grey--text">
              {{ `${profile.dependency} - ${profile.company}` }}
            </p>

            <p class="font-weight-light grey--text">
              {{ profile.document }}
            </p>

            <v-btn
              text
              color="primary"
              small
              block
              :href="`mailto:${profile.email}`"
            >
              <v-icon left small>mdi-email</v-icon>
              {{ profile.email }}
            </v-btn>
            <p class="body-1">
              <v-icon left small>mdi-phone</v-icon>
              {{
                `${profile.phone} ${profile.ext ? 'ext. ' + profile.ext : ''}`
              }}
            </p>
            <p class="body-1">
              <v-icon left small>mdi-calendar</v-icon>
              {{ expiresAt }}
            </p>
          </v-card-text>
          <v-card-actions class="text-center">
            <v-user-agent />
          </v-card-actions>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<router lang="yaml">
meta:
  title: Profile
</router>

<script>
import { Constants } from '@/utils/Constants'
import MaterialCard from '~/components/base/MaterialCard'
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
export default {
  name: 'Profile',
  nuxtI18n: {
    paths: {
      en: '/user/profile',
      es: '/usuario/perfil',
    },
  },
  auth: 'auth',
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    roles: [
      Constants.Roles.ROLE_ROOT,
      Constants.Roles.ROLE_ADMIN,
      Constants.Roles.ROLE_VIEWER,
    ],
  },
  created() {
    this.drawerModel = new Menu()
  },
  components: {
    BaseMaterialCard: MaterialCard,
    VUserAgent: () => import('~/components/base/VUserAgent'),
  },
  head: (vm) => ({
    title: vm.$t('titles.Profile'),
  }),
  computed: {
    shortName() {
      return `${(this.$store.state.auth.user.name || '').split(' ').shift()} ${(
        this.$store.state.auth.user.surname || ''
      )
        .split(' ')
        .shift()}`
    },
    profile() {
      return this.$store.state.auth.user
    },
    expiresAt() {
      return this.$moment(this.profile.expires_at).isValid()
        ? this.$moment(this.profile.expires_at).fromNow()
        : ''
    },
  },
}
</script>
