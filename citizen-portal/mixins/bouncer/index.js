import { get } from 'vuex-pathify'
import AbilityService from '~/models/services/citizen/AbilityService'

const BouncerMixin = {
  install(Vue) {
    Vue.mixin({
      data: () => ({
        ability_service: new AbilityService(),
      }),
      computed: {
        bouncer: get('app/bouncer'),
        currentUserIsRoot() {
          return this.bouncer.isA(this.ability_service.getRoot())
        },
      },
      methods: {
        canManageAbilities(model, entity = null, ownedVia = 'user_id') {
          const abilities = this.ability_service.manageAbilities(
            model,
            entity,
            ownedVia
          )
          return this.bouncer.canAny(abilities)
        },
        canView(model, entity = null, ownedVia = 'user_id') {
          return this.bouncer.can(
            this.ability_service.view(model),
            model,
            entity,
            ownedVia
          )
        },
        canManage(model, entity = null, ownedVia = 'user_id') {
          return this.bouncer.can(
            this.ability_service.manage(model),
            model,
            entity,
            ownedVia
          )
        },
        canCreate(model, entity = null, ownedVia = 'user_id') {
          return this.bouncer.can(
            this.ability_service.create(model),
            model,
            entity,
            ownedVia
          )
        },
        canManageOrCreate(model, entity = null, ownedVia = 'user_id') {
          return (
            this.canManage(model, entity, ownedVia) ||
            this.canCreate(model, entity, ownedVia)
          )
        },
        canUpdate(model, entity = null, ownedVia = 'user_id') {
          return this.bouncer.can(
            this.ability_service.update(model),
            model,
            entity,
            ownedVia
          )
        },
        canManageOrUpdate(model, entity = null, ownedVia = 'user_id') {
          return (
            this.canManage(model, entity, ownedVia) ||
            this.canUpdate(model, entity, ownedVia)
          )
        },
        canDestroy(model, entity = null, ownedVia = 'user_id') {
          return this.bouncer.can(
            this.ability_service.destroy(model),
            model,
            entity,
            ownedVia
          )
        },
        canManageOrDestroy(model, entity = null, ownedVia = 'user_id') {
          return (
            this.canManage(model, entity, ownedVia) ||
            this.canDestroy(model, entity, ownedVia)
          )
        },
        canViewHistory(model, entity = null, ownedVia = 'user_id') {
          return this.bouncer.can(
            this.ability_service.history(model),
            model,
            entity,
            ownedVia
          )
        },
        canMakeAction(action, model, entity = null, ownedVia = 'user_id') {
          return this.bouncer.can(
            this.ability_service.custom(action, model),
            model,
            entity,
            ownedVia
          )
        },
      },
    })
  },
}

export default BouncerMixin
