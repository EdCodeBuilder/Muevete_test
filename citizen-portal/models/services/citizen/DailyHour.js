import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class DailyHour extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_DAILY_HOURS(), data)
  }

  clone(data = { name: null }) {
    return new DailyHour(data)
  }
}
