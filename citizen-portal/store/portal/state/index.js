const attrs = {
  params: {
    query: null,
    per_page: 10,
    page: 1,
    column: [],
    order: [],
  },
  requestedAt: null,
  headers: [],
  expanded: [],
  items: [],
  itemsPerPage: 10,
  pagination: {},
  total: 0,
  pageCount: 0,
}

const state = () => ({
  activities: attrs,
  ageGroups: attrs,
  daily: attrs,
  fileTypes: attrs,
  profileTypes: attrs,
  programs: attrs,
  stages: attrs,
  status: attrs,
  weekdays: attrs,
  schedules: attrs,
  users: attrs,
})

export default state
