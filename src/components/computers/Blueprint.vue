<template>
  <div>
    <!-- props -->
    <prop
      v-for = "propId in allPropIds"
      :key = "propId"

      :parentId = "parentId + '-blu-'"
      :id = "propId"
      :sources = "sources"
      :paths = "paths"
      :parentState = "parentState.data"
      />
    <!-- blueprint -->
    <blueprint
      v-if = "blueprintPaths.length > 0"
      :parentId = "parentId + '-blu-'"
      :sources = "sources"
      :paths = "blueprintPaths"
      :parentState = "parentState.data.bp"
      />
  </div>
</template>

<script>

import Vue from 'vue'
import {
  mapActions,
} from 'vuex'

import Prop from './Prop'

import WatchedSetIds from './WatchedSetIds'
import WatchedSetPathCheck from './WatchedSetPathCheck'

export default {
  name: 'blueprint',
  components: {
    Prop,
  },
  props: [
    'parentId',
    'sources',
    'paths',
    'parentState'
  ],
  data () {
    return {
      watchedPropIds: new WatchedSetIds(),
      watchedBlueprints: new WatchedSetPathCheck(),

      allPropIds: [],
      blueprintPaths: [],
    }
  },
  created () {
    const {
      paths, parentState,
      watchedPropIds, watchedBlueprints,
      setBlueprintContainer
    } = this
    // collect propIds
    watchedPropIds.init({
      vm: this,
      type: 'Object',
      paths,
      getFullPath (path) {
        return path + '.ps'
      },
      onChange: (allPropIds) => {
        Vue.set(this, 'allPropIds', allPropIds)
      }
    })
    // collect available blueprints
    watchedBlueprints.init({
      vm: this,
      paths,
      getFullPath (path) {
        return path + '.bp'
      },
      getOutputPath (path) {
        return path + '.bp.data'
      },
      onChange: (paths) => {
        // if blueprint exists, create container (if new)
        // else, delete
        setBlueprintContainer({
          parentState: parentState.data,
          remove: paths.length === 0
        })
        // and update the paths
        Vue.set(this, 'blueprintPaths', paths)
      }
    })
  },
  watch: {
    paths (val) {
      this.watchedPropIds.setPaths(val)
      this.watchedBlueprints.setPaths(val)
    }
  },
  methods: {
    ...mapActions('item', [
      'setBlueprintContainer',
    ]),
  },
  beforeDestroy () {
    this.watchedPropIds.destroy()
    this.watchedBlueprints.destroy()
  }
}
</script>
