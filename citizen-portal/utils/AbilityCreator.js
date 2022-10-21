const classDashName = (name) => {
  return (name || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export default class AbilityCreator {
  /**
   * Roles from current module
   *
   * @type {{}}
   */
  roles = {}

  /**
   * Models from current module
   *
   * @type {{}}
   */
  models = {}

  /**
   * Constructor
   *
   * @param identifier
   * @param roles
   * @param models
   */
  constructor(identifier, roles, models) {
    this.identifier = identifier
    for (const role in roles) {
      this.roles[role] = roles[role]
    }
    for (const model in models) {
      this.models[model] = models[model]
    }
  }

  /**
   * Get root role name
   *
   * @returns {*}
   */
  getRoot() {
    return process.env.VUE_APP_ROLE_ROOT
  }

  /**
   * Return array of objects valid for Bouncer
   *
   * @param model
   * @param entity
   * @param ownedVia
   * @returns {{ownedVia: string, entity_type: *, name: *, entity: null}[]}
   */
  manageAbilities(model, entity = null, ownedVia = 'user_id') {
    const actions = ['manage', 'view', 'create', 'update', 'destroy']
    return actions.map((action) => {
      return {
        name: this[action](model),
        entity_type: model,
        entity,
        ownedVia,
      }
    })
  }

  /**
   * User can view an item
   *
   * @param model
   * @returns {string}
   */
  view(model) {
    return this.custom('view', model)
  }

  /**
   * User can create, update or destroy an item
   *
   * @param model
   * @returns {string}
   */
  manage(model) {
    return this.custom('manage', model)
  }

  /**
   * User can only create an item
   *
   * @param model
   * @returns {string}
   */
  create(model) {
    return this.custom('create', model)
  }

  /**
   * User can only update an item
   *
   * @param model
   * @returns {string}
   */
  update(model) {
    return this.custom('update', model)
  }

  /**
   * User can only destroy an item
   *
   * @param model
   * @returns {string}
   */
  destroy(model) {
    return this.custom('destroy', model)
  }

  /**
   * User can view audit data
   *
   * @param model
   * @returns {string}
   */
  history(model) {
    return this.custom('view-audit', model)
  }

  /**
   * User can create custom ability name
   *
   * @param prefix
   * @param model
   * @returns {string}
   */
  custom(prefix, model) {
    return `${(prefix || '').toLowerCase()}-${classDashName(model)}-${
      this.identifier
    }`
  }
}
