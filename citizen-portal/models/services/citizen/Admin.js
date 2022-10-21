import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Admin extends Model {
  constructor(
    data = {
      roles: [],
    }
  ) {
    super(Api.END_POINTS.CITIZEN_USERS(), data)
  }

  rolesData(options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_ROLES(), options)
  }

  assignors(options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_FIND_ASSIGNORS(), options)
  }

  validators(options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_FIND_VALIDATORS(), options)
  }

  findUser(options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_FIND_USERS(), options)
  }

  assignRole(userId, options = {}) {
    return this.post(Api.END_POINTS.CITIZEN_ROLES_USER(userId), options)
  }

  retractRole(userId, options = {}) {
    return this.delete(Api.END_POINTS.CITIZEN_ROLES_USER(userId), options)
  }
}
