<template>
  <div
    v-if = "sourceSet.meta.ready"
    >
    <!-- props -->
    <prop
      v-for = "propId in allPropIds"
      :key = "propId"

      :parentId = "hash + '-src-'"
      :id = "propId"
      :sources = "bakedItems"
      :paths = "sourceItemPaths"
      :parentState = "sourceSet.data"
      />
    <!-- blueprint -->
    <blueprint
      v-if = "blueprintPaths.length > 0"
      :parentId = "hash + '-src-'"
      :sources = "bakedItems"
      :paths = "blueprintPaths"
      :parentState = "sourceSet.data.bp"
      />
  </div>
</template>

<script>

import Vue from 'vue'
import {
  mapState,
  mapActions,
} from 'vuex'
import _ from 'lodash'

import Prop from './Prop'
import Blueprint from './Blueprint'

import WatchedSetIds from './WatchedSetIds'
import WatchedSetPathCheck from './WatchedSetPathCheck'

export default {
  name: 'source-set',
  components: {
    Prop,
    Blueprint,
  },
  props: [
    'hash',
    'sourceSet',
  ],
  data () {
    return {
      watchedPropIds: new WatchedSetIds(),
      watchedBlueprints: new WatchedSetPathCheck(),

      watchedAllBaseItems: new WatchedSetIds(),
      watchedAllClasses: new WatchedSetIds(),
      watchedAllClassesOfClasses: new WatchedSetIds(),

      watchedBaseItemSourceSets: new WatchedSetIds(),
      watchedClassSourceSets: new WatchedSetIds(),

      sourceItemWatchers: [],
      totalSourceItems: 0,
      readySourceItems: 0,

      sourceItemPaths: [],

      allPropIds: [],
      blueprintPaths: [],
    }
  },
  computed: {
    ...mapState({
      bakedItems: state => state.item.bakedItems,
      mergedSourceSets: state => state.item.mergedSourceSets,
    }),
    sourceItemIds () { return this.sourceSet.meta.sourceItemIds },
  },
  created () {
    const {
      hash,
      sourceSet, bakedItems, sourceItemIds,

      checkSourceItem, sourceItemWatchers, sourceItemPaths,

      watchedPropIds, watchedBlueprints,
      watchedAllBaseItems, watchedAllClasses, watchedAllClassesOfClasses,
      watchedBaseItemSourceSets, watchedClassSourceSets,

      setBlueprintContainer, setAllSourceItemIds,
      setSourceSetHashesByClass,
    } = this

    this.totalSourceItems =
      sourceItemIds.baseItem.length +
      sourceItemIds.class.length

    // check once to make sure
    // even ones with no dependencies get checked
    checkSourceItem()

    const parentPaths = []

    sourceItemIds.class.map(sourceId => {
      // checks the readiness of directly source (baked) items
      sourceItemWatchers.push(
        this.$watch(
          'bakedItems.' + sourceId + '.meta.sourcesReady',
          checkSourceItem
        )
      )
      //    initial call
      checkSourceItem(
        _.get(bakedItems, sourceId + '.meta.sourcesReady')
      )
      // total prop ids from the source items
      parentPaths.push(sourceId + '.data.bp')
      // collect appropriate paths for each class
      sourceItemPaths.push(`sources.${sourceId}.data.bp.data`)
    })
    sourceItemIds.baseItem.map(sourceId => {
      // checks the readiness of directly source (baked) items
      sourceItemWatchers.push(
        this.$watch(
          'bakedItems.' + sourceId + '.meta.sourcesReady',
          checkSourceItem
        )
      )
      //    initial call
      checkSourceItem(
        _.get(bakedItems, sourceId + '.meta.sourcesReady')
      )
      // total prop ids from the source items
      parentPaths.push(sourceId)
      // collect appropriate paths for each baseItem
      sourceItemPaths.push(`sources.${sourceId}.data`)
    })

    // collect propIds
    watchedPropIds.init({
      vm: this,
      type: 'Object',
      paths: parentPaths,
      getFullPath (path) {
        return 'bakedItems.' + path + '.data.ps'
      },
      onChange: (allPropIds) => {
        Vue.set(this, 'allPropIds', allPropIds)
      }
    })
    // collect available blueprints
    watchedBlueprints.init({
      vm: this,
      paths: parentPaths,
      getFullPath (path) {
        return 'bakedItems.' + path + '.data.bp'
      },
      getOutputPath (path) {
        return 'sources.' + path + '.data.bp.data'
      },
      onChange: (paths) => {
        // if blueprint exists, create container (if new)
        // else, delete
        setBlueprintContainer({
          parentState: sourceSet.data,
          remove: paths.length === 0
        })
        // and update the paths
        Vue.set(this, 'blueprintPaths', paths)
      }
    })
    // collect allSourceItems
    watchedAllBaseItems.init({
      vm: this,
      type: 'Object',
      getFullPath (sourceHash) {
        return 'mergedSourceSets.' +
            sourceHash +
            '.meta.allSourceItemIds.baseItem'
      },
      onChange (ids, idCounter) {
        setAllSourceItemIds({
          meta: sourceSet.meta,
          type: 'baseItem',
          ids: _.clone(idCounter),
          idsArray: _.clone(ids),
        })
      },
    })
    watchedAllClasses.init({
      vm: this,
      type: 'Object',
      getFullPath (sourceHash, ...additions) {
        return 'mergedSourceSets.' +
            sourceHash +
            '.meta.allSourceItemIds' + additions[0]
      },
      onChange (ids, idCounter, oldIds) {
        // if changed from none or vice versa
        // update sourceSetHashesByClass
        const emptied = ids.length === 0
        const remove = oldIds.length === 0
        if (emptied || remove) {
          setSourceSetHashesByClass({
            hash,
            classId: 'none',
            remove
          })
        }
        setAllSourceItemIds({
          meta: sourceSet.meta,
          type: 'class',
          ids: _.clone(idCounter),
          idsArray: _.clone(ids),
        })
      },
      onAdd (classId) {
        setSourceSetHashesByClass({
          hash,
          classId,
        })
      },
      onRemove (classId) {
        setSourceSetHashesByClass({
          hash,
          classId,
          remove: true
        })
      },
    })
    watchedAllClassesOfClasses.init({
      vm: this,
      type: 'Object',
      getFullPath (sourceHash, ...additions) {
        return 'mergedSourceSets.' +
            sourceHash +
            '.meta.allSourceItemIds' + additions[0]
      },
      onChange (ids, idCounter) {
        setAllSourceItemIds({
          meta: sourceSet.meta,
          type: 'classOfClass',
          ids: _.clone(idCounter),
          idsArray: _.clone(ids),
        })
      }
    })
    // collectAllSourceItemIds from the direct sourceItemds
    if (sourceItemIds.baseItem.length > 0) {
      this.watchedAllBaseItems.onWatched(
        sourceItemIds.baseItem, null, 'own',
        ids => ids
      )
    }
    if (sourceItemIds.class.length > 0) {
      this.watchedAllClasses.onWatched(
        sourceItemIds.class, null, 'own',
        ids => ids
      )
    } else {
      // else if the class is empty,
      // force add to setSourceSetHashesByClass["none"]
      setSourceSetHashesByClass({
        hash,
        classId: 'none',
      })
    }

    // sourceSets of the directly sourced items,
    // which will be the source to collect allSourceItems
    watchedBaseItemSourceSets.init({
      vm: this,
      type: 'String',
      paths: sourceItemIds.baseItem,
      getFullPath (sourceId) {
        return 'bakedItems.' + sourceId + '.meta.mergedSourceSetHash'
      },
      onAdd (sourceHash) {
        watchedAllBaseItems.addPath(sourceHash)
        watchedAllClasses.addPath(sourceHash, '.class')
        watchedAllClassesOfClasses.addPath(sourceHash, '.classOfClass')
      },
      onRemove (sourceHash) {
        watchedAllBaseItems.removePath(sourceHash)
        watchedAllClasses.removePath(sourceHash, '.class')
        watchedAllClassesOfClasses.removePath(sourceHash, '.classOfClass')
      },
    })
    watchedClassSourceSets.init({
      vm: this,
      type: 'String',
      paths: sourceItemIds.class,
      getFullPath (sourceId) {
        return 'bakedItems.' + sourceId + '.meta.mergedSourceSetHash'
      },
      onAdd (sourceHash) {
        watchedAllClasses.addPath(sourceHash, '.baseItem')
        watchedAllClassesOfClasses.addPath(sourceHash, '.class')
        watchedAllClassesOfClasses.addPath(sourceHash, '.classOfClass')
      },
      onRemove (sourceHash) {
        watchedAllClasses.removePath(sourceHash, '.baseItem')
        watchedAllClassesOfClasses.removePath(sourceHash, '.class')
        watchedAllClassesOfClasses.removePath(sourceHash, '.classOfClass')
      },
    })
  },
  methods: {
    ...mapActions('item', [
      'setSourceSetStatus',
      'setAllSourceItemIds',
      'setBlueprintContainer',

      'setSourceSetHashesByClass',
    ]),
    checkSourceItem (newReady, oldReady) {
      // if from undefined to defined, increment readySourceItems
      if (newReady && !oldReady) {
        this.readySourceItems++
      } else if (!newReady && oldReady) {
        // if the opposite, decrement readySourceItems
        this.readySourceItems--
      }
      // if total === ready, set status to sourcesReady
      this.setSourceSetStatus({
        meta: this.sourceSet.meta,
        sourcesReady: this.readySourceItems === this.totalSourceItems
      })
    }
  },
  beforeDestroy () {
    // cleanup watchers
    this.sourceItemWatchers.map(unwatch => {
      unwatch()
    })
    this.watchedPropIds.destroy()
    this.watchedBlueprints.destroy()

    this.watchedClassSourceSets.destroy()
    this.watchedBaseItemSourceSets.destroy()

    // if no classes, remove from "none"
    if (this.watchedAllClasses.ids.length === 0) {
      this.setSourceSetHashesByClass({
        hash: this.hash,
        classId: 'none',
        remove: true
      })
    }
    this.watchedAllClasses.destroy()
    this.watchedAllClassesOfClasses.destroy()
    this.watchedAllBaseItems.destroy()
  }
}
</script>
