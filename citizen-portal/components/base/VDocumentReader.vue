<template>
  <div class="scanner-container">
    <div v-if="isLoading">
      <v-progress-circular color="primary" indeterminate />
    </div>
    <div v-show="!isLoading">
      <video
        ref="scanner"
        poster="data:image/gif,AAAA"
        width="100%"
        height="50%"
      />
      <div class="overlay-element"></div>
      <div class="laser"></div>
    </div>
  </div>
</template>

<script>
import { BrowserMultiFormatReader, Exception } from '@zxing/library'
const MALE = 1
const FEMALE = 2
export default {
  name: 'v-document-reader',
  data() {
    return {
      isLoading: true,
      codeReader: new BrowserMultiFormatReader(),
      isMediaStreamAPISupported:
        navigator &&
        navigator.mediaDevices &&
        'enumerateDevices' in navigator.mediaDevices,
    }
  },
  mounted() {
    if (!this.isMediaStreamAPISupported) {
      throw new Exception('Media Stream API is not supported')
    }
    this.start()
    this.$refs.scanner.oncanplay = (event) => {
      this.isLoading = false
      this.$emit('loaded')
    }
  },
  beforeDestroy() {
    this.codeReader.reset()
  },
  watch: {
    stop(val) {
      return val && this.codeReader.reset()
    },
  },
  methods: {
    start() {
      this.codeReader.decodeFromVideoDevice(
        undefined,
        this.$refs.scanner,
        (result, err) => {
          if (result) {
            this.$emit('decode', result.text)
          }
        }
      )
    },
    extractColDocumentData(data) {
      const dataArray = data.replace(/[^A-Za-z0-9+]+/g, ' ').split(' ')
      let indexMod = 0
      let idNumber
      let lastName1
      // Is old document
      if (/[A-Z]/g.test(dataArray[3])) {
        indexMod = -1
        const idString = dataArray[3].replace(/[A-Z]/g, '')
        idNumber = idString.substring(10, idString.length)
        lastName1 = dataArray[3].replace(/[0-9]/g, '')
      } else {
        idNumber = dataArray[4].replace(/[A-Z]/g, '')
        lastName1 = dataArray[4].replace(/[0-9]/g, '')
      }
      const lastName2 = dataArray[5 + indexMod].replace(/\W/g, '')
      const firstName1 = dataArray[6 + indexMod].replace(/\W/g, '')
      let middleName
      if (!/[0-9]/g.test(dataArray[7 + indexMod])) {
        middleName = dataArray[7 + indexMod]
      }
      const extraData = dataArray[middleName ? 8 + indexMod : 7 + indexMod]
      const gender = extraData.includes('M') ? MALE : FEMALE
      const birthDate = this.$moment(
        extraData.substr(2, 10),
        'YYYYMMDD'
      ).format('YYYY-MM-DD')
      const bloodType = extraData.substr(-2)
      return {
        document: idNumber,
        first_name: firstName1,
        middle_name: middleName,
        first_last_name: lastName1,
        second_last_name: lastName2,
        birthdate: birthDate,
        sex_id: gender,
        blood_type: bloodType,
        full_name: `${firstName1} ${middleName || ''} ${lastName1} ${
          lastName2 || ''
        }`,
      }
    },
  },
}
</script>

<style scoped>
video {
  max-width: 100%;
  max-height: 100%;
}
.scanner-container {
  position: relative;
}

.overlay-element {
  position: absolute;
  top: 0;
  width: 100%;
  height: 99%;
  background: rgba(30, 30, 30, 0.5);

  -webkit-clip-path: polygon(
    0% 0%,
    0% 100%,
    20% 100%,
    20% 20%,
    80% 20%,
    80% 80%,
    20% 80%,
    20% 100%,
    100% 100%,
    100% 0%
  );
  clip-path: polygon(
    0% 0%,
    0% 100%,
    20% 100%,
    20% 20%,
    80% 20%,
    80% 80%,
    20% 80%,
    20% 100%,
    100% 100%,
    100% 0%
  );
}

.laser {
  width: 60%;
  margin-left: 20%;
  background-color: tomato;
  height: 1px;
  position: absolute;
  top: 40%;
  z-index: 2;
  box-shadow: 0 0 4px red;
  -webkit-animation: scanning 2s infinite;
  animation: scanning 2s infinite;
}
@-webkit-keyframes scanning {
  50% {
    -webkit-transform: translateY(75px);
    transform: translateY(75px);
  }
}
@keyframes scanning {
  50% {
    -webkit-transform: translateY(75px);
    transform: translateY(75px);
  }
}
</style>
