<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <base-material-card class="mt-12" icon="mdi-security">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                {{ $t('inputs.Role') }}
              </v-toolbar-title>
              <v-spacer />
              <time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="requested_at"
              />
              <v-menu-actions :actions="role_menu" />
            </v-toolbar>
          </template>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="(role, i) in roles" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="role.title" />
                  <v-list-item-subtitle v-text="role.name" />
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu-actions :actions="role_menu_item" :item="role" />
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <base-material-card class="mt-12" icon="mdi-security">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                {{ $t('inputs.Permission') }}
              </v-toolbar-title>
              <v-spacer />
              <time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="requested_at"
              />
              <v-menu-actions :actions="permission_menu" />
            </v-toolbar>
          </template>
          <v-card-text>
            <v-text-field
              v-model="search_perms"
              :label="$t('buttons.Search')"
              type="search"
              prepend-icon="mdi-magnify"
              clearable
            />
            <v-list dense>
              <v-list-item
                v-for="(permission, i) in filterablePermissions"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="permission.title" />
                  <v-list-item-subtitle v-text="permission.name" />
                  <v-list-item-subtitle v-text="permission.entity_type" />
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu-actions
                    :actions="permission_menu_item"
                    :item="permission"
                  />
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <base-material-card class="mt-12" icon="mdi-security">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                {{ title }}
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
                  <v-list-item @click="$fetch">
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
            <v-autocomplete
              v-model="ability.role_id"
              :label="$t('inputs.Role')"
              clearable
              :items="roles"
              item-value="id"
              item-text="title"
              @change="getAbilities"
            >
              <template #item="data">
                <v-list-item-content>
                  <v-list-item-title v-text="data.item.title" />
                  <v-list-item-subtitle v-text="data.item.name" />
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-divider />
            <v-skeleton-loader
              v-if="abilities.length > 0 || ability.role_id"
              :loading="finding"
              type="list-item-avatar-three-line@6"
              width="100%"
            >
              <v-text-field
                v-model="search"
                :label="$t('buttons.Search')"
                type="search"
                prepend-icon="mdi-magnify"
                clearable
              />
              <v-list three-line>
                <v-list-item v-for="(key, i) in filterableData" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="key.title" />
                    <v-list-item-subtitle
                      class="font-weight-bold"
                      v-text="key.name"
                    />
                    <v-list-item-subtitle
                      class="font-weight-bold"
                      v-text="key.entity_type"
                    />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="onRetract(key)">
                      <v-icon color="error">mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <validation-observer
                      ref="dialogPermission"
                      v-slot="{ handleSubmit }"
                    >
                      <v-form @submit.prevent="handleSubmit(onSubmitAbility)">
                        <v-row>
                          <!-- Name -->
                          <v-col class="mx-auto" cols="12" sm="12" md="12">
                            <validation-provider
                              v-slot="{ errors }"
                              :rules="ability.validations.input_number_required"
                              vid="permission"
                              :name="$t('inputs.Permission').toLowerCase()"
                            >
                              <v-autocomplete
                                v-model="ability.permission_id"
                                :label="$t('inputs.Permission')"
                                clearable
                                :error-messages="errors"
                                :items="permissions"
                                item-value="id"
                                item-text="title"
                              >
                                <template #item="data">
                                  <v-list-item-content>
                                    <v-list-item-title
                                      v-text="data.item.title"
                                    />
                                    <v-list-item-subtitle
                                      v-text="data.item.name"
                                    />
                                    <v-list-item-subtitle
                                      v-text="data.item.entity_type"
                                    />
                                  </v-list-item-content>
                                </template>
                              </v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <!-- Submit -->
                          <v-col cols="12" md="12" sm="12" class="text-right">
                            <v-btn
                              :aria-label="$t(`buttons.Submit`)"
                              :loading="finding"
                              :disabled="finding"
                              type="submit"
                              color="primary"
                            >
                              {{ $t(`buttons.Submit`) }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-form>
                    </validation-observer>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-skeleton-loader>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
    <v-form-dialog
      ref="dialogForm"
      :title="$t('inputs.Role')"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :max-width="$vuetify.breakpoint.smAndDown ? undefined : 600"
      transition="dialog-bottom-transition"
      @click:close="onCloseRole"
    >
      <validation-observer ref="dialogFormModel" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onSubmitRole)">
          <v-row>
            <!-- Name -->
            <v-col class="mx-auto" cols="12" sm="12" md="12">
              <validation-provider
                v-slot="{ errors }"
                :rules="role.validations.input_alpha_dash_required"
                vid="name"
                :name="$t('inputs.Name').toLowerCase()"
              >
                <v-text-field
                  v-model="role.name"
                  v-lowercase
                  name="name"
                  :loading="finding"
                  :readonly="finding"
                  prepend-icon="mdi-text"
                  autocomplete="off"
                  clearable
                  :counter="191"
                  :maxlength="191"
                  :error-messages="errors"
                  :label="$t('inputs.Name')"
                />
              </validation-provider>
            </v-col>
            <!-- Title -->
            <v-col class="mx-auto" cols="12" sm="12" md="12">
              <validation-provider
                v-slot="{ errors }"
                :rules="role.validations.input_text_required"
                vid="title"
                :name="$t('inputs.Title').toLowerCase()"
              >
                <v-text-field
                  v-model="role.title"
                  name="title"
                  :loading="finding"
                  :readonly="finding"
                  prepend-icon="mdi-text"
                  autocomplete="off"
                  clearable
                  :counter="191"
                  :maxlength="191"
                  :error-messages="errors"
                  :label="$t('inputs.Title')"
                />
              </validation-provider>
            </v-col>
            <!-- Submit -->
            <v-col cols="12" md="12" sm="12" class="text-right">
              <v-btn
                text
                :aria-label="$t('buttons.Close')"
                color="primary"
                :loading="finding"
                :disabled="finding"
                @click="onCloseRole"
              >
                {{ $t('buttons.Close') }}
              </v-btn>
              <v-btn
                :aria-label="$t(`buttons.${role.id ? 'Update' : 'Submit'}`)"
                :loading="finding"
                :disabled="finding"
                type="submit"
                color="primary"
              >
                {{ $t(`buttons.${role.id ? 'Update' : 'Submit'}`) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </validation-observer>
    </v-form-dialog>
    <v-form-dialog
      ref="dialogPermissions"
      :title="$t('inputs.Permission')"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :max-width="$vuetify.breakpoint.smAndDown ? undefined : 600"
      transition="dialog-bottom-transition"
      @click:close="onClosePermission"
    >
      <validation-observer
        ref="dialogPermissionsFormModel"
        v-slot="{ handleSubmit }"
      >
        <v-form @submit.prevent="handleSubmit(onSubmitPermission)">
          <v-row>
            <!-- Entity -->
            <v-col class="mx-auto" cols="12" sm="12" md="12">
              <validation-provider>
                <v-select
                  v-model="permission.entity_type"
                  label="Entidades"
                  prepend-icon="mdi-text"
                  clearable
                  :items="models"
                  item-value="id"
                  item-text="name"
                >
                  <template #item="data">
                    <v-list-item-content>
                      <v-list-item-title v-text="data.item.name" />
                      <v-list-item-subtitle v-text="data.item.id" />
                    </v-list-item-content>
                  </template>
                  <template #append-outer>
                    <v-menu-actions
                      :disabled="!permission.entity_type"
                      :actions="generator_menu"
                      :item="{ id: permission.entity_type }"
                    />
                  </template>
                </v-select>
              </validation-provider>
            </v-col>
            <!-- Title -->
            <v-col class="mx-auto" cols="12" sm="12" md="12">
              <validation-provider
                v-slot="{ errors }"
                :rules="permission.validations.input_text_required"
                vid="title"
                :name="$t('inputs.Title').toLowerCase()"
              >
                <v-text-field
                  v-model="permission.title"
                  name="title"
                  :loading="finding"
                  :readonly="finding"
                  prepend-icon="mdi-text"
                  autocomplete="off"
                  clearable
                  :counter="191"
                  :maxlength="191"
                  :error-messages="errors"
                  :label="$t('inputs.Title')"
                />
              </validation-provider>
            </v-col>
            <!-- Name -->
            <v-col class="mx-auto" cols="12" sm="12" md="12">
              <validation-provider
                v-slot="{ errors }"
                :rules="permission.validations.input_alpha_dash_required_perms"
                vid="name"
                :name="$t('inputs.Name').toLowerCase()"
              >
                <v-text-field
                  v-model="permission.name"
                  v-lowercase
                  name="name"
                  :loading="finding"
                  :readonly="finding"
                  prepend-icon="mdi-text"
                  autocomplete="off"
                  clearable
                  :counter="191"
                  :maxlength="191"
                  :error-messages="errors"
                  :label="$t('inputs.Name')"
                />
              </validation-provider>
            </v-col>
            <!-- Submit -->
            <v-col cols="12" md="12" sm="12" class="text-right">
              <v-btn
                text
                :aria-label="$t('buttons.Close')"
                color="primary"
                :loading="finding"
                :disabled="finding"
                @click="onClosePermission"
              >
                {{ $t('buttons.Close') }}
              </v-btn>
              <v-btn
                :aria-label="
                  $t(`buttons.${permission.id ? 'Update' : 'Submit'}`)
                "
                :loading="finding"
                :disabled="finding"
                type="submit"
                color="primary"
              >
                {{ $t(`buttons.${permission.id ? 'Update' : 'Submit'}`) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </validation-observer>
    </v-form-dialog>
    <v-check-dialog ref="confirmDialog">
      {{ $t('confirm.delete') }}
    </v-check-dialog>
  </v-container>
</template>

<router lang="yaml">
meta:
  title: Security
</router>

<script>
import { Role } from '~/models/services/citizen/Role'
import { Permission } from '~/models/services/citizen/Permission'
import { Api } from '~/models/Api'
import { Menu } from '~/models/services/citizen/Menu'
import AbilityService from '~/models/services/citizen/AbilityService'

export default {
  name: 'RolesAndPermissions',
  nuxtI18n: {
    paths: {
      en: '/roles-and-permissions',
      es: '/roles-y-permisos',
    },
  },
  components: {
    VMenuActions: () => import('~/components/base/VMenuActions'),
    BaseMaterialCard: () => import('~/components/base/MaterialCard'),
    TimeAgo: () => import('~/components/base/TimeAgo'),
    VFormDialog: () => import('~/components/base/VFormDialog'),
    VCheckDialog: () => import('@/components/base/VCheckDialog'),
  },
  directives: {
    lowercase: {
      update(el) {
        el.getElementsByTagName('input')[0].value = (
          el.getElementsByTagName('input')[0].value || ''
        ).toLowerCase()
      },
    },
  },
  auth: 'auth',
  middleware: ['permissions'],
  meta: {
    permissionsUrl: Api.END_POINTS.CITIZEN_PERMISSIONS(),
    roles: new AbilityService().getRoot(),
  },
  head: (vm) => ({
    title: vm.$t('titles.Security'),
  }),
  created() {
    this.drawerModel = new Menu()
  },
  data: () => ({
    finding: false,
    requested_at: null,
    search: null,
    search_perms: null,
    role: new Role(),
    roles: [],
    abilities: [],
    permission: new Permission(),
    permissions: [],
    models: [],
    ability: new Role({
      role_id: null,
      permission_id: null,
    }),
  }),
  fetch() {
    this.getPermissions()
    this.getRoles()
    this.getModels()
  },
  computed: {
    filterableData() {
      if (!this.search) {
        return this.abilities
      } else {
        return this.abilities.filter((l) => {
          return (
            l.title.toLowerCase().includes(this.search.toLowerCase()) ||
            l.name.toLowerCase().includes(this.search.toLowerCase()) ||
            l.entity_type.toLowerCase().includes(this.search.toLowerCase())
          )
        })
      }
    },
    filterablePermissions() {
      if (!this.search_perms) {
        return this.permissions
      } else {
        return this.permissions.filter((l) => {
          return (
            l.title.toLowerCase().includes(this.search_perms.toLowerCase()) ||
            l.name.toLowerCase().includes(this.search_perms.toLowerCase()) ||
            l.entity_type
              .toLowerCase()
              .includes(this.search_perms.toLowerCase())
          )
        })
      }
    },
    permission_menu() {
      return [
        {
          icon: 'mdi-plus-circle-outline',
          name: this.$t('buttons.Create'),
          show: this.currentUserIsRoot,
          function: this.onCreatePermission,
          requireParams: undefined,
        },
        {
          icon: 'mdi-refresh',
          name: this.$t('buttons.Refresh'),
          show: true,
          function: this.$fetch,
          requireParams: undefined,
        },
      ]
    },
    permission_menu_item() {
      return [
        {
          icon: 'mdi-pencil',
          name: this.$t('buttons.Edit'),
          show: this.currentUserIsRoot,
          function: this.onUpdatePermissions,
          requireParams: true,
        },
        {
          icon: 'mdi-delete',
          name: this.$t('buttons.Delete'),
          show: this.currentUserIsRoot,
          function: this.onDeletePermissions,
          requireParams: true,
        },
      ]
    },
    role_menu() {
      return [
        {
          icon: 'mdi-plus-circle-outline',
          name: this.$t('buttons.Create'),
          show: this.currentUserIsRoot,
          function: this.onCreateRole,
          requireParams: undefined,
        },
        {
          icon: 'mdi-refresh',
          name: this.$t('buttons.Refresh'),
          show: true,
          function: this.getRoles,
          requireParams: undefined,
        },
      ]
    },
    role_menu_item() {
      return [
        {
          icon: 'mdi-pencil',
          name: this.$t('buttons.Edit'),
          show: this.currentUserIsRoot,
          function: this.onUpdateRole,
          requireParams: true,
        },
        {
          icon: 'mdi-delete',
          name: this.$t('buttons.Delete'),
          show: this.currentUserIsRoot,
          function: this.onDeleteRole,
          requireParams: true,
        },
      ]
    },
    generator_menu() {
      return [
        {
          icon: 'mdi-dots-horizontal',
          name: this.$t('buttons.View'),
          show: this.currentUserIsRoot,
          function: this.onGenerateName,
          requireParams: true,
          params: {
            action_name: 'view',
            action_title: this.$t('buttons.View'),
          },
        },
        {
          icon: 'mdi-dots-horizontal',
          name: this.$t('buttons.Management'),
          show: this.currentUserIsRoot,
          function: this.onGenerateName,
          requireParams: true,
          params: {
            action_name: 'manage',
            action_title: this.$t('buttons.Management'),
          },
        },
        {
          icon: 'mdi-dots-horizontal',
          name: this.$t('buttons.Create'),
          show: this.currentUserIsRoot,
          function: this.onGenerateName,
          requireParams: true,
          params: {
            action_name: 'create',
            action_title: this.$t('buttons.Create'),
          },
        },
        {
          icon: 'mdi-dots-horizontal',
          name: this.$t('buttons.Edit'),
          show: this.currentUserIsRoot,
          function: this.onGenerateName,
          requireParams: true,
          params: {
            action_name: 'update',
            action_title: this.$t('buttons.Edit'),
          },
        },
        {
          icon: 'mdi-dots-horizontal',
          name: this.$t('buttons.Delete'),
          show: this.currentUserIsRoot,
          function: this.onGenerateName,
          requireParams: true,
          params: {
            action_name: 'destroy',
            action_title: this.$t('buttons.Delete'),
          },
        },
        {
          icon: 'mdi-dots-horizontal',
          name: this.$t('buttons.ViewAudit'),
          show: this.currentUserIsRoot,
          function: this.onGenerateName,
          requireParams: true,
          params: {
            action_name: 'history',
            action_title: this.$t('buttons.ViewAudit'),
          },
        },
        {
          icon: 'mdi-dots-horizontal',
          name: this.$t('buttons.Custom'),
          show: this.currentUserIsRoot,
          function: this.onGenerateName,
          requireParams: true,
          params: {
            action_name: 'custom',
            action_title: '',
          },
        },
      ]
    },
    title() {
      return this.$t('titles.Security')
    },
  },
  methods: {
    // Roles
    getRoles() {
      this.start()
      this.role
        .index()
        .then((response) => {
          this.roles = response.data
          this.requested_at = response.requested_at
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onCreateRole() {
      this.$refs.dialogForm.open()
    },
    onDeleteRole(item) {
      this.$refs.confirmDialog.open().then(() => {
        if (item.id) {
          this.start()
          this.role
            .destroy(item.id)
            .then((response) => {
              this.$snackbar({
                message: response.data,
                color: 'success',
              })
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message })
            })
            .finally(() => {
              this.stop()
              this.getRoles()
            })
        }
      })
    },
    onUpdateRole(item) {
      this.role = new Role(item)
      this.$refs.dialogForm.open()
    },
    onSubmitRole() {
      this.start()
      this.role.setFormInstance(this.$refs.dialogFormModel)
      const request = this.role.id
        ? this.role.update(this.role.id)
        : this.role.store()
      request
        .then((response) => {
          this.$snackbar({
            message: response.data,
            color: 'success',
          })
          this.$refs.dialogForm.close().then(() => {
            this.onCloseRole()
          })
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.stop()
          this.getRoles()
        })
    },
    onCloseRole() {
      this.role = new Role()
    },
    // Permissions
    onDeletePermissions(item) {
      this.$refs.confirmDialog.open().then(() => {
        if (item.id) {
          this.start()
          this.permission
            .destroy(item.id)
            .then((response) => {
              this.$snackbar({
                message: response.data,
                color: 'success',
              })
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message })
            })
            .finally(() => {
              this.stop()
              this.getPermissions()
            })
        }
      })
    },
    onUpdatePermissions(item) {
      this.permission = new Permission(item)
      this.$refs.dialogPermissions.open()
    },
    getPermissions() {
      this.start()
      this.permission
        .index()
        .then((response) => {
          this.permissions = response.data
          this.requested_at = response.requested_at
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onCreatePermission() {
      this.$refs.dialogPermissions.open()
    },
    onSubmitPermission() {
      this.start()
      this.role.setFormInstance(this.$refs.dialogPermissionsFormModel)
      const request = this.permission.id
        ? this.permission.update(this.permission.id)
        : this.permission.store()
      request
        .then((response) => {
          this.$snackbar({
            message: response.data,
            color: 'success',
          })
          this.$refs.dialogPermissions.close().then(() => {
            this.onClosePermission()
          })
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.stop()
          this.getPermissions()
        })
    },
    onClosePermission() {
      this.permission = new Permission()
    },
    getAbilities(id) {
      if (id) {
        this.start()
        this.role
          .permissions(id)
          .then((response) => {
            this.abilities = response.data
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message })
          })
          .finally(() => {
            this.stop()
          })
      } else {
        this.ability.permission_id = null
        this.abilities = []
      }
    },
    onRetract(item) {
      this.$refs.confirmDialog.open().then(() => {
        if (item) {
          this.ability
            .retract(this.ability.role_id, item.id)
            .then((response) => {
              this.$snackbar({
                message: response.data,
                color: 'success',
              })
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message })
            })
            .finally(() => {
              this.getAbilities(this.ability.role_id)
            })
        }
      })
    },
    onSubmitAbility() {
      if (this.ability.permission_id) {
        this.ability
          .allow(this.ability.role_id, this.ability.permission_id)
          .then((response) => {
            this.$snackbar({
              message: response.data,
              color: 'success',
            })
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message })
          })
          .finally(() => {
            this.getAbilities(this.ability.role_id)
          })
      }
    },
    // Models
    getModels() {
      this.start()
      this.permission
        .entities()
        .then((response) => {
          this.models = response.data
          this.requested_at = response.requested_at
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onGenerateName(item) {
      const model = (item.id || '').split('\\').pop()
      const title = this.models.filter((m) => m.id === item.id)[0]
      const complete = `${item.action_title} ${title.name || ''.trim()}`.trim()
      const data = {
        title: `${complete} del Portal Ciudadano`,
        name: this.ability_service[item.action_name](model),
        entity_type: item.id,
      }
      this.permission = new Permission(data)
    },
    // Loader
    start() {
      this.finding = true
    },
    stop() {
      this.finding = false
    },
  },
}
</script>
