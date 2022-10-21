<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col v-if="canCreateAction" cols="12" sm="12" md="12">
        <i18n path="admin.find" tag="p" />
        <validation-observer ref="register" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(findUser)">
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <validation-provider
                  v-slot="{ errors }"
                  :rules="form.validations.required"
                  vid="username"
                  :name="$t('inputs.Username').toLowerCase()"
                >
                  <v-autocomplete
                    name="username"
                    :loading="finding"
                    v-model="form.username"
                    :search-input.sync="search_user"
                    :filter="customFilter"
                    :error-messages="errors"
                    :hint="$t('helper.UserAdmin')"
                    persistent-hint
                    :items="people"
                    color="primary"
                    :label="$t('inputs.Username')"
                    clearable
                    item-text="full_name"
                    item-value="id"
                    return-object
                    @change="setSelectedUser"
                  >
                    <template #item="data">
                      <v-list-item-avatar color="primary">
                        <span
                          class="white--text headline"
                          v-text="getInitials(data.item)"
                        />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title v-text="data.item.full_name" />
                        <v-list-item-subtitle
                          v-text="`C.C. ${data.item.document}`"
                        />
                      </v-list-item-content>
                    </template>
                    <template v-if="$vuetify.breakpoint.mdAndUp" #append-outer>
                      <v-btn
                        small
                        color="primary"
                        :loading="finding"
                        :disabled="finding"
                        type="submit"
                      >
                        <v-icon left>mdi-magnify</v-icon>
                        {{ $t('buttons.Search') }}
                      </v-btn>
                    </template>
                  </v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" sm="12">
                <v-btn
                  small
                  color="primary"
                  :loading="finding"
                  :disabled="finding"
                  type="submit"
                >
                  <v-icon left>mdi-magnify</v-icon>
                  {{ $t('buttons.Search') }}
                </v-btn>
              </v-col>
              <v-col
                v-if="selected_user && selected_user.id"
                cols="12"
                md="12"
                sm="12"
              >
                <p>{{ `${selected_user.full_name}` }}</p>
                <p>{{ `C.C. ${selected_user.document}` }}</p>
                <v-select
                  :loading="finding"
                  :readonly="finding"
                  name="stage"
                  item-text="title"
                  clearable
                  item-value="name"
                  multiple
                  autocomplete="off"
                  v-model="form.roles"
                  :items="roles_data"
                  prepend-icon="mdi-account"
                  menu-props="auto"
                  :label="$t('buttons.AssignRole')"
                ></v-select>
                <v-btn
                  small
                  color="primary"
                  :loading="finding"
                  :disabled="finding || !form.roles"
                  @click="setRole"
                >
                  <v-icon left>mdi-account</v-icon>
                  {{ $t('buttons.AssignRole') }}
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-col>
      <v-col cols="12">
        <base-material-card class="mt-12" icon="mdi-account">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                {{ $t('admin.users') }}
              </v-toolbar-title>
              <v-spacer />
              <time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="requested_at"
              />
              <v-menu offset-y left>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip left>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        :aria-label="$t('buttons.MoreOptions')"
                        icon
                        v-bind="attrs"
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.MoreOptions') }}</span>
                  </v-tooltip>
                </template>
                <v-list dense>
                  <v-list-item @click="getUsers">
                    <v-list-item-icon>
                      <v-icon>mdi-refresh</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Refresh') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <v-card-text>
            <v-skeleton-loader
              :loading="finding"
              type="list-item-avatar-two-line@10"
            >
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-expansion-panels>
                    <v-expansion-panel v-for="(user, i) in users" :key="i">
                      <v-expansion-panel-header>
                        {{ user.full_name }}
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12" sm="12">
                            C.C. {{ user.document }}
                          </v-col>
                          <v-col cols="12" sm="12">
                            E-mail: {{ user.email }}
                          </v-col>
                          <v-col cols="12">
                            <v-list>
                              <v-list-item
                                v-for="role in user.roles"
                                :key="`${role.id}-${user.id}`"
                              >
                                <v-list-item-content>
                                  <v-list-item-title v-text="role.title" />
                                  <v-list-item-subtitle v-text="'Rol'" />
                                </v-list-item-content>
                                <v-list-item-action v-if="canDeleteAction">
                                  <v-tooltip top>
                                    <template #activator="{ on: tooltip }">
                                      <v-icon
                                        color="error"
                                        v-on="tooltip"
                                        @click="onDelete([role.name], user.id)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </template>
                                    <i18n path="buttons.Delete" tag="span" />
                                  </v-tooltip>
                                </v-list-item-action>
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-skeleton-loader>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<router lang="yaml">
meta:
  title: AdminUsers
</router>

<script>
import _ from 'lodash'
import { Api } from '~/models/Api'
import { Admin } from '~/models/services/citizen/Admin'
import { Menu } from '~/models/services/citizen/Menu'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'AdminUsers',
  auth: 'auth',
  nuxtI18n: {
    paths: {
      en: '/user/admin',
      es: '/usuario/administracion',
    },
  },
  head: (vm) => ({
    title: vm.$t('titles.AdminUsers'),
  }),
  middleware: ['permissions'],
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    permissions(bouncer, to, from) {
      const service = new AbilityService()
      const manage = service.manage(service.models.USERS)
      const view = service.view(service.models.USERS)
      const create = service.create(service.models.USERS)
      const destroy = service.destroy(service.models.USERS)
      return (
        bouncer.can(create) ||
        bouncer.can(destroy) ||
        bouncer.can(view) ||
        bouncer.can(manage)
      )
    },
  },
  components: {
    BaseMaterialCard: () => import('~/components/base/MaterialCard'),
    TimeAgo: () => import('~/components/base/TimeAgo'),
  },
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    finding: false,
    form: new Admin(),
    users: [],
    roles_data: [],
    requested_at: null,
    search_user: null,
    people: [],
    selected_user: {},
  }),
  watch: {
    search_user(val) {
      return val && val.length > 3 && this.findUser(val)
    },
  },
  fetch() {
    this.getUsers()
    this.form
      .rolesData()
      .then((response) => {
        this.roles_data = response.data
      })
      .catch((errors) => {
        this.$snackbar({ message: errors.message })
      })
  },
  methods: {
    getUsers() {
      this.start()
      this.form
        .index()
        .then((response) => {
          this.users = response.data
          this.requested_at = response.requested_at
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    findUser(val) {
      this.start()
      this.form
        .findUser({ params: { username: val } })
        .then((response) => {
          this.people = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    setSelectedUser(item) {
      this.selected_user = item
    },
    getInitials(item) {
      return `${(item.name || '').charAt(0).toUpperCase()}${(item.surname || '')
        .charAt(0)
        .toUpperCase()}`
    },
    onDelete(roles, user) {
      this.start()
      this.form
        .retractRole(user, { params: { roles } })
        .then((response) => {
          this.$snackbar({ message: response.data, color: 'success' })
        })
        .then(() => this.getUsers())
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    setRole() {
      if (this.selected_user.id) {
        this.start()
        this.form
          .assignRole(this.selected_user.id)
          .then((response) => {
            this.$snackbar({ message: response.data, color: 'success' })
          })
          .then(() => this.getUsers())
          .catch((errors) => {
            this.$snackbar({ message: errors.message })
          })
          .finally(() => this.stop())
      } else {
        this.$snackbar({ message: 'Selecciona un rol para continuar.' })
      }
    },
    customFilter(item, queryText, itemText) {
      const text = _.toLower(queryText)
      return _.filter(item, function (object) {
        return _(object).some(function (string) {
          return _(string).toLower().includes(text)
        })
      })
    },
    // Loading
    start() {
      this.finding = true
    },
    stop() {
      this.finding = false
    },
  },
  computed: {
    canCreateAction() {
      return this.canManageOrCreate(this.ability_service.models.USERS)
    },
    canDeleteAction() {
      return this.canManageOrDestroy(this.ability_service.models.USERS)
    },
  },
}
</script>
