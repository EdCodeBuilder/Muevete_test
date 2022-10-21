<template>
  <div
    v-if="styles"
    ref="animation"
    :style="styles"
    class="text-center align-center justify-center mx-auto"
  />
</template>

<script>
import lottie from 'lottie-web/build/player/lottie'
export default {
  name: 'VLottie',
  props: {
    animationData: { type: [Object, String], required: true },
    loop: { type: [Boolean, Number], default: false },
    autoPlay: { type: Boolean, default: true },
    renderer: { type: String, default: 'svg' },
    speed: { type: Number, default: 1 },
    width: { type: [Number, String], default: -1 },
    height: { type: Number, required: false, default: -1 },
    loopDelayMin: { type: Number, required: false, default: 0 },
    loopDelayMax: { type: Number, required: false, default: 0 },
  },
  data() {
    return {
      anim: null,
      file: null,
      styles: null,
      rendererSettings: {
        scaleMode: 'centerCrop',
        clearCanvas: true,
        progressiveLoad: false,
        hideOnTransparent: true,
      },
      time: null,
    }
  },
  fetch() {
    this.init()
  },
  watch: {
    animationData() {
      this.init()
    },
  },
  beforeDestroy() {
    if (this.time) {
      clearTimeout(this.time)
    }
    if (this.anim) {
      this.anim.destroy()
    }
    this.anim = null
    this.file = null
  },
  methods: {
    init() {
      this.styles = {
        maxWidth: this.width !== -1 ? `${this.width}px` : '100%',
        maxHeight: this.height !== -1 ? `${this.height}px` : '100%',
        overflow: 'hidden',
        margin: '0 auto',
      }
      this.validateLottie().finally(() => {
        this.createAnimation()
      })
    },
    validateLottie() {
      return new Promise((resolve) => {
        if (
          typeof this.animationData === 'string' &&
          this.isValidHttpUrl(this.animationData)
        ) {
          this.$axios
            .$get(this.animationData)
            .then((response) => {
              this.file = response.data.lottie
            })
            .catch((errors) => {
              this.$snackbar({ message: 'No se pudo cargar archivo' })
              this.file = require('@/static/lottie/404.json')
            })
            .finally(() => {
              resolve()
            })
        } else {
          this.file = this.animationData
          resolve()
        }
      })
    },
    createAnimation() {
      if (this.anim) {
        this.anim.destroy()
      }
      const settings = {
        container: this.$refs.animation,
        renderer: this.renderer,
        loop: this.loop,
        autoplay: this.autoPlay,
        animationData: this.file,
        rendererSettings: this.rendererSettings,
      }
      this.anim = lottie.loadAnimation(settings)
      this.anim.setSpeed(this.speed)
      if (this.loopDelayMin > 0) {
        this.anim.loop = false
        this.anim.autoplay = false
        this.executeLoop()
      }
      this.anim.addEventListener('loopComplete', () => {
        this.$emit('loopComplete', this.anim)
      })
      this.anim.addEventListener('complete', () => {
        this.$emit('complete', this.anim)
      })
      this.anim.addEventListener('enterFrame', () => {
        this.$emit('enterFrame', this.anim)
      })
    },
    isValidHttpUrl(string) {
      // eslint-disable-next-line
      const regex = new RegExp(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)
      let url = null
      try {
        url = new URL(string)
      } catch (_) {
        return false
      }
      return regex.test(url.href)
    },
    play() {
      if (this.anim) this.anim.play()
    },
    stop() {
      if (this.anim) this.anim.stop()
    },
    pause() {
      if (this.anim) this.anim.pause()
    },
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
    },
    executeLoop() {
      const that = this
      this.anim.play()
      const timeout = this.getRandomInt(
        this.loopDelayMin,
        this.loopDelayMax === 0 ? this.loopDelayMin : this.loopDelayMax
      )
      this.time = setTimeout(() => {
        that.anim.stop()
        that.executeLoop()
      }, timeout)
    },
  },
}
</script>
