import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Permission extends Model {
  constructor(
    data = {
      name: null,
      title: null,
      entity_type: null,
    }
  ) {
    super(Api.END_POINTS.CITIZEN_ADMIN_PERMISSIONS(), data)
  }

  entities(options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_ADMIN_ENTITIES(), options)
  }
}
