import validations from '@/models/validations'
import { Form } from './Form'

export class Model extends Form {
  constructor(url, data = {}) {
    super(data)
    this.url = url
    this.validations = validations
  }

  /**
   * Display a listing of the resource.
   *
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  index(options = {}) {
    return this.get(this.url, options)
  }

  /**
   * Display the specified resource.
   *
   * @param id
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  show(id, options = {}) {
    return this.get(`${this.url}/${id}`, options)
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  store(options = {}) {
    return this.post(this.url, options)
  }

  /**
   * Store with files a newly created resource in storage.
   *
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  storeWithFiles(options = {}) {
    return this.postWithFiles(this.url, options)
  }

  /**
   * Update with files the specified resource in storage.
   *
   * @param id
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  updateWithFiles(id, options = {}) {
    return this.putWithFiles(`${this.url}/${id}`, options)
  }

  /**
   * Update the specified resource in storage.
   *
   * @param id
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  update(id, options = {}) {
    return this.put(`${this.url}/${id}`, options)
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param id
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  destroy(id, options = {}) {
    return this.delete(`${this.url}/${id}`, options)
  }

  /**
   * Restore the specified resource from storage.
   * Only if model has SoftDeletes
   *
   * @param id
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  restore(id, options = {}) {
    return this.patch(`${this.url}/${id}/restore`, options)
  }
}
