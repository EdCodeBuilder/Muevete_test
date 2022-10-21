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
      <v-row dense>
        <v-col v-for="item in items" :key="item.id" cols="12">
          <v-card>
            <v-card-text>
              <v-list min-width="100%">
                <v-list-item class="grow">
                  <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
                    <v-avatar>
                      <v-icon>mdi-account</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.user" />
                    <v-list-item-subtitle>
                      <v-time-ago :date-time="item.created_at" />
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action
                    v-if="showHistoryButton"
                    class="hidden-sm-and-down"
                  >
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-btn
                          :aria-label="$t('buttons.History')"
                          icon
                          color="info"
                          v-on="on"
                          @click="onHistory(item)"
                        >
                          <v-icon>mdi-history</v-icon>
                        </v-btn>
                      </template>
                      <i18n path="buttons.History" tag="span" />
                    </v-tooltip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <p class="caption mx-md-4" v-text="item.observation" />
            </v-card-text>
            <v-card-actions
              v-if="showHistoryButton && $vuetify.breakpoint.smAndDown"
            >
              <v-spacer />
              <v-btn
                :aria-label="$t('buttons.History')"
                outlined
                small
                color="info"
                @click="onHistory(item)"
              >
                <v-icon left>mdi-history</v-icon>
                <i18n path="buttons.History" tag="span" />
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-check-dialog
          ref="historyDialog"
          toolbar-color="primary"
          title="buttons.History"
          :show-btn="false"
          width="600"
        >
          <v-expansion-panels v-if="!!history.length">
            <v-expansion-panel v-for="(audit, i) in history" :key="i">
              <v-expansion-panel-header>
                <template #default>
                  {{ audit.type_trans }}
                  <v-spacer />
                  <v-time-ago
                    classes="caption"
                    :prefix="audit.event"
                    :date-time="audit.created_at"
                  />
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card flat color="transparent">
                  <v-card-title>
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-avatar>
                            <v-icon>mdi-account</v-icon>
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="audit.user" />
                          <v-list-item-subtitle>
                            <v-time-ago
                              :prefix="audit.event"
                              :date-time="audit.created_at"
                            />
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-title>
                  <v-card-text>
                    <i18n class="display-1" tag="h3" path="form.new_values" />
                    <v-json-pretty :data="audit.new_values" />
                  </v-card-text>
                  <v-divider />
                  <v-card-text>
                    <i18n class="display-1" tag="h3" path="form.old_values" />
                    <v-json-pretty :data="audit.old_values" />
                  </v-card-text>
                  <v-card-actions class="text-center">
                    <v-user-agent :user-agent="audit.user_agent" />
                  </v-card-actions>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-empty-state
            v-else
            icon="mdi-history"
            :label="$t('label.no_data')"
          />
        </v-check-dialog>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import { Observation } from '~/models/services/citizen/Observation'

export default {
  name: 'VObservations',
  components: {
    VTimeAgo: () => import('@/components/base/TimeAgo'),
    VCheckDialog: () => import('@/components/base/VCheckDialog'),
    VUserAgent: () => import('~/components/base/VUserAgent'),
    VEmptyState: () => import('~/components/base/EmptyState'),
  },
  props: {
    profileId: {
      type: [Number, String],
    },
    showHistoryButton: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    profileId(val) {
      this.form = new Observation(val)
      this.getObservations()
    },
    'pagination.page'() {
      return this.form && this.getObservations()
    },
    itemsPerPage() {
      return this.form && this.getObservations()
    },
  },
  data: (vm) => ({
    loading: false,
    form: new Observation(vm.profileId),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 30, 30, 50, 100],
    history: [],
  }),
  methods: {
    getObservations() {
      this.loading = true
      const params = {
        per_page: this.itemsPerPage,
        page: this.pagination.page,
      }
      this.form
        .index({ params })
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
    onHistory(item) {
      this.history = item.audits || []
      this.$refs.historyDialog.open().catch(() => {
        this.history = []
      })
    },
  },
}
</script>
