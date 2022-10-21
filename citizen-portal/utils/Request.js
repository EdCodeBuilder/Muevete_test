import _ from 'lodash'

export default class Request {
  env = process.env.NODE_ENV !== 'production'
  constructor(request) {
    this.request = request
    if (this.env) {
      console.info('Creating data...')
      console.table(request)
    }
  }

  all() {
    return this.request
  }

  get(key) {
    const result = _.get(this.all(), key, null)
    if (this.env) {
      console.info(`Getting ${key} from data ${result}`)
    }
    return result
  }

  has(...key) {
    if (this.env) {
      console.info(`Checking if data has ${key}`)
    }
    const keys = Array.isArray(key[0]) ? key[0] : key
    for (const k in keys) {
      if (!_.has(this.all(), keys[k])) {
        if (this.env) {
          console.info(`Data has ${keys[k]}`)
        }
        return false
      }
    }
    if (this.env) {
      console.info(`Data has not key in data:`, keys)
    }
    return true
  }

  hasAny(...key) {
    const keys = Array.isArray(key[0]) ? key[0] : key
    for (const k in keys) {
      if (_.has(this.all(), keys[k])) {
        if (this.env) {
          console.info(`Data has ${keys[k]}`)
        }
        return true
      }
    }
    if (this.env) {
      console.info(`Data has not any key in data:`, keys)
    }
    return false
  }

  filled(...key) {
    if (this.env) {
      console.info(`Checking if key has data`)
    }
    const keys = Array.isArray(key[0]) ? key[0] : key
    for (const k in keys) {
      if (this.isEmptyString(keys[k])) {
        if (this.env) {
          console.info(`Data is empty in key ${keys[k]}`)
        }
        return false
      }
    }
    console.info(`Data is not empty in key`)
    return true
  }

  anyFilled(...key) {
    const keys = Array.isArray(key[0]) ? key[0] : key
    for (const k in keys) {
      if (this.filled(keys[k])) {
        return true
      }
    }
    return false
  }

  only(...key) {
    const keys = Array.isArray(key[0]) ? key[0] : key
    const results = {}
    for (const k in keys) {
      if (_.has(this.all(), keys[k])) {
        results[keys[k]] = this.get(keys[k])
      }
    }
    return results
  }

  except(...key) {
    const keys = Array.isArray(key[0]) ? key[0] : key
    const results = this.all()
    for (const k in keys) {
      if (_.has(this.all(), keys[k])) {
        _.unset(results, keys[k])
      }
    }
    return results
  }

  keys() {
    return Object.keys(this.all())
  }

  values() {
    return Object.values(this.all())
  }

  isEmptyString(key) {
    const input = _.get(this.all(), key, null)
    return (
      typeof input !== 'boolean' &&
      !Array.isArray(input) &&
      (input || '').trim() === ''
    )
  }
}
