const IDENTIFIER = process.env.VUE_APP_ROLE_IDENTIFIER
const ROLE_ROOT = process.env.VUE_APP_ROLE_ROOT
const ROLE_ADMIN = `${IDENTIFIER}-admin`
const ROLE_VIEWER = `${IDENTIFIER}-viewer`
const ROLE_ASSIGNOR = `${IDENTIFIER}-assignor`
const ROLE_VALIDATOR = `${IDENTIFIER}-validator`

const ACTIVITIES = 'Activity'
const AGES = 'AgeGroup'
const CITIZENS = 'Citizen'
const CITIZEN_SCHEDULES = 'CitizenSchedule'
const DAYS = 'Day'
const FILES = 'File'
const FILE_TYPES = 'FileType'
const HOURS = 'Hour'
const OBSERVATIONS = 'Observation'
const PROFILE = 'Profile'
const PROFILE_TYPES = 'ProfileType'
const PROGRAMS = 'Program'
const SCHEDULES = 'Schedule'
const STAGES = 'Stage'
const STATUS = 'Status'
const AUDITS = 'Audit'
const USERS = 'User'

const classDashName = (name) => {
  return (name || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export const Constants = {
  IDENTIFIER,
  Roles: {
    IDENTIFIER,
    ROLE_ROOT,
    ROLE_ADMIN,
    ROLE_VIEWER,
    ROLE_ASSIGNOR,
    ROLE_VALIDATOR,
    all: [ROLE_ROOT, ROLE_ADMIN, ROLE_VIEWER, ROLE_ASSIGNOR, ROLE_VALIDATOR],
  },
  Models: {
    ACTIVITIES,
    AGES,
    AUDITS,
    CITIZENS,
    CITIZEN_SCHEDULES,
    DAYS,
    FILES,
    FILE_TYPES,
    HOURS,
    OBSERVATIONS,
    PROFILE,
    PROFILE_TYPES,
    PROGRAMS,
    SCHEDULES,
    STAGES,
    STATUS,
    USERS,
  },
  Actions: {
    VIEW: (model) => `view-${classDashName(model)}-${IDENTIFIER}`,
    MANAGE: (model) => `manage-${classDashName(model)}-${IDENTIFIER}`,
    CREATE: (model) => `create-${classDashName(model)}-${IDENTIFIER}`,
    UPDATE: (model) => `update-${classDashName(model)}-${IDENTIFIER}`,
    DESTROY: (model) => `destroy-${classDashName(model)}-${IDENTIFIER}`,
    VALIDATOR: (model) =>
      `assign-validator-${classDashName(model)}-${IDENTIFIER}`,
    STATUS: (model) => `assign-status-${classDashName(model)}-${IDENTIFIER}`,
    HISTORY: (model) => `view-audit-${classDashName(model)}-${IDENTIFIER}`,
  },
}
