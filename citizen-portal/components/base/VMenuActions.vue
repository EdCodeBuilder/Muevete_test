<template>
  <v-menu offset-y left>
    <template #activator="{ on: menu, attrs }">
      <v-tooltip left>
        <template #activator="{ on: tooltip }">
          <v-btn
            :aria-label="$t('buttons.MoreOptions')"
            icon
            v-bind="{ ...attrs, ...$attrs }"
            v-on="{ ...menu, ...tooltip }"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <i18n path="buttons.MoreOptions" tag="span" />
      </v-tooltip>
    </template>
    <v-list dense>
      <slot name="prepend-options" />
      <template v-for="(action, i) in actions">
        <v-list-item
          v-if="action.show"
          :key="i"
          @click="
            action.requireParams
              ? action.function(getParams(action.params || {}))
              : action.function()
          "
        >
          <v-list-item-icon>
            <v-icon v-text="action.icon" />
          </v-list-item-icon>
          <v-list-item-title v-text="action.name" />
        </v-list-item>
      </template>
      <slot name="append-options" />
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'VMenuActions',
  props: {
    actions: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  methods: {
    getParams(params) {
      return {
        ...this.item,
        ...params,
      }
    },
  },
}
</script>
