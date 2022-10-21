<template>
  <validation-observer ref="form" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <i18n path="excel.text" />
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-btn
            :arial-label="$t('excel.button')"
            :loading="loading"
            :disabled="loading"
            block
            outlined
            color="primary"
            @click="onExcel"
          >
            <i18n path="excel.button" />
          </v-btn>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.excel_file_required"
            vid="file"
            :name="$t('inputs.File').toLowerCase()"
          >
            <v-file-input
              id="file"
              v-model="form.file"
              name="file"
              :loading="loading"
              :disabled="loading"
              autocomplete="off"
              clearable
              :error-messages="errors"
              :label="$t('inputs.File')"
            />
          </validation-provider>
        </v-col>
        <v-col v-if="table.headers.length > 0" cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.required"
            vid="force"
            :name="$t('inputs.Force').toLowerCase()"
          >
            <v-switch
              id="force"
              v-model="form.force"
              name="force"
              :label="$t('inputs.Force')"
              :error-messages="errors"
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
        <v-col v-if="!!error" cols="12">
          <v-alert type="error">
            {{ error }}
          </v-alert>
        </v-col>
        <v-col v-if="errorsKeys.length > 0" cols="12">
          <i18n path="excel.validation" />
          <ul v-for="(k, i) in errorsKeys" :key="i">
            <li v-for="(val, j) in rows[k]" :key="`i-${j}`">
              {{ val }}
            </li>
          </ul>
        </v-col>
        <v-col v-if="table.headers.length > 0" cols="12">
          <i18n path="excel.continue" />
          <v-data-table
            show-expand
            :headers="table.headers"
            :items="items"
            item-key="id"
          >
            <template #[`item.is_activated`]="{ item }">
              <i18n :path="item.is_activated ? 'Yes' : 'No'" />
            </template>
            <template #[`item.is_paid`]="{ item }">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-icon
                    :color="item.is_paid ? 'primary' : ''"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{
                      item.is_paid ? 'mdi-currency-usd' : 'mdi-currency-usd-off'
                    }}
                  </v-icon>
                </template>
                <i18n :path="item.is_paid ? 'Yes' : 'No'" tag="span" />
              </v-tooltip>
            </template>
            <template #expanded-item="{ headers: data, item }">
              <td :colspan="data.length" width="100%">
                <v-row
                  v-for="(expanded_item, key) in table.expanded"
                  :key="`expanded-${key}`"
                >
                  <v-col cols="12" sm="12" md="6">
                    <div class="font-weight-bold">
                      {{ expanded_item.text }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    {{ item[expanded_item.value] }}
                  </v-col>
                </v-row>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-form>
  </validation-observer>
</template>

<script>
import { has } from 'lodash'
import FileSaver from 'file-saver'
import Base64ToBlob from '~/utils/Base64ToBlob'
import { Arrow } from '~/plugins/Arrow'
import { Schedule } from '~/models/services/citizen/Schedule'
export default {
  name: 'VScheduleMassiveForm',
  mounted() {
    this.form.setFormInstance(this.$refs.form)
  },
  data: () => ({
    arrow: new Arrow(window, window.document, 'primary'),
    loading: false,
    form: new Schedule({
      file: null,
      force: false,
    }),
    items: [],
    table: {
      headers: [],
      expanded: [],
    },
    error: null,
    rows: {},
  }),
  computed: {
    errorsKeys() {
      return Object.keys(this.rows)
    },
  },
  methods: {
    onSubmit() {
      this.table = {
        headers: [],
        expanded: [],
      }
      this.error = null
      this.loading = true
      this.$nuxt.$loading.start()
      this.form.setFormInstance(this.$refs.form)
      this.form
        .import()
        .then((response) => {
          this.$snackbar({
            message: response.data,
            color: 'success',
          })
          this.$emit('success')
        })
        .catch((errors) => {
          if (has(errors, 'details.table')) {
            this.items = errors.details.data
            this.table = errors.details.table
          }
          if (has(errors, 'message')) {
            this.error = errors.message
          }
          if (has(errors, 'errors')) {
            this.rows = errors.errors
          }
          this.$emit('errors', errors)
        })
        .finally(() => {
          this.loading = false
          this.$nuxt.$loading.finish()
        })
    },
    onExcel() {
      this.loading = true
      this.form
        .importTemplate()
        .then((response) => {
          FileSaver.saveAs(
            new Base64ToBlob(response.data.file).blob(),
            response.data.name
          )
        })
        .then(() => {
          this.arrow.show(6000)
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
