import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Activity extends Model {
  constructor(data = { name: null, is_initiate: false }) {
    super(Api.END_POINTS.CITIZEN_ACTIVITIES(), data)
  }

  clone(data = { name: null, is_initiate: false }) {
    return new Activity(data)
  }
}
