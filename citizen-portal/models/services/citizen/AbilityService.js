import { Constants } from '~/utils/Constants'
import AbilityCreator from '~/utils/AbilityCreator'

export default class AbilityService extends AbilityCreator {
  constructor() {
    super(Constants.IDENTIFIER, Constants.Roles, Constants.Models)
  }

  canAnyAction(actions, model, entity = null, ownedVia = 'user_id') {
    return actions.map((action) => {
      return {
        name: this[action](model),
        entity_type: model,
        entity,
        ownedVia,
      }
    })
  }

  assignValidator(model) {
    return this.custom('assign-validator', model)
  }

  assignStatus(model) {
    return this.custom('assign-status', model)
  }
}
