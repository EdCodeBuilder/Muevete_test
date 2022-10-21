import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class AcademicLevel extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.LEVELS(), data)
  }
}
