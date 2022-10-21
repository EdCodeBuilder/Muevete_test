import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Career extends Model {
  constructor(
    levelId,
    data = {
      name: null,
      academic_level_id: null,
    }
  ) {
    super(Api.END_POINTS.CAREERS(levelId), data)
  }
}
