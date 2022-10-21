<template>
  <v-data-iterator
    :items="items"
    :items-per-page.sync="itemsPerPage"
    :options.sync="pagination"
    item-key="id"
    :server-items-length="total"
    :loading="finding"
    :footer-props="{
      'items-per-page-options': itemsPerPageArray,
    }"
  >
    <template #header>
      <v-toolbar flat>
        <v-toolbar-title>
          <i18n path="inputs.Animation" />
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog>
          <template #activator="{ on }">
            <v-btn fab color="primary" v-on="on">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card flat>
            <v-card-title>
              {{ `${$t('buttons.Create')} ${$t('inputs.Animation')}` }}
            </v-card-title>
            <v-card-text>
              <validation-observer ref="form" v-slot="{ handleSubmit }">
                <v-form @submit.prevent="handleSubmit(onSubmit)">
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        :rules="{ mimes: ['application/json'] }"
                        vid="file"
                        :name="$t('inputs.Animation').toLowerCase()"
                      >
                        <v-file-input
                          id="file"
                          v-model="form.file"
                          name="file"
                          :loading="finding"
                          :disabled="finding"
                          prepend-icon="mdi-camera"
                          autocomplete="off"
                          clearable
                          accept="application/json"
                          :error-messages="errors"
                          :label="$t('inputs.Animation')"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="12" sm="12" class="text-right">
                      <v-btn
                        :aria-label="$t('buttons.Submit')"
                        :disabled="finding"
                        :loading="finding"
                        type="submit"
                        color="primary"
                      >
                        {{ $t('buttons.Submit') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </validation-observer>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #default="props">
      <v-item-group
        v-model="model"
        active-class="primary"
        @change="$emit('input', model)"
      >
        <v-row>
          <v-col
            v-for="aninm in props.items"
            :key="aninm.id"
            cols="12"
            sm="12"
            md="3"
          >
            <v-item v-slot="{ active, toggle }" :value="aninm.id">
              <v-card
                class="d-flex align-center"
                width="200"
                height="200"
                @click="toggle"
              >
                <v-lottie :animation-data="aninm.source" width="200" />
                <v-scroll-y-transition>
                  <div v-if="active" class="text-h2 flex-grow-1 text-center" />
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </template>
  </v-data-iterator>
</template>

<script>
import { Animations } from '~/models/services/anims/Animations'

export default {
  name: 'LottieForm',
  components: {
    VLottie: () => import('~/components/base/Lottie'),
  },
  props: ['value'],
  data: () => ({
    model: null,
    finding: null,
    form: new Animations(),
    items: [],
    total: 0,
    itemsPerPage: 4,
    pagination: {},
    itemsPerPageArray: [4],
  }),
  watch: {
    'pagination.page'() {
      return this.getAnimations()
    },
  },
  methods: {
    getAnimations() {
      this.finding = true
      const params = {
        page: this.pagination.page,
        per_page: this.itemsPerPage,
      }
      this.form
        .index({ params })
        .then((response) => {
          this.items = response.data.data
          this.total = response.data.total
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
    onSubmit() {
      this.finding = true
      this.form.setFormInstance(this.$refs.form)
      this.form
        .storeWithFiles()
        .then((response) => {
          this.$snackbar({ message: response.data, color: 'success' })
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.getAnimations()
          this.finding = false
        })
    },
  },
}
</script>
