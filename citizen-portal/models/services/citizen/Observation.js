import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Observation extends Model {
  constructor(id, data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_PROFILES_OBSERVATIONS(id), data)
  }

  clone(id, data = { name: null }) {
    return new Observation(id, data)
  }
}
