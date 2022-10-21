import { map, pick, find } from 'lodash'
export default class Bouncer {
  /**
   * Constructor
   *
   * @param user
   */
  constructor(user) {
    if (!user) {
      this.id = null
      this.abilities = []
      this.roles = []
      return
    }
    const abilityMapper = (ability) => {
      return pick(ability, [
        'id',
        'entity_id',
        'entity_type',
        'name',
        'forbidden',
        'only_owned',
        'title',
      ])
    }
    this.id = user.id
    this.roles = map(user.roles, (role) => pick(role, ['name', 'title']))
    this.abilities = map(user.abilities || [], abilityMapper)
  }

  /**
   * Find the abilities that give the user permission to do the ability we are
   * checking and if we have one and the ability isn't one that forbids them
   * then we return true.
   *
   * @param abilityName
   * @param entityType
   * @param entity
   * @returns {boolean}
   */
  can(abilityName, entityType = null, entity = null, ownedVia = 'user_id') {
    // Filter abilities to only ones that might be relevant to the given ability name.
    const abilities = this.abilities.filter((ability) => {
      if (abilityName === ability.name || ability.name === '*') {
        if (ability.entity_type === '*') {
          return true
        }

        // if the ability has only_owned set to true entities to be allowed to be accessed
        // then we need to check that the entity's user_id matches the id of our
        // user
        if (ability.only_owned) {
          if (entity === null || entityType === null) {
            return false
          }

          if (
            entityType === ability.entity_type &&
            entity[ownedVia] !== this.id
          ) {
            return false
          }
        }

        if (ability.entity_type && !ability.entity_id) {
          return (ability.entity_type || '')
            .split('/')
            .pop()
            .toLowerCase()
            .includes((entityType || '').toLowerCase())
        }

        if (ability.entity_id) {
          return entity && entity.id === ability.entity_id
        }

        return true
      }

      return false
    })

    // if there are no relevant abilities or some of the relevant abilities are
    // forbidden then return false
    if (
      abilities.length === 0 ||
      abilities.some((ability) => ability.forbidden)
    ) {
      return false
    }

    return true
  }

  /**
   * Determine multiple user's abilities
   *
   * @param abilities[]
   * @returns {boolean}
   */
  canAny(abilities) {
    if (abilities && Array.isArray(abilities)) {
      const canAny = abilities.map((ability) => {
        return this.can(
          ability.name,
          ability.entity_type || null,
          ability.entity || null
        )
      })

      return canAny.some((can) => can === true)
    } else if (typeof abilities === 'string') {
      return this.can(abilities)
    }
  }

  /**
   * Determine if the user's roles contain any of the roles we are looking for
   *
   * @param roles
   * @returns {*}
   */
  isA(roles) {
    roles = typeof roles === 'string' ? Array.from(arguments) : roles
    return roles.some((name) => {
      return find(this.roles, { name })
    })
  }

  /**
   * Semantic method for can
   *
   * @param abilityName
   * @param entityType
   * @param entity
   * @returns {boolean}
   */
  cannot(abilityName, entityType = null, entity = null) {
    return !this.can(abilityName, entityType, entity)
  }

  /**
   * Semantic method fro isA
   *
   * @param roles
   * @returns {boolean}
   */
  isNotA(roles) {
    return !this.isA(roles)
  }

  /**
   * Semantic method fro isA
   *
   * @param roles
   * @returns {boolean}
   */
  isNotAn(roles) {
    return !this.isA(roles)
  }

  /**
   * Semantic method fro isA
   *
   * @param roles
   * @returns {boolean}
   */
  isAn(roles) {
    return this.isA(roles)
  }
}
