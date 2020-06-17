<template>
  <v-chip
    small

    :close = "used"
    @input = "saveOrderedObject({
      path: ['filter', category],
      id
    })"
    :text-color = "active ? 'black' : 'grey darken-3'"
    :color = "active ? 'secondary' : 'grey lighten-2'"
    @click = "saveOrderedObject({
      path: ['filter', category],
      id,
      value: !active
    })"
    :class = "[
      'item-chip noselect',
      'ml-0',
      used ? 'used' : ''
    ]"
    :style = "used ? '' : 'opacity:.5'"
    >
    {{label ? label : '...'}}
  </v-chip>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'toggle-chip',
  props: [
    'category',
    'id',
    'label',
    'active',
    'used',
  ],
  computed: {
    // if special, filters, set to permanent
    permanent () {
      return (
        this.$props.id === 'any' ||
          this.$props.id === 'none' ||
          this.$props.id === 'item'
      )
    }
  },
  methods: {
    ...mapActions('spread', [
      'saveOrderedObject',
    ]),
  }
}
</script>
