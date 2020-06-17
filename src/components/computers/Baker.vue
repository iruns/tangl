<template>
  <div
    v-if = "baked && baked.meta.ready"
    >
    <!-- props -->
    <prop
      v-for = "propId in allPropIds"
      :key = "propId"

      :parentId = "logId"
      :id = "propId"
      :sources = "propSources"
      :paths = "propPaths"
      :parentState = "baked.data"
      />
    <!-- blueprint -->
    <template
      v-if = "merged.bp"
      >
      <blueprint
        :parentId = "logId"
        :sources = "blueprintSources"
        :paths = "blueprintPaths"
        :parentState = "merged.bp"
        />
      <baker
        :item = "merged.bp.data"
        :parentState = "baked.data"
        :id = "id"
        :bpLevel = "bpLevel + 1"
        />
    </template>
  </div>
</template>

<script>

import Vue from 'vue'
import {
  mapState,
  mapActions,
} from 'vuex'
import hash from 'object-hash'

import Prop from './Prop'
import Blueprint from './Blueprint'

import {collectVals} from '@/utils/item'

import WatchedSetIds from './WatchedSetIds'
import WatchedSetPathCheck from './WatchedSetPathCheck'

export default {
  name: 'baker',
  components: {
    Prop,
    Blueprint,
  },
  props: [
    'parentState',
    'id',
    'bpLevel',
    'item',
  ],
  data () {
    return {
      logId: '',

      watchedPropIds: new WatchedSetIds(),
      watchedBlueprints: new WatchedSetPathCheck(),

      baked: null,
      mergedSourceSet: {},

      allPropIds: [],
      propPaths: ['sources.mergedSourceSet', 'sources.item'],
      blueprintPaths: [],

      // container for merged blueprint, which will be
      // used by child baker
      merged: {},

      watchers: [],
      mergedSourceSetWatchers: [],
    }
  },
  computed: {
    ...mapState({
      mergedSourceSets: state => state.item.mergedSourceSets,
    }),
    propSources () {
      return {
        mergedSourceSet: this.mergedSourceSet.data,
        item: this.item
      }
    },
    blueprintSources () {
      return {
        mergedSourceSet: this.mergedSourceSet,
        item: this.item
      }
    },
  },
  created () {
    const {
      parentState, id, bpLevel,
      setBakedContainer, collectSourceIds,
      watchers, watchedPropIds, watchedBlueprints,
      merged, setBlueprintContainer
    } = this

    this.logId = id + '-bkr-'.repeat(bpLevel || 0)

    // create container for the baked version
    setBakedContainer({parentState, id, bpLevel})
    this.baked = parentState[!bpLevel ? id : 'bp']

    watchers.push(
      // watch source items
      this.$watch(
        'item.ps.p_base_item', collectSourceIds
      ),
      this.$watch(
        'item.ps.p_class', collectSourceIds
      ),
    )
    // collect for the first time
    collectSourceIds()

    // collect propIds
    watchedPropIds.init({
      vm: this,
      type: 'Object',
      paths: ['mergedSourceSet.data', 'item'],
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
      paths: ['mergedSourceSet.data', 'item'],
      getFullPath (path) {
        return path + '.bp'
      },
      getOutputPath (path) {
        return 'sources.' + path + '.bp.data'
      },
      onChange: (paths) => {
        // if blueprint exists, create container (if new)
        // else, delete
        setBlueprintContainer({
          parentState: merged,
          remove: paths.length === 0
        })
        // and update the paths
        Vue.set(this, 'blueprintPaths', paths)
      }
    })
  },
  methods: {
    ...mapActions('item', [
      'setSourceSetContainer',
      'setBakedContainer',
      'setBakedSourceSet',
      'setBakedStatus',
      'setBlueprintContainer',
    ]),
    // collect item ids and create sourceSet in the state
    // which will create MergedSourceSet component
    // to calculate the baked version of the item items
    collectSourceIds () {
      const {
        id, item, bpLevel,
        baked, mergedSourceSets, mergedSourceSetWatchers,
        setSourceSetContainer, setBakedSourceSet,
        processMergedSourceSet,
      } = this
      // list of directly item items (base_item & class)
      const sourceItemIds = {
        baseItem: [],
        class: [],
      }
      if (item.ps) {
        sourceItemIds.baseItem = collectVals(item.ps.p_base_item)
        sourceItemIds.class = collectVals(item.ps.p_class)
      }

      // TODO maybe check for items that act as both
      // class and baseItem as that doesn't make sense,
      // both here and in the SourceSet

      // if different from prev
      const mergedSourceSetHash = hash(sourceItemIds).substr(0, 7)

      if (mergedSourceSetHash !== baked.meta.mergedSourceSetHash) {
        // create/update item set of this hash
        // and remove this from oldHash
        setSourceSetContainer({
          id,
          bpLevel,
          oldHash: baked.meta.mergedSourceSetHash,
          hash: mergedSourceSetHash,
          sourceItemIds,
        })
        this.mergedSourceSet = mergedSourceSets[mergedSourceSetHash]
        // update the bakedItem
        setBakedSourceSet({
          meta: baked.meta,
          mergedSourceSetHash,
          sourceItemIds
        })
        // unlisten to old mergedSourceSetWatchers
        mergedSourceSetWatchers.map(unwatch => unwatch())
        // re-listen
        mergedSourceSetWatchers.push(
          // listen to mergedSourceSet's sources
          // (to check for circular dependencies)
          this.$watch(
            'mergedSourceSet.meta.conflicts.circularDependency.' + id,
            processMergedSourceSet
          ),
          // and its readiness
          this.$watch(
            'mergedSourceSet.meta.ready',
            processMergedSourceSet
          ),
        )
        // try to process in case the set was already created
        processMergedSourceSet()
      }
    },
    // check mergedSourceData, and determine the status of the
    // bakedItem
    processMergedSourceSet () {
      const {
        id, bpLevel,
        baked, mergedSourceSet,
        setBakedStatus
      } = this

      const sourcesReady = mergedSourceSet.meta.ready
      const circularDependency =
        mergedSourceSet.meta.conflicts
          .circularDependency[bpLevel][id]
      // if the source is ready AND no circularDependency with self
      let ready =
        sourcesReady &&
        !circularDependency.baseItem &&
        !circularDependency.class &&
        !circularDependency.classOfClass
      // if ready, create bakedItem container.data
      // which will trigger deployment of Props and Blueprints
      setBakedStatus({
        meta: baked.meta, ready, sourcesReady
      })
    },
  },
  beforeDestroy () {
    const {
      parentState, id, bpLevel,
      baked,
      setSourceSetContainer, setBakedContainer,
      watchers, mergedSourceSetWatchers,
      watchedPropIds, watchedBlueprints,
    } = this

    // remove self from various data in the state
    setSourceSetContainer({
      id,
      bpLevel,
      oldHash: baked.meta.mergedSourceSetHash
    })
    setBakedContainer({
      parentState,
      id,
      bpLevel,
      remove: true
    })
    watchedPropIds.destroy()
    watchedBlueprints.destroy()
    watchers.map(unwatch => unwatch())
    mergedSourceSetWatchers.map(unwatch => unwatch())
  },
}
</script>
