<template>
  <v-footer :dark="isDark" absolute color="transparent">
    <v-spacer></v-spacer>
    {{ `© ${$moment().year()} IDRD, ${$t('footer.made')}` }}
    <v-icon class="mx-1" size="20">mdi-heart</v-icon>
    {{ `${$t('footer.web')}` }}
    <v-spacer></v-spacer>
  </v-footer>
</template>

<script>
export default {
  name: 'CoreFooter',
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
