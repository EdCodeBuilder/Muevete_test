import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class WeekDay extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_WEEK_DAYS(), data)
  }

  clone(data = { name: null }) {
    return new WeekDay(data)
  }
}
