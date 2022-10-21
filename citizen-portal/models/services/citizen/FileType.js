import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class FileType extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_FILE_TYPES(), data)
  }

  clone(data = { name: null }) {
    return new FileType(data)
  }
}
