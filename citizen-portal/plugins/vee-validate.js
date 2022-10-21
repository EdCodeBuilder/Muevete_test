import Vue from 'vue'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  configure,
} from 'vee-validate'
/* eslint import/namespace: ['error', { allowComputed: true }] */
import * as rules from 'vee-validate/dist/rules'
import alphaDots from '@/plugins/validations/alpha_dots'

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule])
})

export default function ({ app }) {
  extend('alpha_dots', (value) => {
    return (alphaDots[app.i18n.locale] || alphaDots.es).test(value)
  })
  extend('url', (value) => {
    let url = null
    try {
      url = new URL(value)
    } catch (_) {
      return false
    }
    return ['http:', 'https:'].includes(url.protocol)
  })
  extend('date_format', {
    validate(value, { format }) {
      return app.$moment(value, format, true).isValid()
    },
    params: ['format'],
  })
  extend('greater_than_or_equal_to', {
    validate(value, { target }) {
      return (
        app.$moment(value).isValid() &&
        app.$moment(target).isValid() &&
        app.$moment(value).isSameOrAfter(app.$moment(target))
      )
    },
    params: [
      {
        name: 'target',
        isTarget: true,
      },
    ],
  })
  extend('less_than_or_equal_to', {
    validate(value, { target }) {
      return (
        app.$moment(value).isValid() &&
        app.$moment(target).isValid() &&
        app.$moment(value).isSameOrBefore(app.$moment(target))
      )
    },
    params: [
      {
        name: 'target',
        isTarget: true,
      },
    ],
  })
  extend('greater_than', {
    validate(value, { target }) {
      return (
        app.$moment(value).isValid() &&
        app.$moment(target).isValid() &&
        app.$moment(value).isBefore(app.$moment(target))
      )
    },
    params: [
      {
        name: 'target',
        isTarget: true,
      },
    ],
  })
  extend('less_than', {
    validate(value, { target }) {
      return (
        app.$moment(value).isValid() &&
        app.$moment(target).isValid() &&
        app.$moment(value).isBefore(app.$moment(target))
      )
    },
    params: [
      {
        name: 'target',
        isTarget: true,
      },
    ],
  })
  extend('date_equal_to', {
    validate(value, { target }) {
      return (
        app.$moment(value).isValid() &&
        app.$moment(target).isValid() &&
        app.$moment(value).isSame(app.$moment(target))
      )
    },
    params: [
      {
        name: 'target',
        isTarget: true,
      },
    ],
  })
  extend('date_is_between', {
    validate(value, { min, max }) {
      return (
        app.$moment(value).isValid() &&
        app.$moment(min).isValid() &&
        app.$moment(max).isValid() &&
        app.$moment(value).isBetween(app.$moment(min), app.$moment(max))
      )
    },
    params: ['min', 'max'],
  })
  configure({
    defaultMessage: (field, values) => {
      values._field_ = app.i18n.t(`${field}`)
      return app.i18n.t(`validation.${values._rule_}`, values)
    },
  })
}

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
