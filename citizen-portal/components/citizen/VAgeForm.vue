<template>
  <validation-observer ref="form" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_text_required"
            vid="name"
            :name="$t('inputs.Name').toLowerCase()"
          >
            <v-text-field
              id="name"
              v-model="form.name"
              name="name"
              :loading="loading"
              :readonly="loading"
              prepend-icon="mdi-text"
              autocomplete="off"
              clearable
              :error-messages="errors"
              :label="$t('inputs.Name')"
              :counter="191"
              :maxlength="191"
            />
          </validation-provider>
        </v-col>
        <!-- Min Age -->
        <v-col cols="12" md="6" sm="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number_required_between(0, 100)"
            vid="min"
            :name="$t('form.min_age').toLowerCase()"
          >
            <v-text-field
              id="min"
              type="tel"
              v-model.number="form.min"
              v-number-only
              name="min"
              :loading="loading"
              :readonly="loading"
              :error-messages="errors"
              color="primary"
              :label="$t('form.min_age')"
              counter
              :maxlength="3"
              autocomplete="off"
              required="required"
              clearable
              prepend-icon="mdi-numeric"
            />
          </validation-provider>
        </v-col>
        <!-- Max Age -->
        <v-col cols="12" md="6" sm="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number_required_between(0, 100)"
            vid="max"
            :name="$t('form.max_age').toLowerCase()"
          >
            <v-text-field
              id="max"
              type="tel"
              v-model.number="form.max"
              v-number-only
              name="max"
              :loading="loading"
              :readonly="loading"
              :error-messages="errors"
              color="primary"
              :label="$t('form.max_age')"
              counter
              :maxlength="3"
              autocomplete="off"
              required="required"
              clearable
              prepend-icon="mdi-numeric"
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
import { AgeGroup } from '~/models/services/citizen/AgeGroup'
export default {
  name: 'VAgeForm',
  props: {
    formData: {
      type: Object,
      default: () => ({
        id: undefined,
        name: null,
        min: null,
        max: null,
      }),
    },
  },
  directives: {
    'number-only': {
      bind(el) {
        function checkValue(event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, '')
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true
          }
          event.preventDefault()
        }
        el.addEventListener('keypress', checkValue)
      },
    },
  },
  watch: {
    formData: {
      handler(form) {
        this.form = new AgeGroup(form)
      },
      deep: true,
    },
  },
  data: () => ({
    loading: false,
    form: new AgeGroup(),
  }),
  created() {
    if (this.formData.id) {
      this.form = new AgeGroup(this.formData)
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
      const request = this.formData.id
        ? this.form.update(this.formData.id)
        : this.form.store()
      request
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
  },
}
</script>
