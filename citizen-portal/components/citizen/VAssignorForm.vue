<template>
  <validation-observer ref="form" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number_required"
            vid="validator_id"
            :name="$t('form.validator').toLowerCase()"
          >
            <v-autocomplete
              id="validator_id"
              v-model.number="form.validator_id"
              name="validator_id"
              :loading="loading"
              :readonly="loading"
              prepend-icon="mdi-account-plus"
              :items="validators"
              item-text="full_name"
              item-value="id"
              autocomplete="off"
              clearable
              :error-messages="errors"
              :label="$t('form.validator')"
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
import { Admin } from '~/models/services/citizen/Admin'
import { Profile } from '~/models/services/citizen/Profile'
export default {
  name: 'VAssignorForm',
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    validatorId: {
      type: [Number, String],
    },
  },
  watch: {
    validatorId(val) {
      if (val) {
        this.form.validator_id = val
      } else {
        this.form.validator_id = null
      }
    },
  },
  data: () => ({
    loading: false,
    form: new Profile({
      validator_id: null,
    }),
    user: new Admin(),
    validators: [],
  }),
  fetch() {
    this.getValidators()
  },
  created() {
    if (this.validatorId) {
      this.form.validator_id = this.validatorId
    } else {
      this.form.validator_id = null
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
        .assignValidator(this.id)
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
  },
}
</script>
