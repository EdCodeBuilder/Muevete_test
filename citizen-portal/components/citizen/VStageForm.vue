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
            :rules="form.validations.input_number"
            vid="name"
            :name="$t('form.park').toLowerCase()"
          >
            <v-autocomplete
              v-model.number="form.park_id"
              :items="items"
              :loading="loading"
              :filter="customFilterPark"
              clearable
              :label="$t('form.park')"
              :hint="$t('inputs.SearchPark')"
              persistent-hint
              :search-input.sync="search"
              item-text="name"
              item-value="id"
              class="mt-1"
              prepend-icon="mdi-magnify"
              hide-details
              :error-messages="errors"
            >
              <template #item="{ item }">
                <v-list-item-avatar>
                  <v-avatar :color="item.color">
                    <v-icon dark>mdi-pine-tree</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" />
                  <v-list-item-subtitle v-text="item.code" />
                </v-list-item-content>
              </template>
            </v-autocomplete>
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
import _ from 'lodash'
import { Stage } from '~/models/services/citizen/Stage'
import { Park } from '~/models/services/citizen/Park'
export default {
  name: 'VStageForm',
  props: {
    formData: {
      type: Object,
      default: () => ({
        id: undefined,
        name: null,
        park_id: null,
      }),
    },
  },
  created() {
    if (this.formData.id) {
      this.form = new Stage(this.formData)
      if (this.formData.park_id) {
        this.findParkById(this.formData.park_id)
      }
    }
  },
  mounted() {
    this.form.setFormInstance(this.$refs.form)
  },
  data: () => ({
    loading: false,
    form: new Stage(),
    park: new Park(),
    search: null,
    items: [],
  }),
  watch: {
    formData(val) {
      if (val.id) {
        this.form = new Stage(val)
        if (val.park_id) {
          this.findParkById(val.park_id)
        }
      } else {
        this.form = new Stage()
      }
    },
    search(val) {
      return val && val.length > 3 && this.findPark()
    },
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
    findParkById(id) {
      this.loading = true
      const params = {
        where: id,
        per_page: 30,
      }
      this.park
        .index({ params })
        .then((response) => {
          this.items = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
    findPark: _.debounce(function () {
      this.loading = true
      const params = {
        query: this.search,
        per_page: 30,
      }
      this.park
        .index({ params })
        .then((response) => {
          this.items = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    }, 300),
    customFilterPark(item, queryText, itemText) {
      const text = _.toLower(queryText)
      return _.filter(item, function (object) {
        return _(object).some(function (string) {
          return _(string).toLower().includes(text)
        })
      })
    },
  },
}
</script>
