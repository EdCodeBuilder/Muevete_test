import { Model } from '@/models/Model'
import { Api } from '~/models/Api'

export class Animations extends Model {
  constructor(data = { file: null }) {
    super(Api.END_POINTS.ANIMATIONS(), data)
  }
}
