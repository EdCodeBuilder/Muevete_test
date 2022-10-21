<template>
  <v-data-iterator
    :options.sync="pagination"
    :items-per-page.sync="itemsPerPage"
    :server-items-length="total"
    :items="items"
    item-key="id"
    :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
    :loading="loading"
  >
    <template #default="{ items }">
      <v-expansion-panels v-if="!!items.length">
        <v-expansion-panel v-for="(item, i) in items" :key="i">
          <v-expansion-panel-header>
            {{ item.activity_name }}
            <template #actions>
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-avatar
                    :color="item.schedule_status_color"
                    size="15"
                    v-on="on"
                  />
                </template>
                <span v-text="item.schedule_status_name" />
              </v-tooltip>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card flat color="transparent">
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="12" md="12">
                    <v-btn
                      text
                      block
                      color="primary"
                      :to="
                        localePath({
                          name: 'schedules-id-users',
                          params: { id: item.id },
                        })
                      "
                    >
                      <i18n path="titles.ViewActivitiesDetails" />
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-alert type="info" :color="item.schedule_status_color">
                      <span class="white--text font-weight-bold">
                        {{ item.schedule_status_name }}
                      </span>
                    </v-alert>
                    <v-btn
                      v-if="canAssignStatus"
                      text
                      block
                      small
                      color="primary"
                      :to="
                        localePath({
                          name: 'schedules-id-users-citizenId',
                          params: {
                            id: item.id,
                            citizenId: profileId,
                          },
                        })
                      "
                    >
                      <i18n path="titles.AssignStatusSign" />
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-time-ago
                              classes="caption"
                              :date-time="item.citizen_schedule_created_at"
                            />
                          </v-list-item-title>
                          <v-list-item-subtitle
                            v-text="$t('form.schedule_created_at')"
                          />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.program_name" />
                          <v-list-item-subtitle v-text="$t('form.program')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.activity_name" />
                          <v-list-item-subtitle v-text="$t('form.activity')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.stage_name" />
                          <v-list-item-subtitle v-text="$t('form.stage')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.park_code" />
                          <v-list-item-subtitle v-text="$t('form.park_code')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.park_name" />
                          <v-list-item-subtitle v-text="$t('form.park')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.park_address" />
                          <v-list-item-subtitle v-text="$t('form.address')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.weekday_name" />
                          <v-list-item-subtitle v-text="$t('form.weekday')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.daily_name" />
                          <v-list-item-subtitle v-text="$t('form.daily')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.start_date" />
                          <v-list-item-subtitle
                            v-text="$t('form.start_date')"
                          />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.final_date" />
                          <v-list-item-subtitle
                            v-text="$t('form.final_date')"
                          />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.min_age" />
                          <v-list-item-subtitle v-text="$t('form.min_age')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.max_age" />
                          <v-list-item-subtitle v-text="$t('form.max_age')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.is_paid ? $t('Yes') : $t('No')"
                          />
                          <v-list-item-subtitle v-text="$t('form.is_paid')" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.is_initiate ? $t('Yes') : $t('No')"
                          />
                          <v-list-item-subtitle
                            v-text="$t('form.is_initiate')"
                          />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.is_activated ? $t('Yes') : $t('No')"
                          />
                          <v-list-item-subtitle
                            v-text="$t('form.is_activated')"
                          />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.created_at" />
                          <v-list-item-subtitle
                            v-text="$t('form.created_at')"
                          />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-empty-state v-else icon="mdi-history" :label="$t('label.no_data')" />
    </template>
  </v-data-iterator>
</template>

<script>
import { Profile } from '~/models/services/citizen/Profile'

export default {
  name: 'VUserActivities',
  components: {
    VTimeAgo: () => import('@/components/base/TimeAgo'),
    VEmptyState: () => import('~/components/base/EmptyState'),
  },
  props: {
    profileId: {
      type: [Number, String],
    },
  },
  watch: {
    profileId() {
      this.getData()
    },
    'pagination.page'() {
      return this.form && this.getData()
    },
    itemsPerPage() {
      return this.form && this.getData()
    },
  },
  data: () => ({
    loading: false,
    form: new Profile(),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 30, 30, 50, 100],
  }),
  computed: {
    canAssignStatus() {
      return this.canMakeAction(
        'assign-status',
        this.ability_service.models.CITIZEN_SCHEDULES
      )
    },
  },
  methods: {
    getData() {
      this.loading = true
      const params = {
        per_page: this.itemsPerPage,
        page: this.pagination.page,
      }
      this.form
        .activities(this.profileId, { params })
        .then((response) => {
          this.items = response.data
          this.total = response.meta.total
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
