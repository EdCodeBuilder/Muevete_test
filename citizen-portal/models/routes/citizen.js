const api = process.env.VUE_APP_API_URL_BASE
const prefix = process.env.VUE_APP_API_PREFIX
export default {
  CITIZEN_DASHBOARD: () => `${api}/${prefix}/dashboard`,
  CITIZEN_STATUS: () => `${api}/${prefix}/status`,
  CITIZEN_STAGES: () => `${api}/${prefix}/stages`,
  CITIZEN_PROGRAMS: () => `${api}/${prefix}/programs`,
  CITIZEN_ACTIVITIES: () => `${api}/${prefix}/activities`,
  CITIZEN_AGES: () => `${api}/${prefix}/age-groups`,
  CITIZEN_WEEK_DAYS: () => `${api}/${prefix}/week-days`,
  CITIZEN_DAILY_HOURS: () => `${api}/${prefix}/daily-hours`,
  CITIZEN_FILE_TYPES: () => `${api}/${prefix}/file-types`,
  CITIZEN_PROFILE_TYPES: () => `${api}/${prefix}/profile-types`,
  CITIZEN_PROFILES: () => `${api}/${prefix}/profiles`,
  CITIZEN_PROFILES_EXCEL: () => `${api}/${prefix}/profiles/excel`,
  CITIZEN_PROFILES_VALIDATOR: (id) =>
    `${api}/${prefix}/profiles/${id}/validator`,
  CITIZEN_PROFILES_STATUS: (id) => `${api}/${prefix}/profiles/${id}/status`,
  CITIZEN_PROFILES_SCHEDULES: (id) =>
    `${api}/${prefix}/profiles/${id}/schedules`,
  CITIZEN_PROFILES_OBSERVATIONS: (id) =>
    `${api}/${prefix}/profiles/${id}/observations`,
  CITIZEN_PROFILES_FILES: (id) => `${api}/${prefix}/profiles/${id}/files`,
  CITIZEN_SCHEDULES: () => `${api}/${prefix}/schedules`,
  CITIZEN_SCHEDULES_IMPORT: () => `${api}/${prefix}/schedules/import`,
  CITIZEN_SCHEDULES_TEMPLATE: () => `${api}/${prefix}/schedules/template`,
  CITIZEN_SCHEDULES_PROFILES: (id) =>
    `${api}/${prefix}/schedules/${id}/profiles`,
  CITIZEN_AUDIT: () => `${api}/${prefix}/audits`,
  CITIZEN_PERMISSIONS: () => `${api}/${prefix}/user/permissions`,
  CITIZEN_ADMIN_PERMISSIONS: () => `${api}/${prefix}/admin/permissions`,
  CITIZEN_ADMIN_ROLES: () => `${api}/${prefix}/admin/roles`,
  CITIZEN_ADMIN_ROLES_PERMISSION: (roleId, permissionId) =>
    `${api}/${prefix}/admin/roles/${roleId}/permissions/${
      !permissionId ? '' : permissionId
    }`,
  CITIZEN_ADMIN_ENTITIES: () => `${api}/${prefix}/admin/models`,
  CITIZEN_ROLES: () => `${api}/${prefix}/users/roles`,
  CITIZEN_MENU: () => `${api}/${prefix}/user/menu`,
  CITIZEN_USERS: () => `${api}/${prefix}/users`,
  CITIZEN_FIND_USERS: () => `${api}/${prefix}/users/find`,
  CITIZEN_FIND_ASSIGNORS: () => `${api}/${prefix}/users/assignors`,
  CITIZEN_FIND_VALIDATORS: () => `${api}/${prefix}/users/validators`,
  CITIZEN_ROLES_USER: (userId) => `${api}/${prefix}/users/roles/${userId}`,
}
