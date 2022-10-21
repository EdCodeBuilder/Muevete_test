import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Status extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_STATUS(), data)
  }

  clone(data = { name: null }) {
    return new Status(data)
  }
}
