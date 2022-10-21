export class Error {
  constructor($refs = null) {
    this.errors = {}
    this.$refs = $refs
  }

  all() {
    if (typeof this.errors !== 'undefined' && this.any()) {
      return this.errors
    }
    return null
  }

  first(field) {
    if (typeof this.errors !== 'undefined' && this.errors[field]) {
      return this.errors[field][0]
    }
  }

  get(field) {
    if (typeof this.errors !== 'undefined' && this.errors[field]) {
      return this.errors[field]
    }
    return null
  }

  record(errors) {
    this.errors = errors
    if (
      typeof errors === 'object' &&
      Object.prototype.hasOwnProperty.call(errors, 'errors')
    ) {
      // only allow this function to be run if the validator exists
      if (this.$refs) {
        // clear errors
        this.$refs.reset()
        this.$refs.setErrors(this.errors.errors)
      }
    }
  }

  has(field) {
    return this.errors
      ? !Object.prototype.hasOwnProperty.call(this.errors, field)
      : false
  }

  any() {
    return Object.keys(this.errors).length > 0
  }

  clear(field) {
    if (field) {
      delete this.errors[field]
      return
    }
    this.errors = {}
  }
}
