import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class ProfileType extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_PROFILE_TYPES(), data)
  }

  clone(data = { name: null }) {
    return new ProfileType(data)
  }
}
