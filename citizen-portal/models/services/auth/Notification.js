import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Notification extends Model {
  constructor() {
    super(Api.END_POINTS.NOTIFICATIONS(), {})
  }
}
