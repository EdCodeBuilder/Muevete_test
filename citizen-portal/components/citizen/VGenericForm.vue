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
import { Model } from '~/models/Model'

export default {
  name: 'VGenericForm',
  props: {
    model: {
      type: Object,
      required: true,
      validator(model) {
        return model instanceof Model
      },
    },
    primaryKey: {
      type: String,
      default: 'id',
    },
    updateMethod: {
      type: String,
      default: 'update',
    },
    createMethod: {
      type: String,
      default: 'store',
    },
  },
  created() {
    this.form = this.model
  },
  mounted() {
    this.form.setFormInstance(this.$refs.form)
  },
  data: () => ({
    loading: false,
    form: null,
  }),
  watch: {
    model(model) {
      this.form = model
    },
  },
  methods: {
    onSubmit() {
      this.loading = true
      this.$nuxt.$loading.start()
      this.form.setFormInstance(this.$refs.form)
      const request = this.form[this.primaryKey]
        ? this.form[this.updateMethod](this.form.id)
        : this.form[this.createMethod]()
      request
        .then((response) => {
          this.$snackbar({
            message: response.data,
            color: 'success',
          })
          this.$emit('success')
        })
        .catch((errors) => {
          this.$emit('error')
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
