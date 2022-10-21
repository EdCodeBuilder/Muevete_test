<template>
  <validation-observer ref="form" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <v-row>
        <!-- Program -->
        <v-col cols="12" sm="12" md="12">
          <v-select
            v-model="form.program_id"
            :items="programs"
            :loading="loading"
            clearable
            :label="$t('form.program')"
            :hint="$t('label.find_by_name')"
            persistent-hint
            item-text="name"
            item-value="id"
            multiple
            class="mt-1"
            prepend-icon="mdi-magnify"
            hide-details
          />
        </v-col>
        <!-- Activity -->
        <v-col cols="12" sm="12" md="12">
          <v-autocomplete
            v-model="form.activity_id"
            :items="activities"
            :loading="loading"
            clearable
            multiple
            :label="$t('form.activity')"
            :hint="$t('label.find_by_name')"
            persistent-hint
            :search-input.sync="searchActivity"
            item-text="name"
            item-value="id"
            class="mt-1"
            prepend-icon="mdi-magnify"
            hide-details
          />
        </v-col>
        <!-- Stage -->
        <v-col cols="12" sm="12" md="12">
          <v-autocomplete
            v-model="form.stage_id"
            :items="stages"
            :loading="loading"
            clearable
            multiple
            :label="$t('form.stage')"
            :hint="$t('label.find_by_name')"
            persistent-hint
            :search-input.sync="searchStage"
            item-text="name"
            item-value="id"
            class="mt-1"
            prepend-icon="mdi-magnify"
            hide-details
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
        </v-col>
        <!-- WeekDay -->
        <v-col cols="12" sm="12" md="12">
          <v-select
            v-model="form.weekday_id"
            :items="weekdays"
            :loading="loading"
            clearable
            multiple
            :label="$t('form.weekday')"
            :hint="$t('label.find_by_name')"
            persistent-hint
            item-text="name"
            item-value="id"
            class="mt-1"
            prepend-icon="mdi-magnify"
            hide-details
          />
        </v-col>
        <!-- Hour -->
        <v-col cols="12" sm="12" md="12">
          <v-select
            v-model="form.daily_id"
            :items="hours"
            :loading="loading"
            clearable
            multiple
            :label="$t('form.daily')"
            :hint="$t('label.find_by_name')"
            persistent-hint
            item-text="name"
            item-value="id"
            class="mt-1"
            prepend-icon="mdi-magnify"
            hide-details
          />
        </v-col>
        <!-- Start Date -->
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
                :label="$t('form.start_date')"
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
        <!-- Final Date -->
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
                :label="$t('form.final_date')"
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
  name: 'VScheduleFilter',
  mounted() {
    this.form.setFormInstance(this.$refs.form)
  },
  data: () => ({
    start_date_dialog: false,
    final_date_dialog: false,
    loading: false,
    form: new Schedule({
      program_id: [],
      activity_id: [],
      stage_id: [],
      weekday_id: [],
      daily_id: [],
      start_date: null,
      final_date: null,
    }),
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
    onSubmit() {
      this.$emit('submit', this.form.data())
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
