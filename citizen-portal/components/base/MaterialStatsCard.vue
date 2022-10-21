<template>
  <base-material-card
    :icon="icon"
    class="v-card--material-stats"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #after-heading>
      <div :class="$vuetify.rtl ? 'text-left mr-auto' : 'text-right ml-auto'">
        <div class="body-3 grey--text font-weight-light" v-text="title" />
        <h3
          v-if="animatedNumber"
          class="display-2 font-weight-regular text--primary"
        >
          <animated-number
            :value="value"
            round
            :format-value="nFormatter"
            :duration="800"
          />
        </h3>
        <h3 v-else class="display-2 font-weight-light text--primary">
          {{ value }} <small>{{ smallValue }}</small>
        </h3>
      </div>
    </template>

    <v-col cols="12" class="px-0">
      <v-divider />
    </v-col>

    <v-icon :color="subIconColor" size="16" class="ml-2 mr-1">
      {{ subIcon }}
    </v-icon>

    <span
      v-if="!!subText"
      :class="subTextColor"
      class="caption grey--text font-weight-light"
      v-text="subText"
    />
    <v-time-ago
      v-if="!!timeAgo"
      :loading="progress"
      :prefix="$t('buttons.Updated')"
      classes="caption grey--text font-weight-light"
      :date-time="timeAgo"
    />
    <v-spacer />
    <slot />
    <v-progress-linear
      color="deep-purple accent-4"
      indeterminate
      rounded
      :active="progress"
      height="6"
    ></v-progress-linear>
  </base-material-card>
</template>

<script>
import AnimatedNumber from 'animated-number-vue'
import Card from '@/components/base/Card'
export default {
  name: 'MaterialStatsCard',
  components: {
    BaseMaterialCard: () => import('@/components/base/MaterialCard'),
    VTimeAgo: () => import('@/components/base/TimeAgo'),
    AnimatedNumber,
  },
  inheritAttrs: false,
  props: {
    ...Card.props,
    icon: {
      type: String,
      required: true,
    },
    subIcon: {
      type: String,
      default: undefined,
    },
    subIconColor: {
      type: String,
      default: undefined,
    },
    subTextColor: {
      type: String,
      default: undefined,
    },
    subText: {
      type: [String, Number],
      default: undefined,
    },
    timeAgo: {
      type: [String, Number],
      default: undefined,
    },
    title: {
      type: [String, Number],
      default: undefined,
    },
    value: {
      type: [String, Number],
      default: undefined,
    },
    smallValue: {
      type: [String, Number],
      default: undefined,
    },
    animatedNumber: {
      type: Boolean,
      default: false,
    },
    withFormatter: {
      type: Boolean,
      default: true,
    },
    progress: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    nFormatter(num) {
      if (this.withFormatter) {
        if (Math.abs(num) > 999 && Math.abs(num) <= 999999) {
          return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K'
        }
        if (Math.abs(num) > 999999) {
          return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + 'M'
        }
        return Math.sign(num) * Math.abs(num).toFixed(0)
      }
      return num
    },
  },
}
</script>

<style lang="sass">
.v-card--material-stats
  display: flex
  flex-wrap: wrap
  position: relative

  > div:first-child
    justify-content: space-between

  .v-card
    border-radius: 4px
    flex: 0 1 auto

  .v-card__text
    display: inline-block
    flex: 1 0 calc(100% - 120px)
    position: absolute
    top: 0
    right: 0
    width: 100%

  .v-card__actions
    flex: 1 0 100%
</style>
