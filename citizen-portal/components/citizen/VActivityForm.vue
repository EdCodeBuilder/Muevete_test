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
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.required"
            vid="is_initiate"
            :name="$t('form.is_initiate').toLowerCase()"
          >
            <v-switch
              id="is_initiate"
              v-model="form.is_initiate"
              name="is_initiate"
              :loading="loading"
              :readonly="loading"
              :error-messages="errors"
              :label="$t('form.is_initiate')"
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
import { Activity } from '~/models/services/citizen/Activity'
export default {
  name: 'VActivityForm',
  props: {
    formData: {
      type: Object,
      default: () => ({
        id: undefined,
        name: null,
        is_initiate: false,
      }),
    },
  },
  data: () => ({
    loading: false,
    form: new Activity(),
  }),
  watch: {
    formData(val) {
      if (val.id) {
        this.form = new Activity(val)
      } else {
        this.form = new Activity()
      }
    },
  },
  created() {
    if (this.formData.id) {
      this.form = new Activity(this.formData)
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
