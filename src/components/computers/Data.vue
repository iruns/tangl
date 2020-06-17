<template>
  <div>
    <pack
      v-for = "(include, id) in includes"
      :key = "id"

      :id = "id"
      :include = "include"

      :itemIds = "itemIdsByPack[id]"
      :sourceSetHashes = "sourceSetHashesByPack[id]"
      :classIds = "classIdsByPack[id]"
      />
    <spread
      v-for = "(config, id) in configs"
      :key = "id"

      :id = "id"
      :config = "config"
      />
    <item
      v-for = "(item, itemId) in items"
      :key = "itemId"

      :id = "itemId"
      :item = "item"
      />
    <source-set
      v-for = "(sourceSet, hash) in mergedSourceSets"
      :key = "hash"

      :hash = "hash"
      :sourceSet = "sourceSet"
      />
    <class-comp
      v-for = "(sourceSetHashes, classId) in sourceSetHashesByClass"
      :key = "'cc/' + classId"

      :id = "classId"
      :sourceSetHashes = "sourceSetHashes"
      :classItem = "bakedItems[classId]"
      :items = "items"
      />
  </div>
</template>

<script>

import {
  mapState,
} from 'vuex'

import Pack from './Pack'
import Spread from './Spread'
import Item from './Item'
import SourceSet from './SourceSet'
import ClassComp from './ClassComp'

export default {
  name: 'data-computer',
  components: {
    Pack,
    Spread,
    Item,
    SourceSet,
    ClassComp,
  },
  computed: {
    ...mapState('pack', [
      'includes',
    ]),
    ...mapState('spread', [
      'configs',
    ]),
    ...mapState('item', [
      'items',
      'bakedItems',
      'mergedSourceSets',

      'sourceSetHashesByClass',

      'itemIdsByPack',
      'sourceSetHashesByPack',
      'classIdsByPack',
    ]),
  }
}
</script>
