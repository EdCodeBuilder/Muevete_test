import Bouncer from '~/utils/Bouncer'

const state = () => ({
  locales: ['en', 'es'],
  locale: 'es',
  darker: false,
  darkType: 'auto',
  activeColor: 'primary',
  barImage: require('@/static/sidebar/sidebar-1.jpg'),
  barColor: 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
  drawer: null,
  rightDrawer: null,
  clipped: false,
  miniVariant: false,
  showSnack: false,
  rtl: false,
  snackBar: [],
  menu: [],
  permissions: [],
  bouncer: new Bouncer({
    id: null,
    roles: [],
    abilities: [],
  }),
  sw: {
    install: null,
    update: null,
  },
})

export default state
