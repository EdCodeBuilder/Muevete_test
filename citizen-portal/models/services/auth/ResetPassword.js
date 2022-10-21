import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class ResetPassword extends Model {
  constructor(
    data = {
      email: null,
      username: null,
      document: null,
      password: null,
      password_confirmation: null,
      token: null,
    }
  ) {
    super(Api.END_POINTS.RESET_PASSWORD(), data)
  }
}
