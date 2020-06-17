import Vue from 'vue'
import _ from 'lodash'

// source types (lower case and capitalized)
const ts = [ 'baseItem', 'class', 'classOfClass' ]
const tsC = [ 'BaseItem', 'Class', 'ClassOfClass' ]

export default {

  // CALCULATING BAKED ITEMS
  //    used by Item (computer)
  /**
   * [setInfo description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  setInfo (state, {id, info}) {
    if (info) {
      Vue.set(state.infos, id, info)
    } else {
      Vue.delete(state.infos, id)
    }
  },
  //    used by Baker
  /**
   * [setSourceSetContainer description]
   * @param {[type]} state       [description]
   * @param {[type]} id          [description]
   * @param {[type]} oldHash     [description]
   * @param {[type]} hash        [description]
   * @param {[type]} sourceItemIds [description]
   */
  setSourceSetContainer (state, {
    id, bpLevel, oldHash, hash, sourceItemIds
  }) {
    const oldSet = state.mergedSourceSets[oldHash]
    if (oldSet) {
      // delete this item from old set
      Vue.delete(
        oldSet.meta.users[bpLevel],
        id
      )
      // delete this item's conflicts.circularDependency container
      Vue.delete(
        oldSet.meta.conflicts.circularDependency[bpLevel],
        id
      )
      // and delete the old set if it no longer has users
      let hasUsers = false
      _.forEach(oldSet.meta.users, users => {
        if (users && _.keys(users).length > 0) {
          hasUsers = true
          return false
        }
      })
      if (!hasUsers) {
        Vue.delete(state.mergedSourceSets, oldHash)
      }
    }
    if (hash) {
      let set = state.mergedSourceSets[hash]
      // if new, create
      if (!set) {
        set = {
          hash,
          data: {
            ps: {},
          },
          meta: {
            users: [{}, {}],
            sourceItemIds,

            ready: false,
            sourcesReady: false,
            conflicts: {
              circularDependency: [],
              sameBaseItemAndClass: false,
              sameBaseItemAndClassOfClass: false,
              sameClassAndClassOfClass: false,
            },

            allSourceItemIds: {
              baseItem: {},
              class: {},
              classOfClass: {},
            },
          },
        }
        Vue.set(state.mergedSourceSets, hash, set)
      }
      // then add the item to the users
      if (!set.meta.users[bpLevel]) {
        Vue.set(set.meta.users, bpLevel, {})
      }
      Vue.set(set.meta.users[bpLevel], id, true)
      // and add the item's conflicts.circularDependency container
      //    if bpLevel doesn't exist yet, create
      if (!set.meta.conflicts.circularDependency[bpLevel]) {
        Vue.set(set.meta.conflicts.circularDependency, bpLevel, {})
      }
      Vue.set(set.meta.conflicts.circularDependency[bpLevel], id, {
        baseItem: false,
        class: false,
        classOfClass: false,
      })
    }
  },
  /**
   * [setBakedContainer description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  setBakedContainer (state, {parentState, id, bpLevel, remove}) {
    const dataKey = !bpLevel ? id : 'bp'
    if (!remove) {
      let obj = parentState[dataKey]
      // if new, create
      if (!obj) {
        obj = {
          id,
          data: {
            ps: {},
          },
          meta: {
            ready: false,
            sourcesReady: false,
          },
        }
        Vue.set(parentState, dataKey, obj)
      }
    } else {
      if (parentState) {
        // else delete the container
        Vue.delete(parentState, dataKey)
      }
    }
  },
  /**
   * [setBaked description]
   * @param  {Object} payload.id the baked item data
   * @param  {Object} payload.mergedSourceSetHash
   * @return {void}
   */
  setBakedSourceSet (state, {meta, sourceItemIds, mergedSourceSetHash}) {
    Vue.set(meta, 'sourceItemIds', sourceItemIds)
    Vue.set(meta, 'mergedSourceSetHash', mergedSourceSetHash)
  },
  setBakedStatus (state, {meta, ready, sourcesReady}) {
    Vue.set(meta, 'ready', ready)
    Vue.set(meta, 'sourcesReady', sourcesReady)
  },

  //    used by MergedSourceSet
  /**
   * [setSourceSet description]
   * @param  {[type]} payload.meta [description]
   * @param  {[type]} payload.sourcesReady [description]
   * @return {void}
   */
  setSourceSetStatus (state, {meta, sourcesReady}) {
    Vue.set(meta, 'sourcesReady', sourcesReady)
    // if sourcesReady, check conflicts to determine readiness
    Vue.set(meta, 'ready',
      sourcesReady &&
      !meta.conflicts.sameBaseItemAndClass &&
      !meta.conflicts.sameClassAndClassOfClass &&
      !meta.conflicts.sameBaseItemAndClassOfClass
    )
  },
  setAllSourceItemIds (state, {meta, type, ids, idsArray}) {
    let conflicted = false
    // check for dependency conflicts
    //    circular dependency
    meta.users.map((users, bpLevel) => {
      // set
      _.forEach(users, (val, userId) => {
        const circularDependent = !!ids[userId]
        Vue.set(
          meta.conflicts.circularDependency[bpLevel][userId],
          type,
          circularDependent
        )
        if (circularDependent) {
          conflicted = circularDependent
        }
      })
    })
    // if not circular, check for same sources in different types
    if (!conflicted) {
      const tiA = ts.indexOf(type)
      ts.map((t2, tiB) => {
        if (tiA !== tiB) {
          const duplicates = _.intersection(
            idsArray,
            _.keys(meta.allSourceItemIds[t2])
          )
          const is = [tiA, tiB].sort()
          Vue.set(
            meta.conflicts,
            `same${tsC[is[0]]}And${tsC[is[1]]}`,
            duplicates.length > 0 ? duplicates : false
          )
          if (duplicates.length > 0) {
            conflicted = true
          }
        }
      })
    }
    // only set if not conflicted
    if (!conflicted) {
      // if type is class, and it's empty
      Vue.set(meta.allSourceItemIds, type, ids)
    }
    // if sourcesReady set as ready
    Vue.set(meta, 'ready', !conflicted && meta.sourcesReady)
  },
  setSourceSetHashesByClass (
    {sourceSetHashesByClass},
    {classId, hash, remove}
  ) {
    let container = sourceSetHashesByClass[classId]
    // if adding
    if (!remove) {
      if (!container) {
        container = [hash]
        Vue.set(sourceSetHashesByClass, classId, container)
      }
      // if not added yet, add
      if (container.indexOf(hash) < 0) {
        container.push(hash)
      }
    } else if (container) {
      // else if removing, and the container is set
      const idx = container.indexOf(hash)
      // if added, remove
      idx >= 0 && container.splice(idx, 1)
      // if empty, delete
      if (container.length === 0) {
        Vue.delete(sourceSetHashesByClass, classId)
      }
    }
  },

  //    used by all above
  setAllPropIds (state, {meta, allPropIds}) {
    Vue.set(meta, 'allPropIds', allPropIds)
  },
  setBlueprintContainer (state, {parentState, remove}) {
    if (!remove) {
      let set = parentState.bp
      // if new, create
      if (!set) {
        set = {
          data: {
            ps: {},
          },
        }
        Vue.set(parentState, 'bp', set)
      }
    } else {
      Vue.delete(parentState, 'bp')
    }
  },

  //    used by prop
  /**
   * [setProp description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  setProp (state, {parentState, id, data}) {
    if (data) {
      Vue.set(parentState, id, data)
    } else {
      Vue.delete(parentState, id)
    }
  },

  // used by pack (computer)
  /**
  * adds or remove sourceSets to sourceSetsBy[source]
  * @param {[type]} source [description]
  * @param {[type]} sourceId [description]
  * @param {[type]} hash    [description]
  * @param {[type]} remove  [description]
  */
  setSourceSetHashesByPack (
    {sourceSetHashesByPack},
    {packId, sourceSetHashes, remove}
  ) {
    // if setting
    if (!remove) {
      Vue.set(sourceSetHashesByPack, packId, sourceSetHashes)
    } else {
      // else if removing
      Vue.delete(sourceSetHashesByPack, packId)
    }
  },
  setClassIdsByPack ({classIdsByPack}, {packId, classIds, remove}) {
    // if setting
    if (!remove) {
      Vue.set(classIdsByPack, packId, classIds)
    } else {
      // else if removing
      Vue.delete(classIdsByPack, packId)
    }
  },
  setInstanceIdsByPackContainer ({instanceIdsByPack}, {packId, remove}) {
    // if setting
    if (!remove) {
      Vue.set(instanceIdsByPack, packId, {})
    } else {
      // else if removing
      Vue.delete(instanceIdsByPack, packId)
    }
  },
  // used by class (computer)
  setInstanceIdsByPack (state, {classId, instanceIdsByPack, oldPackIds}) {
    // remove old entries
    oldPackIds.map(packId => {
      if (state.instanceIdsByPack[packId] && (
        !instanceIdsByPack ||
        !instanceIdsByPack[packId]
      )) {
        Vue.delete(state.instanceIdsByPack[packId], classId)
      }
    })
    // add new
    if (instanceIdsByPack) {
      _.forEach(instanceIdsByPack, (instanceIds, packId) => {
        if (state.instanceIdsByPack[packId]) {
          Vue.set(state.instanceIdsByPack[packId], classId, instanceIds)
        }
      })
    }
  },

  // DIRECT INTERACTION
  select (state, ids) {
    Vue.set(state, 'selectedIds', ids)
  },
  addSelection (state, ids) {
    Vue.set(state, 'selectedIds', _.union(state.selectedIds, ids))
  },
  addOneSelection (state, id) {
    state.selectedIds.push(id)
  },
  removeOneSelection (state, idx) {
    state.selectedIds.splice(idx, 1)
  },

  hover (state, id) {
    state.hoveredId = id
  },
  unhover (state, id) {
    if (state.hoveredId === id) {
      state.hoveredId = null
    }
  },

  // DISPLAYING ITEMS
  setDimensions (state, payload) {
    Vue.set(state.dimensions, payload.id, payload.data)
  },
  destroyDisplayedItem (state, payload) {
    Vue.delete(state.targetPositions, payload)
    Vue.delete(state.positions, payload)
    Vue.delete(state.dimensions, payload)
  },
  setTargetPosition (state, payload) {
    // quantize
    payload.data.x = _.round(payload.data.x, -1)
    payload.data.y = _.round(payload.data.y, -1)
    Vue.set(state.targetPositions, payload.id, payload.data)
  },
  setPosition (state, payload) {
    Vue.set(state.positions, payload.id, payload.data)
  },

}
