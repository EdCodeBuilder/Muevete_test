const getters = {
  gerBarImage: (state) => state.barImage,
  getStatusDrawer: (state) => state.drawer,
  getStatusRightDrawer: (state) => state.rightDrawer,
  getClipped: (state) => state.clipped,
  getMiniVariant: (state) => state.miniVariant,
  getBarColor: (state) => state.barColor,
  getActiveColor: (state) => state.activeColor,
  getThemeType: (state) => state.darkType,
  getIsDark: (state) => state.darker,
  getLocale: (state) => state.locale,
  getSnackBar: (state) => state.snackBar,
  getRTL: (state) => state.rtl,
  getSnackBarStatus: (state) => state.showSnack,
  getMenuDrawer: (state) => state.menu,
  getPermissions: (state) => state.permissions,
  bouncer: (state) => state.bouncer,
}

export default getters
