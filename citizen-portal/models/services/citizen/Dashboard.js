import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Dashboard extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.CITIZEN_DASHBOARD(), data)
  }

  clone(data = {}) {
    return new Dashboard(data)
  }
}
