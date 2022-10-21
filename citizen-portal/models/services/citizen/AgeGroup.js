import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

const formData = {
  name: null,
  min: null,
  max: null,
}

export class AgeGroup extends Model {
  constructor(data = formData) {
    super(Api.END_POINTS.CITIZEN_AGES(), data)
  }

  clone(data = formData) {
    return new AgeGroup(data)
  }
}
