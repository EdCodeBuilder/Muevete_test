<template>
  <v-row dense>
    <v-col cols="12">
      <v-tooltip v-for="(parse, i) in data" :key="i" top>
        <template #activator="{ on, attrs }">
          <v-avatar
            class="mx-1"
            color="grey lighten-3"
            size="25"
            v-bind="attrs"
            v-on="on"
          >
            <v-img
              contain
              :lazy-src="parse.image"
              :src="parse.image"
              :alt="parse.name"
            />
          </v-avatar>
        </template>
        <span>{{ parse.name }}</span>
      </v-tooltip>
    </v-col>
    <v-col cols="12">
      <span class="caption" v-text="ua" />
    </v-col>
  </v-row>
</template>

<script>
import UAParser from 'ua-parser-js'
export default {
  name: 'VUserAgent',
  props: {
    userAgent: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    parser: new UAParser(),
    ua: null,
    browser: {},
    os: {},
    engine: {},
    device: {},
    cpu: {},
    gpu: {},
    data: [],
  }),
  watch: {
    userAgent(val) {
      return val && this.init()
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.userAgent) {
        this.parser.setUA(this.userAgent)
      }
      const result = this.parser.getResult()
      this.ua = result.ua
      this.browser = {
        image: this.setImage('browsers', result.browser.name),
        ...result.browser,
      }
      this.engine = {
        image: this.setImage('engines', result.engine.name),
        ...result.engine,
      }
      this.os = {
        image: this.setImage('os', result.os.name),
        ...result.os,
      }
      this.device = {
        image: this.setImage('types', result.device.type),
        ...result.device,
      }
      this.cpu = {
        image: this.setImage('cpu', result.cpu.name),
        ...result.cpu,
      }
      const gpu =
        result.gpu && result.gpu.vendor ? result.gpu.vendor : 'Unknown GPU'
      this.gpu = {
        image: this.setImage('companies', gpu),
        vendor: gpu,
      }
      this.data = [
        {
          name: `${this.browser.name || 'Unknown Browser'}
            ${this.browser.version || ''}`.trim(),
          image: this.browser.image,
        },
        {
          name: `${this.engine.name || 'Unknown Engine'}
            ${this.engine.version || ''}`.trim(),
          image: this.engine.image,
        },
        {
          name: `${this.os.name || 'Unknown OS'}
            ${this.os.version || ''}`.trim(),
          image: this.os.image,
        },
        {
          name: `${this.device.type || 'Unknown Type'}`,
          image: this.device.image,
        },
        {
          name: `${this.device.vendor || 'Unknown Vendor'}
             ${this.device.model || 'Unknown Model'}`,
          image: this.setImage('companies', this.device.vendor),
        },
        {
          name: this.cpu.architecture
            ? `${this.cpu.architecture}`
            : 'Unknown CPU',
          image: this.cpu.image,
        },
        {
          name: this.gpu.vendor,
          image: this.gpu.image,
        },
      ]
    },
    setImage(path, name) {
      let img = ''
      try {
        img = require(`@/static/images/${path}/${name.toLowerCase()}.png`)
        return img
      } catch (e) {
        img = require(`@/static/images/${path}/default.png`)
        return img
      }
    },
  },
}
</script>
