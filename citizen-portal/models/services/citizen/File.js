import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class File extends Model {
  constructor(profileId, data = { name: null }) {
    super(Api.END_POINTS.CITIZEN_PROFILES_FILES(profileId), data)
  }

  clone(id, data = { name: null }) {
    return new File(id, data)
  }

  download(profileId, fileId, options = {}) {
    return this.get(
      `${Api.END_POINTS.CITIZEN_PROFILES_FILES(profileId)}/${fileId}`,
      options
    )
  }
}
