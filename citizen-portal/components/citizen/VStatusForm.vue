<template>
  <validation-observer ref="form" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number_required"
            vid="status_id"
            :name="$t('form.status').toLowerCase()"
          >
            <v-select
              id="status_id"
              v-model.number="form.status_id"
              name="status_id"
              :loading="loading"
              :readonly="loading"
              prepend-icon="mdi-checkbox-marked-circle-outline"
              :items="items"
              item-text="name"
              item-value="id"
              autocomplete="off"
              clearable
              :error-messages="errors"
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
          </validation-provider>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.text_required"
            vid="observation"
            :name="$t('form.observation').toLowerCase()"
          >
            <v-textarea
              id="observation"
              v-model="form.observation"
              name="observation"
              prepend-icon="mdi-text"
              autocomplete="off"
              clearable
              :error-messages="errors"
              :label="$t('form.observation')"
              :counter="2500"
              :maxlength="2500"
              required="required"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" md="12" sm="12" class="text-right">
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
import { Status } from '~/models/services/citizen/Status'
import { Profile } from '~/models/services/citizen/Profile'
export default {
  name: 'VStatusForm',
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    statusId: {
      type: [Number, String],
    },
    forProfile: {
      type: Boolean,
      default: true,
    },
    forSubscription: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    statusId(val) {
      if (val) {
        this.form.status_id = val
      } else {
        this.form.status_id = null
      }
    },
  },
  data: () => ({
    loading: false,
    form: new Profile({
      status_id: null,
      observation: null,
    }),
    status: new Status(),
    items: [],
  }),
  fetch() {
    this.getStatus()
  },
  created() {
    if (this.statusId) {
      this.form.status_id = this.statusId
    } else {
      this.form.status_id = null
    }
  },
  mounted() {
    this.form.setFormInstance(this.$refs.form)
  },
  methods: {
    onSubmit() {
      this.loading = true
      this.$nuxt.$loading.start()
      this.form.setFormInstance(this.$refs.form)
      this.form
        .assignStatus(this.id)
        .then((response) => {
          this.$snackbar({
            message: response.data,
            color: 'success',
          })
          this.$emit('success')
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
        for_profile: this.forProfile ? true : null,
        for_subscription: this.forSubscription ? true : null,
        column: 'name',
        where_not: 'PENDIENTE',
      }
      this.status
        .index({ params })
        .then((response) => {
          this.items = response.data
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
