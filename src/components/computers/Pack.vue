<template>
  <div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex'
import _ from 'lodash'

import WatchedSetIds from './WatchedSetIds'

export default {
  name: 'pack',
  props: [
    'id',
    'include',

    'itemIds',
    'sourceSetHashes',
    'classIds',
  ],
  data () {
    return {
      watchedSourceSetHashes: new WatchedSetIds(),
    }
  },
  computed: {
    ...mapState({
      packIncludes: state => state.pack.includes,
    }),
    ...mapState('item', [
      'bakedItems',
      'mergedSourceSets',
      'instanceIds',
    ]),
    includedIds () {
      return this.include.order || []
    },
    configs () {
      return this.include.config || {}
    },
  },
  created () {
    const {
      id,
      setSourceSetHashesByPack,
    } = this
    this.setInstanceIdsByPackContainer({
      packId: id,
    })
    this.watchedSourceSetHashes.init({
      vm: this,
      type: 'String',
      paths: this.itemIds,
      getFullPath (itemId) {
        return 'bakedItems.' +
            itemId +
            '.meta.mergedSourceSetHash'
      },
      onChange (ids) {
        setSourceSetHashesByPack({
          packId: id,
          sourceSetHashes: ids
        })
      },
    })
  },
  watch: {
    includedIds (includedIds) {
      // bind included, and unbind unincluded
      this.updatePackIncluder({
        includer: this.id,
        ids: includedIds
      })
    },
    configs () {
      // collect the configs
      const spreads = {}
      const items = {}

      this.includedIds.map(id => {
        const config = this.configs[id]
        if (config) {
          if (config.spreads !== false) {
            spreads[id] = this.configs[id].spreads === 0
          }
          if (config.items !== false) {
            items[id] = this.configs[id].items === 0
          }
        }
      })
      // bind included, and unbind unincluded
      this.updateSpreadIncluder({
        includer: this.id,
        config: spreads
      })
      // bind included, and unbind unincluded
      this.updateItemIncluder({
        includer: this.id,
        config: items
      })
    },
    itemIds: 'updateSourceSets',
    sourceSetHashes: 'updateClasses',
  },
  methods: {
    ...mapActions({
      updatePackIncluder: 'pack/updateIncluder',
      updateSpreadIncluder: 'spread/updateIncluder',
      updateItemIncluder: 'item/updateIncluder',
    }),
    ...mapActions('item', [
      'setSourceSetHashesByPack',
      'setInstanceIdsByPackContainer',
      'setClassIdsByPack',
    ]),
    updateSourceSets (itemIds) {
      this.watchedSourceSetHashes.setPaths(itemIds)
    },
    updateClasses (sourceSetHashes) {
      const classIds = []
      sourceSetHashes.map(hash => {
        classIds.push(
          ..._.keys(this.mergedSourceSets[hash].meta.allSourceItemIds.class)
        )
      })
      this.setClassIdsByPack({
        packId: this.id,
        classIds
      })
    },
  },
  beforeDestroy () {
    const {
      id
    } = this
    // remove self from the included packs' includers
    this.updatePackIncluder({includer: id})
    // remove self from the included spreads' includers
    this.updateSpreadIncluder({includer: id})
    // remove self from the included items' includers
    this.updateItemIncluder({includer: id})
    // unwatch
    this.watchedSourceSetHashes.destroy()
    // remove self from the byPacks
    this.setInstanceIdsByPackContainer({packId: id, remove: true})
    this.setSourceSetHashesByPack({packId: id, remove: true})
    this.setClassIdsByPack({packId: id, remove: true})
  },
}
</script>
