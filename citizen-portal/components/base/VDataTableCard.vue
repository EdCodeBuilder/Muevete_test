<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <v-material-card class="mt-12" :icon="cardIcon">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                <i18n v-if="cardTitleTranslate" :path="cardTitle" />
                <span v-else v-text="cardTitle" />
              </v-toolbar-title>
              <v-spacer />
              <v-time-ago
                :loading="loading"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="requested_at"
              />
              <v-menu offset-y left>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip left>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        :aria-label="$t('buttons.MoreOptions')"
                        icon
                        v-bind="attrs"
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.MoreOptions') }}</span>
                  </v-tooltip>
                </template>
                <v-list dense>
                  <v-list-item v-if="showCreateButton" @click="onCreate">
                    <v-list-item-icon>
                      <v-icon>mdi-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Create') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="showExcelButton" @click="onExcel">
                    <v-list-item-icon>
                      <v-icon>mdi-cloud-download</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Excel') }}
                    </v-list-item-title>
                  </v-list-item>
                  <slot name="toolbarActions" />
                  <v-list-item v-if="showRefreshButton" @click="getData">
                    <v-list-item-icon>
                      <v-icon>mdi-refresh</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Refresh') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <v-card-text v-if="$slots.beforeTable">
            <slot name="beforeTable" />
          </v-card-text>
          <v-card-text>
            <v-skeleton-loader
              ref="skeleton"
              :loading="loading"
              transition="scale-transition"
              type="table"
              class="mx-auto"
            >
              <v-data-table
                :options.sync="pagination"
                :items-per-page.sync="itemsPerPage"
                :server-items-length="total"
                :headers="headers"
                :show-expand="expanded && expanded.length > 0"
                :items="items"
                item-key="id"
                :hide-default-footer="$vuetify.breakpoint.mdAndUp"
                :footer-props="{
                  'items-per-page-options': itemsPerPageArray,
                  showFirstLastPage: true,
                }"
                @update:sort-by="getData"
                @update:sort-desc="getData"
              >
                <template #top>
                  <v-toolbar flat color="transparent">
                    <slot name="toolbarTablePrepend" />
                    <v-text-field
                      v-if="showSearchInput"
                      v-model="query"
                      append-icon="mdi-magnify"
                      clearable
                      :label="$t('label.find_by_any')"
                      persistent-hint
                      :hint="$t('helper.Find')"
                      @click:append="onSearch"
                      @click:clear="onClearSearch"
                    >
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <slot name="toolbarTableAppend" />
                    <v-tooltip v-if="showCreateButton" top>
                      <template #activator="{ on }">
                        <v-btn
                          :aria-label="$t('buttons.Create')"
                          color="primary"
                          class="mr-2 my-2 hidden-sm-and-down"
                          :loading="loading"
                          :disabled="loading"
                          fab
                          small
                          v-on="on"
                          @click="onCreate"
                        >
                          <v-icon color="white" dark>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <i18n path="buttons.Create" tag="span" />
                    </v-tooltip>
                    <v-tooltip v-if="showExcelButton" top>
                      <template #activator="{ on }">
                        <v-btn
                          :aria-label="$t('buttons.Excel')"
                          color="primary"
                          class="mr-2 my-2 hidden-sm-and-down"
                          :loading="loading"
                          :disabled="loading"
                          fab
                          small
                          v-on="on"
                          @click="onExcel"
                        >
                          <v-icon color="white" dark>mdi-cloud-download</v-icon>
                        </v-btn>
                      </template>
                      <i18n path="buttons.Excel" tag="span" />
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-btn
                          v-if="showRefreshButton"
                          :aria-label="$t('buttons.Refresh')"
                          color="primary"
                          class="mr-2 my-2 hidden-sm-and-down"
                          :loading="loading"
                          :disabled="loading"
                          fab
                          small
                          v-on="on"
                          @click="getData"
                        >
                          <v-icon color="white" dark>mdi-reload</v-icon>
                        </v-btn>
                      </template>
                      <i18n path="buttons.Refresh" tag="span" />
                    </v-tooltip>
                  </v-toolbar>
                </template>
                <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
                <template
                  v-for="(_, name) in $scopedSlots"
                  :slot="name"
                  slot-scope="slotData"
                >
                  <slot :name="name" v-bind="slotData" />
                </template>
                <template #[`item.actions`]="{ item }">
                  <template v-if="showActionsAsMenu">
                    <v-menu offset-y left>
                      <template #activator="{ on: menu, attrs }">
                        <v-tooltip left>
                          <template #activator="{ on: tooltip }">
                            <v-btn
                              :aria-label="$t('buttons.MoreOptions')"
                              icon
                              v-bind="attrs"
                              v-on="{ ...menu, ...tooltip }"
                            >
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('buttons.MoreOptions') }}</span>
                        </v-tooltip>
                      </template>
                      <v-list dense>
                        <v-list-item
                          v-if="showUpdateButton"
                          @click="onUpdate(item)"
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t('buttons.Update') }}
                          </v-list-item-title>
                        </v-list-item>
                        <slot name="actionsMenu" :item="item" />
                        <v-list-item
                          v-if="showHistoryButton"
                          @click="onHistory(item)"
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-history</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t('buttons.History') }}
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="showDeleteButton"
                          @click="onDelete(item)"
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-close</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t('buttons.Delete') }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                  <template v-else>
                    <slot name="actionsButtons" />
                    <v-tooltip v-if="showHistoryButton" top>
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
                    <v-tooltip v-if="showUpdateButton" top>
                      <template #activator="{ on }">
                        <v-btn
                          :aria-label="$t('buttons.Update')"
                          icon
                          color="warning"
                          v-on="on"
                          @click="onUpdate(item)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <i18n path="buttons.Update" tag="span" />
                    </v-tooltip>
                    <v-tooltip v-if="showDeleteButton" top>
                      <template #activator="{ on }">
                        <v-btn
                          :aria-label="$t('buttons.Delete')"
                          icon
                          color="red"
                          v-on="on"
                          @click="onDelete(item)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <i18n path="buttons.Delete" tag="span" />
                    </v-tooltip>
                  </template>
                </template>
                <template
                  v-if="customExpanded"
                  #expanded-item="{ headers, item }"
                >
                  <td :colspan="headers.length" width="100%">
                    <slot
                      name="customExpanded"
                      :item="item"
                      :expanded="expanded"
                    />
                  </td>
                </template>
                <template v-else #expanded-item="{ headers: data, item }">
                  <td :colspan="data.length" width="100%">
                    <v-row
                      v-for="(expanded_item, key) in expanded"
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
                <template #footer>
                  <div class="v-data-footer hidden-sm-and-down">
                    <div class="v-data-footer__select">
                      {{ $t('$vuetify.dataFooter.itemsPerPageText') }}
                      <v-select
                        v-model.number="itemsPerPage"
                        :items="itemsPerPageArray"
                        hide-details
                      />
                    </div>
                    <v-pagination
                      v-model="page"
                      :length="pageCount"
                      class="v-data-footer__icons-before"
                      circle
                      :total-visible="7"
                    />
                  </div>
                </template>
              </v-data-table>
            </v-skeleton-loader>
          </v-card-text>
          <v-card-text v-if="$slots.afterTable">
            <slot name="afterTable" />
          </v-card-text>
        </v-material-card>
      </v-col>
    </v-row>
    <slot name="dialogs" />
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
                      <v-list-item-subtitle v-text="audit.ip" />
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
      <v-empty-state v-else icon="mdi-history" :label="$t('label.no_data')" />
    </v-check-dialog>
    <v-check-dialog
      ref="formDialog"
      toolbar-color="primary"
      :use-trans="cardTitleTranslate"
      :title="cardTitle"
      :show-btn="false"
      width="500"
    >
      <slot name="form" :model="form" />
    </v-check-dialog>
    <v-check-dialog ref="confirmDialog">
      {{ $t('confirm.delete') }}
    </v-check-dialog>
  </v-container>
</template>

<script>
import { sync } from 'vuex-pathify'
import FileSaver from 'file-saver'
import Base64ToBlob from '~/utils/Base64ToBlob'
import Request from '~/utils/Request'
import { Arrow } from '~/plugins/Arrow'
import { Model } from '~/models/Model'

export default {
  name: 'VDataTableCard',
  components: {
    VMaterialCard: () => import('@/components/base/MaterialCard'),
    VCheckDialog: () => import('@/components/base/VCheckDialog'),
    VTimeAgo: () => import('@/components/base/TimeAgo'),
    VUserAgent: () => import('~/components/base/VUserAgent'),
    VEmptyState: () => import('~/components/base/EmptyState'),
  },
  props: {
    storagePath: {
      type: String,
      required: true,
    },
    model: {
      type: Object,
      required: true,
      validator(model) {
        return model instanceof Model
      },
    },
    cardIcon: {
      type: String,
      default: 'mdi-card-text-outline',
    },
    cardTitle: {
      type: String,
      default: 'titles.Data',
    },
    cardTitleTranslate: {
      type: Boolean,
      default: true,
    },
    showCreateButton: {
      type: Boolean,
      default: true,
    },
    showExcelButton: {
      type: Boolean,
      default: true,
    },
    showRefreshButton: {
      type: Boolean,
      default: true,
    },
    showUpdateButton: {
      type: Boolean,
      default: true,
    },
    showHistoryButton: {
      type: Boolean,
      default: true,
    },
    showDeleteButton: {
      type: Boolean,
      default: true,
    },
    showSearchInput: {
      type: Boolean,
      default: true,
    },
    showActionsAsMenu: {
      type: Boolean,
      default: false,
    },
    customExpanded: {
      type: Boolean,
      default: false,
    },
    perPage: {
      type: Number,
      default: 10,
      validator(value) {
        return parseInt(value) > 0 && parseInt(value) < 101
      },
    },
    itemsPerPageArray: {
      type: Array,
      default: () => [10, 30, 30, 50, 100],
      validator(array) {
        return array.some(
          (value) => parseInt(value) > 0 && parseInt(value) < 101
        )
      },
    },
    additionalParams: {
      type: Object,
      default: () => ({}),
    },
    indexMethod: {
      type: String,
      default: 'index',
    },
    updateMethod: {
      type: String,
      default: 'update',
    },
    createMethod: {
      type: String,
      default: 'store',
    },
    excelMethod: {
      type: String,
      default: 'excel',
    },
    destroyMethod: {
      type: String,
      default: 'destroy',
    },
  },
  created() {
    this.form = this.model
    this.updateRoute(this.page)
  },
  computed: {
    requested_at: sync(`portal/:storagePath@requested_at`),
    total: sync(`portal/:storagePath@total`),
    pagination: sync(`portal/:storagePath@pagination`),
    page: sync(`portal/:storagePath@pagination.page`),
    itemsPerPage: sync(`portal/:storagePath@itemsPerPage`),
    items: sync(`portal/:storagePath@items`),
    params: sync(`portal/:storagePath@params`),
    query: sync(`portal/:storagePath@params.query`),
    headers: sync(`portal/:storagePath@headers`),
    expanded: sync(`portal/:storagePath@expanded`),
    pageCount: sync(`portal/:storagePath@pageCount`),
  },
  watch: {
    additionalParams() {
      this.page = 1
    },
    page(newVal, oldVal) {
      this.updateRoute(newVal)
      this.fromStorage(newVal)
    },
    itemsPerPage(newVal, oldVal) {
      this.page = 1
      this.fromStorage(this.page)
    },
  },
  data: () => ({
    arrow: new Arrow(window, window.document, 'primary'),
    loading: false,
    form: null,
    originalmodel: {},
    timeOut: null,
    history: [],
  }),
  methods: {
    updateRoute(page) {
      this.$router
        .replace({
          query: { page },
        })
        .catch(() => {
          console.log('Replaced')
        })
    },
    fromStorage(page) {
      const pages = page !== parseInt(this.$route.params.page)
      if (pages || this.items.length < 1) {
        this.getData()
      }
    },
    getData() {
      this.start()
      this.params = {
        query: this.query,
        per_page: this.itemsPerPage,
        page: this.page,
        column: this.pagination.sortBy,
        order: this.pagination.sortDesc,
        ...this.additionalParams,
      }
      this.form[this.indexMethod]({ params: this.params })
        .then((response) => {
          this.items = response.data
          this.total = response.meta.total
          this.pageCount = response.meta.last_page
          this.headers = response.details.headers
          this.expanded = response.details.expanded || []
          this.requested_at = response.requested_at
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.stop()
        })
    },
    onExcel() {
      this.start()
      const params = {
        query: this.query,
        ...this.additionalParams,
      }
      const request = new Request(params)
      if (!request.anyFilled(request.keys())) {
        params.start_date = this.$moment().startOf('month').format('YYYY-MM-DD')
        params.final_date = this.$moment().endOf('month').format('YYYY-MM-DD')
      }
      this.form[this.excelMethod]({ params })
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
          this.stop()
        })
    },
    onSearch() {
      this.page = 1
      this.getData()
    },
    onClearSearch() {
      const that = this
      this.timeOut = setTimeout(function () {
        that.page = 1
        that.getData()
      }, 200)
    },
    onDelete(item) {
      this.$refs.confirmDialog.open().then(() => {
        if (item.id) {
          this.start()
          this.form[this.destroyMethod](item.id)
            .then((response) => {
              this.$snackbar({
                message: response.data,
                color: 'success',
              })
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message })
            })
            .finally(() => {
              this.stop()
              this.getData()
            })
        }
      })
    },
    onClose() {
      this.getData()
      this.$refs.formDialog.close()
    },
    onCreate() {
      this.form = this.model
      this.$refs.formDialog.open()
    },
    onUpdate(item) {
      this.form = this.model.clone(item)
      this.$refs.formDialog.open().catch(() => {
        this.form = this.model
      })
    },
    onHistory(item) {
      this.history = item.audits || []
      this.$refs.historyDialog.open().catch(() => {
        this.history = []
      })
    },
    refresh() {
      this.onClose()
    },
    start() {
      this.loading = true
    },
    stop() {
      this.loading = false
    },
  },
  beforeDestroy() {
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
  },
}
</script>
