import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Role extends Model {
  constructor(
    data = {
      name: null,
      title: null,
    }
  ) {
    super(Api.END_POINTS.CITIZEN_ADMIN_ROLES(), data)
  }

  permissions(roleId, options = {}) {
    return this.get(
      Api.END_POINTS.CITIZEN_ADMIN_ROLES_PERMISSION(roleId, null),
      options
    )
  }

  allow(roleId, permissionId, options = {}) {
    return this.put(
      Api.END_POINTS.CITIZEN_ADMIN_ROLES_PERMISSION(roleId, permissionId),
      options
    )
  }

  retract(roleId, permissionId, options = {}) {
    return this.delete(
      Api.END_POINTS.CITIZEN_ADMIN_ROLES_PERMISSION(roleId, permissionId),
      options
    )
  }
}
