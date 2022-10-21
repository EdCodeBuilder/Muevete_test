<template>
  <validation-observer ref="form" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            id="name"
            v-model="form.document"
            name="name"
            :loading="loading"
            :readonly="loading"
            prepend-icon="mdi-numeric"
            autocomplete="off"
            clearable
            :label="$t('inputs.Document')"
            :counter="191"
            :maxlength="191"
          />
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-autocomplete
            id="validator_id"
            v-model="form.validators_id"
            name="validator_id"
            :loading="loading"
            :readonly="loading"
            prepend-icon="mdi-account-plus"
            :items="validators"
            multiple
            item-text="full_name"
            item-value="id"
            autocomplete="off"
            clearable
            :label="$t('form.validator')"
          />
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-select
            id="status_id"
            v-model="form.status_id"
            name="status_id"
            :loading="loading"
            :readonly="loading"
            prepend-icon="mdi-checkbox-marked-circle-outline"
            :items="statuses"
            item-text="name"
            item-value="id"
            autocomplete="off"
            clearable
            multiple
            :label="$t('form.status')"
          >
            <template #item="{ item }">
              <v-list-item-avatar>
                <v-avatar size="15" :color="item.color" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name" />
              </v-list-item-content>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-select
            id="profile_type_id"
            v-model="form.profile_type_id"
            name="profile_type_id"
            :loading="loading"
            :readonly="loading"
            prepend-icon="mdi-human-male-female"
            :items="profiles"
            item-text="name"
            item-value="id"
            autocomplete="off"
            clearable
            multiple
            :label="$t('form.profile_type')"
          />
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-switch
            v-model="form.not_assigned"
            input-value="pending"
            true-value="pending"
            :false-value="null"
            :label="$t('form.not_assigned')"
          />
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-switch
            v-model="form.assigned"
            :false-value="null"
            true-value="assigned"
            input-value="assigned"
            :label="$t('form.assigned')"
          />
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-dialog
            ref="start_date_dialog"
            v-model="start_date_dialog"
            :return-value.sync="form.start_date"
            persistent
            width="290px"
          >
            <template #activator="{ on }">
              <v-text-field
                id="start_date"
                v-model="form.start_date"
                name="start_date"
                :loading="loading"
                :label="$t('form.start_date_filter')"
                prepend-icon="mdi-calendar"
                readonly
                color="primary"
                clearable
                autocomplete="off"
                required="required"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-if="start_date_dialog"
              ref="start_date"
              v-model="form.start_date"
              :locale="$i18n.locale"
              :max="form.final_date"
            >
              <v-spacer></v-spacer>
              <v-btn
                :aria-label="$t('buttons.Cancel')"
                text
                color="primary"
                @click="start_date_dialog = false"
              >
                {{ $t('buttons.Cancel') }}
              </v-btn>
              <v-btn
                aria-label="Ok"
                text
                color="primary"
                @click="$refs.start_date_dialog.save(form.start_date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-dialog
            ref="final_date_dialog"
            v-model="final_date_dialog"
            :return-value.sync="form.final_date"
            persistent
            width="290px"
          >
            <template #activator="{ on }">
              <v-text-field
                id="final_date"
                v-model="form.final_date"
                name="final_date"
                :loading="loading"
                :label="$t('form.final_date_filter')"
                prepend-icon="mdi-calendar"
                readonly
                color="primary"
                clearable
                autocomplete="off"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-if="final_date_dialog"
              ref="final_date"
              v-model="form.final_date"
              :locale="$i18n.locale"
              :min="form.start_date"
            >
              <v-spacer></v-spacer>
              <v-btn
                :aria-label="$t('buttons.Cancel')"
                text
                color="primary"
                @click="final_date_dialog = false"
              >
                {{ $t('buttons.Cancel') }}
              </v-btn>
              <v-btn
                aria-label="Ok"
                text
                color="primary"
                @click="$refs.final_date_dialog.save(form.final_date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="12" sm="12" class="text-right">
          <v-btn
            :aria-label="$t('buttons.Reset')"
            :disabled="loading"
            :loading="loading"
            outlined
            color="primary"
            type="reset"
            @click="onReset"
          >
            {{ $t('buttons.Reset') }}
          </v-btn>
          <v-btn
            :aria-label="$t('buttons.Submit')"
            :disabled="loading"
            :loading="loading"
            type="submit"
            color="primary"
          >
            {{ $t('buttons.Submit') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </validation-observer>
</template>

<script>
import { Admin } from '~/models/services/citizen/Admin'
import { Status } from '~/models/services/citizen/Status'
import { Profile } from '~/models/services/citizen/Profile'
import { ProfileType } from '~/models/services/citizen/ProfileType'
export default {
  name: 'VProfileFilter',
  data: () => ({
    start_date_dialog: false,
    final_date_dialog: false,
    loading: false,
    form: new Profile({
      document: null,
      validators_id: [],
      status_id: [],
      profile_type_id: [],
      not_assigned: null,
      assigned: null,
      start_date: null,
      final_date: null,
    }),
    user: new Admin(),
    validators: [],
    status: new Status(),
    statuses: [],
    profile: new ProfileType(),
    profiles: [],
  }),
  fetch() {
    this.getValidators()
    this.getStatus()
    this.getProfileTypes()
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.form.data())
    },
    onReset() {
      this.form.reset()
      this.$emit('submit', {})
    },
    getValidators() {
      this.loading = true
      this.$nuxt.$loading.start()
      this.user
        .validators()
        .then((response) => {
          this.validators = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
          this.$nuxt.$loading.finish()
        })
    },
    getStatus() {
      this.loading = true
      this.$nuxt.$loading.start()
      const params = {
        per_page: -1,
        for_profile: true,
      }
      this.status
        .index({ params })
        .then((response) => {
          this.statuses = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
          this.$nuxt.$loading.finish()
        })
    },
    getProfileTypes() {
      this.loading = true
      this.$nuxt.$loading.start()
      const params = {
        per_page: -1,
      }
      this.profile
        .index({ params })
        .then((response) => {
          this.profiles = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
          this.$nuxt.$loading.finish()
        })
    },
  },
}
</script>
