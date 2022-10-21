import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Park extends Model {
  constructor() {
    super(Api.END_POINTS.PARKS(), {})
  }
}
