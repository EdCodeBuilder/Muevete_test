<template>
  <v-list-group
    :group="group"
    :prepend-icon="item.icon"
    :sub-group="subGroup"
    append-icon="mdi-menu-down"
    :color="textColor"
  >
    <template #activator>
      <v-list-item-icon
        v-if="text"
        class="v-list-item__icon--text"
        v-text="computedText"
      />

      <v-list-item-avatar
        v-else-if="item.avatar"
        class="align-self-center elevation-12"
        color="white"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="mt-1" v-html="identicon"></div>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title
          class="text-capitalize font-weight-bold"
          v-text="item.title"
        />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in children">
      <base-item-sub-group
        v-if="child.children"
        :key="`sub-group-${i}`"
        :item="child"
      />
      <base-item v-else :key="`item-${i}`" :item="child" text />
    </template>
  </v-list-group>
</template>

<script>
// Utilities
import { toSvg } from 'jdenticon'
import Item from '@/components/base/Item'
import ItemSubGroup from '@/components/base/ItemSubGroup'
import kebabCase from 'lodash/kebabCase'

export default {
  name: 'ItemGroup',
  components: {
    BaseItem: Item,
    BaseItemSubGroup: ItemSubGroup,
  },
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: [],
      }),
    },
    subGroup: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    textColor() {
      const bg = ![
        'rgba(228, 226, 226, 0.3), rgba(255, 255, 255, 0.8)',
        'rgba(33, 147, 176, .2), rgba(109, 213, 237, .6)',
      ].includes(this.bgColor)
      return bg ? 'white' : 'grey darken-1'
    },
    bgColor: {
      get() {
        return this.$store.getters['app/getBarColor']
      },
      set(val) {
        this.$store.dispatch('app/serBarColor', val)
      },
    },
    children() {
      return this.item.children.map((item) => {
        let to
        if (item.to && typeof item.to === 'object') {
          to = item.to
        }
        if (item.to && typeof item.to === 'string') {
          to = `${this.item.group}/${item.to}`
        }
        return {
          ...item,
          to,
        }
      })
    },
    computedText() {
      if (!this.item || !this.item.title) return ''

      let text = ''

      this.item.title.split(' ').forEach((val) => {
        text += val.substring(0, 1)
      })

      return text
    },
    group() {
      return this.genGroup(this.item.children)
    },
    identicon() {
      return toSvg(this.item.avatar, 40)
    },
  },
  methods: {
    genGroup(children) {
      return children
        .filter((item) => item.to)
        .map((item) => {
          let to = ''
          if (typeof item.to === 'object') {
            to = item.to.name
          }
          if (typeof item.to === 'string') {
            to = item.to
          }
          const parent = item.group || this.item.group
          let group = `${parent}/${kebabCase(to)}`

          if (item.children) {
            group = `${group}|${this.genGroup(item.children)}`
          }

          return group
        })
        .join('|')
    },
  },
}
</script>

<style>
.v-list-group__activator p {
  margin-bottom: 0;
}
</style>
