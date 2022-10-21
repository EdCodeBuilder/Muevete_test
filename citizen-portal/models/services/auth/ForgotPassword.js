import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class ForgotPassword extends Model {
  constructor(
    data = {
      email: null,
      email_confirmation: null,
      username: null,
      document: null,
      captcha: null,
    }
  ) {
    super(Api.END_POINTS.FORGOT_PASSWORD(), data)
  }
}
