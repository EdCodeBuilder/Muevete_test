<template>
  <validation-observer ref="form" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <v-row>
        <!-- Program -->
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number"
            vid="name"
            :name="$t('form.program').toLowerCase()"
          >
            <v-select
              v-model.number="form.program_id"
              :items="programs"
              :loading="loading"
              clearable
              :label="$t('form.program')"
              :hint="$t('label.find_by_name')"
              persistent-hint
              item-text="name"
              item-value="id"
              class="mt-1"
              prepend-icon="mdi-magnify"
              hide-details
              :error-messages="errors"
            />
          </validation-provider>
        </v-col>
        <!-- Activity -->
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number"
            vid="name"
            :name="$t('form.activity').toLowerCase()"
          >
            <v-autocomplete
              v-model.number="form.activity_id"
              :items="activities"
              :loading="loading"
              clearable
              :label="$t('form.activity')"
              :hint="$t('label.find_by_name')"
              persistent-hint
              :search-input.sync="searchActivity"
              item-text="name"
              item-value="id"
              class="mt-1"
              prepend-icon="mdi-magnify"
              hide-details
              :error-messages="errors"
            />
          </validation-provider>
        </v-col>
        <!-- Stage -->
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number"
            vid="name"
            :name="$t('form.stage').toLowerCase()"
          >
            <v-autocomplete
              v-model.number="form.stage_id"
              :items="stages"
              :loading="loading"
              clearable
              :label="$t('form.stage')"
              :hint="$t('label.find_by_name')"
              persistent-hint
              :search-input.sync="searchStage"
              item-text="name"
              item-value="id"
              class="mt-1"
              prepend-icon="mdi-magnify"
              hide-details
              :error-messages="errors"
            >
              <template #item="{ item }">
                <v-list-item-avatar>
                  <v-avatar>
                    <v-icon dark>mdi-pine-tree</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" />
                  <v-list-item-subtitle
                    v-if="item.park_name"
                    v-text="`${item.park_code} - ${item.park_name}`"
                  />
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </validation-provider>
        </v-col>
        <!-- WeekDay -->
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number"
            vid="name"
            :name="$t('form.weekday').toLowerCase()"
          >
            <v-select
              v-model.number="form.weekday_id"
              :items="weekdays"
              :loading="loading"
              clearable
              :label="$t('form.weekday')"
              :hint="$t('label.find_by_name')"
              persistent-hint
              item-text="name"
              item-value="id"
              class="mt-1"
              prepend-icon="mdi-magnify"
              hide-details
              :error-messages="errors"
            />
          </validation-provider>
        </v-col>
        <!-- Hour -->
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number"
            vid="name"
            :name="$t('form.daily').toLowerCase()"
          >
            <v-select
              v-model.number="form.daily_id"
              :items="hours"
              :loading="loading"
              clearable
              :label="$t('form.daily')"
              :hint="$t('label.find_by_name')"
              persistent-hint
              item-text="name"
              item-value="id"
              class="mt-1"
              prepend-icon="mdi-magnify"
              hide-details
              :error-messages="errors"
            />
          </validation-provider>
        </v-col>
        <!-- Min Age -->
        <v-col cols="12" md="6" sm="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number_required_between(0, 100)"
            vid="min_age"
            :name="$t('form.min_age').toLowerCase()"
          >
            <v-text-field
              id="min_age"
              type="tel"
              v-model.number="form.min_age"
              v-number-only
              name="min_age"
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
            vid="max_age"
            :name="$t('form.max_age').toLowerCase()"
          >
            <v-text-field
              id="max_age"
              type="tel"
              v-model.number="form.max_age"
              v-number-only
              name="max_age"
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
        <!-- Quota -->
        <v-col cols="12" md="12" sm="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_number_required"
            vid="quota"
            :name="$t('form.quota').toLowerCase()"
          >
            <v-text-field
              id="quota"
              type="tel"
              v-model.number="form.quota"
              v-number-only
              name="quota"
              :loading="loading"
              :readonly="loading"
              :error-messages="errors"
              color="primary"
              :label="$t('form.quota')"
              counter
              :maxlength="9"
              autocomplete="off"
              required="required"
              clearable
              prepend-icon="mdi-numeric"
            />
          </validation-provider>
        </v-col>
        <!-- Start Date -->
        <v-col cols="12" md="12" sm="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_date_after('start_date')"
            vid="start_date"
            :name="$t('form.start_date').toLowerCase()"
          >
            <v-date-time-picker
              v-model="start_date"
              :label="$t('form.start_date')"
              :text-field-props="{
                id: 'start_date',
                name: 'start_date',
                errorMessages: errors,
                clearable: true,
              }"
              :date-picker-props="{
                locale: $i18n.locale,
                max: $moment(form.final_date).isValid()
                  ? $moment(form.final_date).format('YYYY-MM-DD')
                  : '',
              }"
              :loading="loading"
              :disabled="loading"
            />
          </validation-provider>
        </v-col>
        <!-- Final Date -->
        <v-col cols="12" sm="12" md="12">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_date_after('start_date')"
            vid="final_date"
            :name="$t('form.final_date').toLowerCase()"
          >
            <v-date-time-picker
              v-model="final_date"
              :label="$t('form.final_date')"
              :text-field-props="{
                id: 'final_date',
                name: 'final_date',
                errorMessages: errors,
                clearable: true,
              }"
              :date-picker-props="{
                locale: $i18n.locale,
                min: $moment(form.start_date).isValid()
                  ? $moment(form.start_date).format('YYYY-MM-DD')
                  : '',
              }"
              :loading="loading"
              :disabled="loading"
            />
          </validation-provider>
        </v-col>
        <!-- Is Paid -->
        <v-col cols="12" sm="12" md="6">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.required"
            vid="is_paid"
            :name="$t('form.is_paid').toLowerCase()"
          >
            <v-switch
              id="is_paid"
              v-model="form.is_paid"
              name="is_paid"
              :loading="loading"
              :readonly="loading"
              :error-messages="errors"
              :label="$t('form.is_paid')"
            />
          </validation-provider>
        </v-col>
        <!-- Is Activated -->
        <v-col cols="12" sm="12" md="6">
          <validation-provider
            v-slot="{ errors }"
            :rules="form.validations.required"
            vid="is_activated"
            :name="$t('form.is_activated').toLowerCase()"
          >
            <v-switch
              id="is_activated"
              v-model="form.is_activated"
              name="is_activated"
              :loading="loading"
              :readonly="loading"
              :error-messages="errors"
              :label="$t('form.is_activated')"
            />
          </validation-provider>
        </v-col>
        <!-- Submit -->
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
import { Schedule } from '~/models/services/citizen/Schedule'
import { Program } from '~/models/services/citizen/Program'
import { Activity } from '~/models/services/citizen/Activity'
import { Stage } from '~/models/services/citizen/Stage'
import { WeekDay } from '~/models/services/citizen/WeekDay'
import { DailyHour } from '~/models/services/citizen/DailyHour'
export default {
  name: 'VScheduleForm',
  components: {
    VDateTimePicker: () => import('@/components/base/VDateTimePicker'),
  },
  props: {
    formData: {
      type: Object,
      default: () => ({
        id: undefined,
        ...new Schedule().data(),
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
  created() {
    if (this.formData.id) {
      this.setForm(this.formData)
    }
  },
  mounted() {
    this.form.setFormInstance(this.$refs.form)
  },
  data: () => ({
    loading: false,
    start_date: null,
    final_date: null,
    form: new Schedule(),
    // Selects
    program: new Program(),
    programs: [],
    activity: new Activity(),
    activities: [],
    searchActivity: null,
    stage: new Stage(),
    stages: [],
    searchStage: null,
    weekday: new WeekDay(),
    weekdays: [],
    hour: new DailyHour(),
    hours: [],
  }),
  watch: {
    formData(val) {
      if (val.id) {
        this.setForm(val)
      } else {
        this.form = new Schedule()
      }
    },
    start_date(val) {
      if (val) {
        this.form.start_date = this.$moment(val).isValid()
          ? this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
          : null
      } else {
        this.form.start_date = null
      }
    },
    final_date(val) {
      if (val) {
        this.form.final_date = this.$moment(val).isValid()
          ? this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
          : null
      } else {
        this.form.final_date = null
      }
    },
    searchActivity(val) {
      return val && val.length > 3 && this.findActivity()
    },
    searchStage(val) {
      return val && val.length > 3 && this.findStage()
    },
  },
  fetch() {
    this.getPrograms()
    this.getWeekDays()
    this.getHours()
  },
  methods: {
    setForm(formData) {
      const data = {
        id: null,
        ...new Schedule().data(),
      }
      Object.keys(formData).forEach(function (key) {
        if (key in data) {
          data[key] = formData[key]
        }
      })
      this.form = new Schedule(data)
      if (data.activity_id) {
        this.getActivity(data.activity_id)
      }
      if (data.stage_id) {
        this.getStage(data.stage_id)
      }
      this.start_date = this.$moment(this.form.start_date).isValid()
        ? this.$moment(this.form.start_date).toDate()
        : null
      this.final_date = this.$moment(this.form.final_date).isValid()
        ? this.$moment(this.form.final_date).toDate()
        : null
    },
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
    getActivity(id) {
      this.loading = true
      const params = {
        where: id,
        per_page: 30,
      }
      this.activity
        .index({ params })
        .then((response) => {
          this.activities = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
    getStage(id) {
      this.loading = true
      const params = {
        where: id,
        per_page: 30,
      }
      this.stage
        .index({ params })
        .then((response) => {
          this.stages = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
    getPrograms: _.debounce(function () {
      this.loading = true
      const params = {
        per_page: -1,
      }
      this.program
        .index({ params })
        .then((response) => {
          this.programs = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    }, 300),
    findActivity: _.debounce(function () {
      this.loading = true
      const params = {
        query: this.searchActivity,
        per_page: 30,
      }
      this.activity
        .index({ params })
        .then((response) => {
          this.activities = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    }, 300),
    findStage: _.debounce(function () {
      this.loading = true
      const params = {
        query: this.searchStage,
        per_page: 30,
      }
      this.stage
        .index({ params })
        .then((response) => {
          this.stages = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    }, 300),
    getWeekDays: _.debounce(function () {
      this.loading = true
      const params = {
        per_page: -1,
      }
      this.weekday
        .index({ params })
        .then((response) => {
          this.weekdays = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    }, 300),
    getHours: _.debounce(function () {
      this.loading = true
      const params = {
        per_page: 30,
      }
      this.hour
        .index({ params })
        .then((response) => {
          this.hours = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    }, 300),
    customFilter(item, queryText, itemText) {
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
