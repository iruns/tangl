<template>
  <draggable
    v-model = "baseSpreads"
    element = "v-list"
    :component-data = "{
      props: {
        dense: true
      }
    }"
    class = "grey lighten-4"
    >
    <spread-button
      v-for = "id in baseSpreads"
      v-if = "infos[id]"
      :key = "id"
      :info = "infos[id]"

      :animate = "true"

      :hoveredSpread = "id === hoveredId"
      :hover = "hover"
      :unhover = "unhover"

      :right = "true"
      />
  </draggable>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'
import Draggable from 'vuedraggable'
import SpreadButton from '../lists/SpreadButton'

export default {
  name: 'base-spreads',
  components: {
    Draggable,
    SpreadButton,
  },
  computed: {
    ...mapState('spread', [
      'selectedId',
      'hoveredId',
      'infos',
    ]),
    ...mapGetters('spread', [
      'baseSpreads',
    ]),
  },
  methods: {
    ...mapActions('spread', [
      'hover',
      'unhover',
    ]),
  }
}
</script>
