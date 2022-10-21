import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

const formData = {
  // Selects
  program_id: null,
  activity_id: null,
  stage_id: null,
  weekday_id: null,
  daily_id: null,
  // Data
  min_age: null,
  max_age: null,
  quota: null,
  start_date: null,
  final_date: null,
  is_paid: false,
  is_activated: false,
}

export class Schedule extends Model {
  constructor(data = formData) {
    super(Api.END_POINTS.CITIZEN_SCHEDULES(), data)
  }

  citizen(scheduleId, citizenId, options = {}) {
    return this.get(
      `${Api.END_POINTS.CITIZEN_SCHEDULES_PROFILES(scheduleId)}/${citizenId}`,
      options
    )
  }

  profiles(scheduleId, options = {}) {
    return this.get(
      Api.END_POINTS.CITIZEN_SCHEDULES_PROFILES(scheduleId),
      options
    )
  }

  unsubscribe(scheduleId, profileId, options = {}) {
    return this.put(
      `${Api.END_POINTS.CITIZEN_SCHEDULES_PROFILES(scheduleId)}/${profileId}`,
      options
    )
  }

  excel(scheduleId, options = {}) {
    return this.post(
      Api.END_POINTS.CITIZEN_SCHEDULES_PROFILES(scheduleId),
      options
    )
  }

  importTemplate(options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_SCHEDULES_TEMPLATE(), options)
  }

  import(options = {}) {
    return this.postWithFiles(
      Api.END_POINTS.CITIZEN_SCHEDULES_IMPORT(),
      options
    )
  }

  clone(data = formData) {
    return new Schedule(data)
  }
}
