import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

const formData = {
  name: null,
  park_id: null,
}

export class Stage extends Model {
  constructor(data = formData) {
    super(Api.END_POINTS.CITIZEN_STAGES(), data)
  }

  clone(data = formData) {
    return new Stage(data)
  }
}
