<template>
  <v-footer id="landing-core-footer" color="transparent">
    <v-container>
      <v-row align="center" no-gutters>
        <v-col
          v-for="(link, i) in links"
          :key="i"
          class="text-center"
          cols="6"
          md="auto"
        >
          <a
            :href="link.href"
            class="mr-0"
            rel="noopener"
            target="_blank"
            v-text="link.text"
          />
        </v-col>

        <v-spacer class="hidden-sm-and-down" />

        <v-col cols="12" md="auto">
          <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
            {{ `© ${$moment().year()} IDRD, ${$t('footer.made')}` }}
            <v-icon class="mx-1" size="20">mdi-heart</v-icon>
            {{ `${$t('footer.web')}` }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'PagesCoreFooter',
  data: () => ({
    links: [
      {
        href: 'https://idrd.gov.co',
        text: 'IDRD',
      },
    ],
  }),
}
</script>

<style lang="sass">
.theme--dark
  #landing-core-footer
        a
            color: #FFFFFF
            font-size: .825rem
            font-weight: 500
            text-decoration: none
            text-transform: uppercase
.theme--light
  #landing-core-footer
    a
      color: #616161
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
