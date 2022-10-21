<template>
  <v-card flat color="transparent">
    <v-card-text>
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
      <validation-observer v-slot="{ handleSubmit }">
        <form
          class="hidden-sm-and-down"
          @submit.prevent="handleSubmit(onDecode)"
        >
          <validation-provider
            v-slot="{ errors }"
            :rules="{
              required: true,
            }"
            vid="format"
            :name="$t('form.format').toLowerCase()"
          >
            <v-select
              id="format"
              v-model="format"
              prepend-icon="mdi-dots-horizontal"
              :label="$t('form.format')"
              :items="names"
              item-text="name"
              item-value="id"
              required
              clearable
              :error-messages="errors"
              name="format"
            />
          </validation-provider>
          <div class="drag-area">
            <v-icon dark size="100">mdi-cloud-upload</v-icon>
            <i18n tag="h1" class="display-2" path="scan.drag" />
            <i18n tag="h1" class="display-1" path="scan.or" />
            <v-btn
              outlined
              color="white"
              class="my-2"
              v-text="$t('scan.find')"
            />
            <validation-provider
              v-slot="{ errors }"
              :rules="validations"
              vid="pdf_417"
              :name="$t('card.document').toLowerCase()"
            >
              <v-file-input
                v-if="$vuetify.breakpoint.mdAndUp"
                id="pdf_417"
                v-model="file"
                name="pdf_417"
                show-size
                :label="$t('card.document')"
                :error-messages="errors"
              />
            </validation-provider>
          </div>
          <v-btn
            :aria-label="$t('buttons.Send')"
            :loading="loading"
            :disabled="loading"
            class="mt-4"
            color="primary"
            type="submit"
            v-text="$t('buttons.Send')"
          />
        </form>
      </validation-observer>
      <validation-observer
        v-if="$vuetify.breakpoint.smAndDown"
        v-slot="{ handleSubmit }"
      >
        <form @submit.prevent="handleSubmit(onDecode)">
          <validation-provider
            v-slot="{ errors }"
            :rules="{
              required: true,
            }"
            vid="format"
            :name="$t('form.format').toLowerCase()"
          >
            <v-select
              id="format"
              v-model="format"
              prepend-icon="mdi-dots-horizontal"
              :label="$t('form.format')"
              :items="names"
              item-text="name"
              item-value="id"
              required
              clearable
              :error-messages="errors"
              name="format"
            />
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            :rules="validations"
            vid="pdf_417"
            :name="$t('card.document').toLowerCase()"
          >
            <v-file-input
              id="pdf_417"
              v-model="file"
              name="pdf_417"
              :label="$t('card.document')"
              :error-messages="errors"
            />
          </validation-provider>
          <v-btn
            :aria-label="$t('buttons.Send')"
            :loading="loading"
            :disabled="loading"
            color="primary"
            type="submit"
            v-text="$t('buttons.Send')"
          />
        </form>
      </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from '@zxing/library'
import BarcodeJS from '@/utils/BarcodeJS'
import DocumentParser from '~/utils/DocumentParser'
export default {
  name: 'VDocumentImageReader',
  data() {
    return {
      codeReader: new BrowserMultiFormatReader(),
      hints: new Map(),
      formats: [BarcodeFormat.PDF_417],
      file: undefined,
      loading: false,
      validations: {
        required: true,
        mimes: [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/tiff',
          'application/pdf',
        ],
        size: 12000,
      },
      names: [
        { id: 'full', name: '2 nombres y 2 apellidos' },
        { id: 'one_name', name: '1 nombre y 2 apellidos' },
        { id: 'one_surname', name: '2 nombres y 1 apellido' },
        { id: 'one_and_one', name: '1 nombre y 1 apellido' },
        { id: 'more', name: 'Otro' },
      ],
      format: null,
    }
  },
  mounted() {
    this.createDraggableZone()
  },
  methods: {
    createDraggableZone() {
      const that = this
      const dropArea = document.querySelector('.drag-area')
      const dragText = dropArea.querySelector('h1')
      const button = dropArea.querySelector('button')
      const input = dropArea.querySelector('input')
      button.onclick = () => {
        input.click()
      }
      input.addEventListener('change', function (event) {
        // event.preventDefault()
        // that.showFile(dropArea, dragText)
      })
      dropArea.addEventListener('dragover', (event) => {
        event.preventDefault()
        dropArea.classList.add('active')
        dragText.textContent = this.$t('scan.dragover')
      })
      dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('active')
        dragText.textContent = this.$t('scan.drag')
      })
      dropArea.addEventListener('drop', (event) => {
        event.preventDefault()
        // that.onChangeInput(event)
        that.file = event.dataTransfer.files[0]
        that.showFile(dropArea, dragText)
      })
    },
    showFile(dropArea, dragText) {
      const fileType = this.file.type
      const validExtensions = this.validations.mimes
      if (validExtensions.includes(fileType)) {
        const fileReader = new FileReader()
        fileReader.onload = () => {
          dropArea.innerHTML = `<img src="${fileReader.result}" alt="image" style="max-height: 300px">`
        }
        fileReader.readAsDataURL(this.file)
      } else {
        this.$snackbar({ message: this.$t('scan.error') })
        dropArea.classList.remove('active')
        dragText.textContent = this.$t('scan.drag')
      }
    },
    decodeImage(e) {
      this.loading = true
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      const reader = new FileReader()
      reader.onload = this.processFile
      reader.readAsDataURL(files[0])
    },
    onDecode() {
      if (this.file.type === 'application/pdf') {
        this.loading = true
        this.decodePDF()
      } else if (
        ['image/png', 'image/jpg', 'image/jpeg', 'image/tiff'].includes(
          this.file.type
        )
      ) {
        this.loading = true
        this.decodeFile()
      } else {
        this.$snackbar({ message: 'Provide a valid file.' })
      }
    },
    decodePDF() {
      const that = this
      // select the input file
      const inputFile = document.getElementById('pdf_417')
      if (inputFile.value === '') {
        this.$snackbar({ message: 'File required' })
        return false
      }
      const configs = {}
      // create callback which handles the result
      const callback = function (result) {
        if (result.success) {
          const decode = result.codes.length ? result.codes[0] : result.codes
          if (typeof decode === 'string') {
            that.$emit('decode', that.extractColDocumentData(decode))
          } else {
            that.$emit('error', that.$t('scan.barcode_error'))
          }
        } else {
          that.$emit('error', that.$t('scan.barcode_error'))
        }
        that.loading = false
      }
      const reader = new BarcodeJS()
      reader.decodeDocument(inputFile, configs, callback)
    },
    decodeFile() {
      this.loading = true
      const reader = new FileReader()
      reader.onload = this.processFile
      reader.readAsDataURL(this.file)
    },
    processFile(e) {
      this.hints.set(DecodeHintType.POSSIBLE_FORMATS, this.formats)
      this.codeReader = new BrowserMultiFormatReader(this.hints)
      this.codeReader
        .decodeFromImage(undefined, e.target.result)
        .then((result) => {
          this.$emit('decode', this.extractColDocumentData(result.text))
        })
        .catch((error) => {
          this.$emit('error', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    extractColDocumentData(data) {
      return new DocumentParser(data, this.format).parse()
    },
  },
}
</script>

<style scoped>
.drag-area {
  color: #fff;
  text-align: center;
  cursor: pointer;
  border: 2px dashed #eee;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.45);
}
.drag-area:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
.drag-area.active {
  border: 2px solid #eee;
}
.drag-area img {
  max-height: 300px;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}
</style>
