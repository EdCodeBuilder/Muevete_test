<template>
  <v-card flat color="transparent">
    <v-card-text>
      <v-progress-linear
        color="light-blue"
        height="20"
        :value="progress * 100"
        striped
      >
        <template v-if="status" #default="{ value }">
          {{ `${(status || '').toUpperCase()} - ${Math.ceil(value)}%` }}
        </template>
      </v-progress-linear>
      <v-select
        v-model="deviceId"
        :loading="loading"
        :disabled="loading"
        :items="devices"
        item-text="label"
        item-value="deviceId"
        label="Camera"
      />
      <v-web-cam
        ref="webcam"
        :device-id="deviceId"
        width="100%"
        @started="onStarted"
        @stopped="onStopped"
        @error="onErrorCam"
        @cameras="onCameras"
        @camera-change="onCameraChange"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="onCapture"
      >
        Capturar
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
import { createWorker } from 'tesseract.js'
export default {
  name: 'VTextRecognizer',
  components: {
    VWebCam: () => import('~/components/base/VWebCam'),
  },
  props: {
    showLogsOnConsole: {
      type: Boolean,
      default: false,
    },
  },
  data: (vm) => ({
    loading: true,
    img: null,
    cams: null,
    deviceId: null,
    devices: [],
    status: null,
    progress: 0,
    worker: createWorker({
      logger: (m) => {
        if (vm.showLogsOnConsole) {
          console.log(m)
          vm.status = m.status
          vm.progress = m.progress
        }
      },
    }),
  }),
  watch: {
    cams(id) {
      this.deviceId = id
    },
    devices() {
      // Once we have a list select the first one
      const [first] = this.devices
      if (first) {
        this.camera = first.deviceId
        this.deviceId = first.deviceId
      }
    },
  },
  computed: {
    device() {
      return this.devices.find((n) => n.deviceId === this.deviceId)
    },
  },
  methods: {
    async onProcess(imageData) {
      await this.worker.load()
      await this.worker.loadLanguage('eng+spa')
      await this.worker.initialize('eng+spa')
      const {
        data: { text },
      } = await this.worker.recognize(imageData)
      return text
    },
    onCapture() {
      this.loading = true
      this.img = this.$refs.webcam.capture()
      this.onProcess(this.img)
        .then((response) => {
          this.$emit('decode', response)
        })
        .catch(() => {
          this.$emit('error', 'Unprocessable')
        })
        .finally(() => {
          this.loading = false
        })
    },
    onStarted(stream) {
      this.loading = false
      this.$emit('started', stream)
    },
    onStopped(stream) {
      this.$emit('stopped', stream)
    },
    onStop() {
      this.$refs.webcam.stop()
    },
    onStart() {
      this.$refs.webcam.start()
    },
    onErrorCam(error) {
      console.log('On Error', error)
      this.$emit('errorCamera', error)
    },
    onCameras(cameras) {
      this.devices = cameras
      // console.log('On Cameras Event', cameras)
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId
      this.camera = deviceId
      // console.log('On Camera Change Event', deviceId)
    },
  },
}
</script>
