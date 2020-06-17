<template></template>

<script>

import {
  mapState,
  mapActions,
} from 'vuex'
import _ from 'lodash'

import WatchedSetIds from 'WatchedSetIds'

export default {
  name: 'pack',
  props: [
    'id',
    'include',
  ],
  data () {
    watchedsourceSetHashes: new WatchedSetIds()
  },
  computed: {
    ...mapState({
      packIncludes: state => state.pack.includes,
    }),
    includedIds () {
      return this.include.order || []
    },
    configs () {
      return this.include.config || {}
    },
  },
  created () {

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
  },
  methods: {
    ...mapActions({
      updatePackIncluder: 'pack/updateIncluder',
      updateSpreadIncluder: 'spread/updateIncluder',
      updateItemIncluder: 'item/updateIncluder',
    }),
  },
  beforeDestroy () {
    // remove self from the included packs' includers
    this.updatePackIncluder({includer: this.id})
    // remove self from the included spreads' includers
    this.updateSpreadIncluder({includer: this.id})
    // remove self from the included items' includers
    this.updateItemIncluder({includer: this.id})
  },
}
</script>
