import moment from 'moment'
const MALE = 1
const FEMALE = 2

export default class DocumentParser {
  dev = process.env.NODE_ENV !== 'production'

  constructor(data, format = 'full', genderAsString = false) {
    if (this.dev) {
      console.info('Initialising with data:', data)
      console.time()
    }
    this.barcode = data
    this.genderAsString = genderAsString
    this.$moment = moment
    this.params = {
      capitalIndex: 0,
      documentNumber: 0,
      firstSurname: 0,
      secondSurname: 0,
      firstName: 0,
      secondName: 0,
      gender: 0,
      bloodType: 0,
      birthday: 0,
    }
    this.content = ''
    this.format = format
    this.startArrayFrom = 3
    this.gap = 0
    this.capitalIndex = null
  }

  parse() {
    this.content = this.barcode.match(/[A-Za-z0-9+_]+/gi)
    if (this.dev) {
      console.info(`Splitting content:`, this.content)
    }
    if (this.barcode.includes('PubDSK')) {
      if (this.dev) {
        console.info(`Parsing with PubDSK`)
      }
      this.gap = 0
      if (this.content[2 + this.gap].length > 7) {
        this.gap--
      }
      this.capitalIndex = this.content[this.startArrayFrom + this.gap].match(
        /[A-Z]/
      ).index
      this.params = this.createIndexes()
      if (this.dev) {
        console.info(`Params created:`)
        console.table(this.params)
      }
    } else {
      if (this.dev) {
        console.info(`Parsing without PubDSK`)
      }
      this.gap = 0
      this.startArrayFrom = 2
      this.capitalIndex = this.content[this.startArrayFrom + this.gap].match(
        /[A-Z]/
      ).index
      this.params = this.createIndexes()
    }
    const result = this.createResponse()
    if (this.dev) {
      console.info(`Data parsed`)
      console.table(result)
      console.timeEnd()
    }
    return result
  }

  parseDocument() {
    try {
      if (this.dev) {
        console.info(`Parsing document...`)
      }
      const data = this.content
      return parseInt(
        data[this.params.documentNumber + this.gap].substring(
          this.params.capitalIndex - 10,
          this.params.capitalIndex
        )
      ).toString()
    } catch (e) {
      return null
    }
  }

  parseDate() {
    if (this.dev) {
      console.info(`Parsing date...`)
    }
    const newDate = this.content[this.params.birthday + this.gap].substring(
      2,
      10
    )
    return this.$moment(newDate, 'YYYYMMDD').isValid()
      ? this.$moment(newDate, 'YYYYMMDD').format('YYYY-MM-DD')
      : null
  }

  parseBloodType() {
    try {
      if (this.dev) {
        console.info(`Parsing blood...`)
      }
      const data = this.content
      const index = this.params.bloodType
      const gap = this.gap
      if (data[index + gap][data[index + gap].length - 1] === '2') {
        return data[index + gap].substring(
          data[index + gap].length - 4,
          data[index + gap].length - 1
        )
      } else {
        return data[index + gap].substring(data[index + gap].length - 2)
      }
    } catch (e) {
      return null
    }
  }

  parseGender() {
    if (this.dev) {
      console.info(`Parsing gender...`)
    }
    if (this.genderAsString) {
      return this.content[this.params.gender + this.gap].includes('M')
        ? 'M'
        : 'F'
    } else {
      return this.content[this.params.gender + this.gap].includes('M')
        ? MALE
        : FEMALE
    }
  }

  createIndexes() {
    if (this.dev) {
      console.info(`Creating params...`)
    }
    let from = this.startArrayFrom
    return {
      capitalIndex: this.capitalIndex,
      documentNumber: from, // 2 | 3
      firstSurname: from++, // 2 | 3
      secondSurname: from++, // 3 | 4
      firstName: from++, // 4 | 5
      secondName: from++, // 5 | 6
      gender: from, // 6 | 7
      bloodType: from, // 6 | 7
      birthday: from, // 6 | 7
    }
  }

  createResponse() {
    if (this.dev) {
      console.info(`Creating object...`)
    }
    const documentNumber = this.parseDocument()
    const firstSurname = (
      this.content[this.params.firstSurname + this.gap] || ''
    )
      .substring(this.params.capitalIndex)
      .toUpperCase()
    let secondSurname = ''
    let firstName = ''
    let secondName = ''
    if (!isNaN(this.content[this.params.firstName + this.gap][0])) {
      firstName = this.content[this.params.secondSurname + this.gap]
      this.gap -= 2
    } else if (!isNaN(this.content[this.params.secondName + this.gap][0])) {
      if (this.format === 'one_surname') {
        secondName = this.content[this.params.firstName + this.gap]
        firstName = this.content[this.params.secondSurname + this.gap]
      } else {
        secondSurname = this.content[this.params.firstName + this.gap]
        firstName = this.content[this.params.secondSurname + this.gap]
      }
      this.gap--
    } else {
      secondSurname = this.content[this.params.secondSurname + this.gap]
      firstName = this.content[this.params.firstName + this.gap]
      secondName = this.content[this.params.secondName + this.gap]
    }
    const names = `${firstName} ${secondName}`.trim().toUpperCase()
    const surnames = `${firstSurname} ${secondSurname}`.trim().toUpperCase()

    return {
      document: documentNumber,
      first_name: firstName.toUpperCase(),
      middle_name: secondName.toUpperCase(),
      first_last_name: firstSurname.toUpperCase(),
      second_last_name: secondSurname.toUpperCase(),
      birthdate: this.parseDate(),
      sex_id: this.parseGender(),
      blood_type: this.parseBloodType(),
      full_name: `${names} ${surnames}`.trim(),
    }
  }
}
