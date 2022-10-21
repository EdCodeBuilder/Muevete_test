import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Program extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_PROGRAMS(), data)
  }

  clone(data = { name: null }) {
    return new Program(data)
  }
}
