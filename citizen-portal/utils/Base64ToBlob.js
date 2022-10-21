export default class Base64ToBlob {
  constructor(data, reverse = false) {
    if (reverse) {
      this.dataBlob = data
    } else {
      this.byteString = atob(data.split(',')[1])
      this.mimeString = data.split(',')[0].split(':')[1].split(';')[0]
    }
  }

  blob() {
    const ab = new ArrayBuffer(this.byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < this.byteString.length; i++) {
      ia[i] = this.byteString.charCodeAt(i)
    }
    return new Blob([ia], { type: this.mimeString })
  }

  base64() {
    let base64data = null
    const reader = new FileReader()
    reader.readAsDataURL(this.dataBlob)
    reader.onloadend = function () {
      base64data = reader.result
    }
    return base64data
  }
}
