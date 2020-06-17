<template>
  <div
    id = 'items'
    v-if = "lastPositions"
    :style = "{
      'transform-origin': '0 0',
      transform:
        'translate(' +
          (position.x + scale.dx) + 'px,' +
          (position.y + scale.dy) + 'px) ' +
        'scale(' + scale.s + ')',
    }"
    >
    <item
      v-for = "itemId in activeItems"
      v-if = "bakedItems[itemId]"
      :key = "itemId"

      :itemId = "itemId"
      :data = "bakedItems[itemId].data"

      :infos = "infos"

      :propsFilter = "propsFilter"
      :classStyle = "classStyle"
      :propStyle = "propStyle"

      :lastPosition = "lastPositions[itemId]"

      :scale = "scale.s"
      :dimension = "dimensions[itemId]"
      :position = "positions[itemId] || {x: 0, y: 0}"
      :hidden = "positions[itemId] ? false : true"
      :targetPosition = "targetPositions[itemId]"
      />
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
} from 'vuex'

import Item from './Item'
// import LayoutResolver from './LayoutResolver'

export default {
  name: 'items',
  components: {
    Item,
    // LayoutResolver
  },
  props: [
    'activeItems',
    'position',
    'scale',
  ],
  // TODO create system to test particularly expensive
  // reaction triggering mutations
  computed: {
    ...mapGetters('spread', [
      'lastPositions',
      'propsFilter',
      'classStyle',
      'propStyle',
    ]),
    ...mapState('item', [
      'bakedItems',
      'infos',

      'dimensions',
      'positions',
      'targetPositions',
    ]),
  },
}
</script>

<style>
  #items {
    transform-origin: 700px 700px;
  }
  .move-move {
    transition: transform 1s;
  }
</style>
