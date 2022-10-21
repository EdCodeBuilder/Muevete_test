import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Audit extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_AUDIT(), data)
  }
}
