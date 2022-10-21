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
                <v-list-item @click="onDownload(item, false)">
                  <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
                    <v-avatar :color="item.color">
                      <v-icon dark>mdi-file</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.file" />
                    <v-list-item-subtitle v-text="item.file_type" />
                    <v-list-item-subtitle>
                      <v-avatar size="15" :color="item.color" left />
                      {{ item.status }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-time-ago :date-time="item.created_at" />
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action class="hidden-sm-and-down">
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
                        <v-list-item @click="onDownload(item, false)">
                          <v-list-item-icon>
                            <v-icon>mdi-eye</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t('buttons.View') }}
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="onDownload(item)">
                          <v-list-item-icon>
                            <v-icon>mdi-cloud-download</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t('buttons.Download') }}
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="showAssignButton"
                          @click="onAssign(item)"
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t('titles.AssignStatus') }}
                          </v-list-item-title>
                        </v-list-item>
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
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions
              v-if="$vuetify.breakpoint.smAndDown"
              class="text-center"
            >
              <v-menu offset-y left>
                <template #activator="{ on, attrs }">
                  <v-btn
                    :aria-label="$t('buttons.MoreOptions')"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left>mdi-dots-vertical</v-icon>
                    {{ $t('buttons.MoreOptions') }}
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="onDownload(item, false)">
                    <v-list-item-icon>
                      <v-icon>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.View') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="onDownload(item)">
                    <v-list-item-icon>
                      <v-icon>mdi-cloud-download</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Download') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="showAssignButton" @click="onAssign(item)">
                    <v-list-item-icon>
                      <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('titles.AssignStatus') }}
                    </v-list-item-title>
                  </v-list-item>
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
                  <v-list-item v-if="showDeleteButton" @click="onDelete(item)">
                    <v-list-item-icon>
                      <v-icon>mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Delete') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-check-dialog
          ref="statusDialog"
          toolbar-color="primary"
          title="titles.AssignStatus"
          :show-btn="false"
          width="600"
        >
          <v-status-file-form
            v-if="selectedFile.id"
            :id="selectedFile.id"
            :profile-id="profileId"
            :status-id="selectedFile.status_id"
            @success="onSuccess"
          />
        </v-check-dialog>
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
        <v-check-dialog
          ref="pdfDialog"
          :toolbar-color="selectedFile.color || 'primary'"
          :title="`${selectedFile.file} - ${page}/${numPages}`"
          :show-btn="false"
          width="100%"
          fullscreen
        >
          <v-card flat color="transparent" class="m-sm-0 p-sm-0">
            <v-card-title class="m-sm-0 p-sm-0">
              <v-toolbar dark color="black" class="text-center">
                <v-spacer class="hidden-sm-and-down" />
                <v-btn :disabled="page === 1" icon @click="page--">
                  <v-icon dark>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn icon @click="rotate += 90">
                  <v-icon dark>mdi-rotate-left</v-icon>
                </v-btn>
                <v-btn icon @click="rotate -= 90">
                  <v-icon dark>mdi-rotate-right</v-icon>
                </v-btn>
                <v-btn :disabled="page === numPages" icon @click="page++">
                  <v-icon dark>mdi-chevron-right</v-icon>
                </v-btn>
                <v-spacer class="hidden-sm-and-down" />
              </v-toolbar>
            </v-card-title>
            <v-card-text class="m-sm-0 p-sm-0">
              <div
                v-if="loadedRatio > 0"
                style="
                  background-color: green;
                  color: white;
                  text-align: center;
                "
                :style="{ width: loadedRatio * 100 + '%' }"
              >
                {{ Math.floor(loadedRatio * 100) }}%
              </div>
              <v-pdf
                v-if="selectedFile.id"
                ref="pdf"
                :src="selectedFile.src"
                :page="page"
                :rotate="rotate"
                @progress="loadedRatio = $event"
                @num-pages="numPages = $event"
                @error="onError"
              />
            </v-card-text>
          </v-card>
        </v-check-dialog>
        <v-check-dialog ref="confirmDialog">
          {{ $t('confirm.delete') }}
        </v-check-dialog>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import pdf from 'vue-pdf'
import FileSaver from 'file-saver'
import Base64ToBlob from '~/utils/Base64ToBlob'
import { Arrow } from '~/plugins/Arrow'
import { File } from '~/models/services/citizen/File'

export default {
  name: 'VAttachments',
  components: {
    VTimeAgo: () => import('@/components/base/TimeAgo'),
    VCheckDialog: () => import('@/components/base/VCheckDialog'),
    VUserAgent: () => import('~/components/base/VUserAgent'),
    VEmptyState: () => import('~/components/base/EmptyState'),
    VStatusFileForm: () => import('~/components/citizen/VStatusFileForm'),
    VPdf: pdf,
  },
  props: {
    profileId: {
      type: [Number, String],
    },
    showHistoryButton: {
      type: Boolean,
      default: true,
    },
    showAssignButton: {
      type: Boolean,
      default: true,
    },
    showDeleteButton: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    profileId(val) {
      this.form = new File(val)
      this.getData()
    },
    'pagination.page'() {
      return this.form && this.getData()
    },
    itemsPerPage() {
      return this.form && this.getData()
    },
  },
  data: (vm) => ({
    arrow: new Arrow(window, window.document, 'primary'),
    loading: false,
    form: new File(vm.profileId),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 30, 30, 50, 100],
    history: [],
    selectedFile: {},
    loadedRatio: 0,
    page: 1,
    numPages: 0,
    rotate: 0,
  }),
  methods: {
    getData() {
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
    onDownload(item, download = true) {
      this.loading = true
      this.form
        .download(this.profileId, item.id)
        .then((response) => {
          if (download) {
            FileSaver.saveAs(
              new Base64ToBlob(response.data.file).blob(),
              response.data.name
            )
          } else {
            this.page = 1
            this.rotate = 0
            this.selectedFile = {
              ...item,
              name: response.data.name,
              src: response.data.file,
            }
          }
        })
        .then(() => {
          if (download) {
            this.arrow.show(6000)
          } else {
            this.$refs.pdfDialog.open().catch(() => {
              this.selectedFile = {}
            })
          }
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onDelete(item) {
      this.$refs.confirmDialog.open().then(() => {
        if (item.id) {
          this.loading = true
          this.form
            .destroy(item.id)
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
              this.loading = true
              this.getData()
            })
        }
      })
    },
    onAssign(item) {
      const that = this
      this.selectedFile = {}
      this.$nextTick(function () {
        that.selectedFile = item
        that.$refs.statusDialog.open().catch(() => {
          that.selectedFile = {}
        })
      })
    },
    onError() {
      const message =
        'No se pudo cargar la previsualización del PDF, por favor intenta de nuevo o descarga el archivo.'
      this.$snackbar({ message })
    },
    onSuccess() {
      this.selectedItem = {}
      this.getData()
      this.$refs.statusDialog.close()
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
