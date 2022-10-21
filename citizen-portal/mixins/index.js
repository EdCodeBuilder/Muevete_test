import DrawerMixin from '~/mixins/menu'
import ExcelMixin from '~/mixins/excel'
import BouncerMixin from '~/mixins/bouncer'

export default {
  install(Vue) {
    Vue.use(DrawerMixin)
    Vue.use(ExcelMixin)
    Vue.use(BouncerMixin)
  },
}
