import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

const formData = {
  user_id: null,
  profile_type_id: null,
  document_type_id: null,
  document: null,
  name: null,
  surname: null,
  email: null,
  sex_id: null,
  blood_type_id: null,
  birthdate: null,
  country_birth_id: null,
  state_birth_id: null,
  city_birth_id: null,
  country_residence_id: null,
  state_residence_id: null,
  city_residence_id: null,
  locality_id: null,
  upz_id: null,
  neighborhood_id: null,
  other_neighborhood_name: null,
  address: null,
  stratum: null,
  ethnic_group_id: null,
  population_group_id: null,
  gender_id: null,
  sexual_orientation_id: null,
  eps_id: null,
  has_disability: null,
  disability_id: null,
  contact_name: null,
  contact_phone: null,
  contact_relationship: null,
  assigned_by_id: null,
  assigned_at: null,
  checker_id: null,
  status_id: null,
}

export class Profile extends Model {
  constructor(data = formData) {
    super(Api.END_POINTS.CITIZEN_PROFILES(), data)
  }

  clone(data = formData) {
    return new Profile(data)
  }

  excel(options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_PROFILES_EXCEL(), options)
  }

  assignValidator(id, options = {}) {
    return this.put(Api.END_POINTS.CITIZEN_PROFILES_VALIDATOR(id), options)
  }

  assignStatus(id, options = {}) {
    return this.put(Api.END_POINTS.CITIZEN_PROFILES_STATUS(id), options)
  }

  activities(id, options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_PROFILES_SCHEDULES(id), options)
  }
}
