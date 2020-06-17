import Vue from 'vue'
import _ from 'lodash'

export default {
  // PACK WIDE ACTIONS
  /**
   * [updatePack description]
   * @param  {[type]} payload.packId [description]
   * @param  {[type]} payload.spreads [description]
   * @return {[type]}         [description]
   */
  updatePack (state, payload) {
    Vue.set(
      state.spreadIdsByPack,
      payload.packId,
      payload.spreads.order
    )
    _.forEach(payload.spreads.details, (details, id) => {
      Vue.set(state.spreadDetails, id, details)
    })
  },

  removePacks (state, packIds) {
    packIds.map(packId => {
      state.spreadIdsByPack[packId].map(spreadId => {
        // remove the spread
        Vue.delete(state.spreads, spreadId)
        // remove from usedSpreads
        const idx = state.usedSpreads.indexOf(spreadId)
        if (idx >= 0) {
          state.usedSpreads.splice(idx, 0)
        }
      })
      // and then remove the spreads by pack
      Vue.delete(state.spreadIdsByPack, packId)
    })
  },
  
  // DIRECT INTERACTION
  select (state, id) {
    Vue.set(state, 'selectedId', id)
  },
  hover (state, id) {
    state.hoveredId = id
  },
  unhover (state, id) {
    if (state.hoveredId === id) {
      state.hoveredId = null
    }
  },

  // COMPUTER FUNCTIONS
  // Baking spread
  /**
   * [setBakedConfig description]
   * @param  {[type]} payload.id [description]
   * @param  {[type]} payload.config [description]
   * @return {void}
   */
  setBakedContainer (state, {id, remove = false}) {
    // if not removing, and new, create new
    if (!remove && !state.bakedConfigs[id]) {
      Vue.set(
        state.bakedConfigs,
        id,
        {
          ready: false,
          allBasesStatus: {}
        }
      )
    } else {
      // else delete
      Vue.delete(state.bakedConfigs, id)
    }
  },
  setBakedStatus (state, {id, ready, allBasesStatus}) {
    const config = state.bakedConfigs[id]
    if (config) {
      Vue.set(config, 'ready', ready)
      Vue.set(config, 'allBasesStatus', allBasesStatus)
      // if ready, save to lastConfig
      // to be used in case the selected spread becomes not ready
      if (ready) {
        Vue.set(
          state, 'lastConfig',
          _.clone(config)
        )
      }
    }
  },
  setBakedSub (state, {id, sub, subconfig}) {
    const config = state.bakedConfigs[id]
    if (config) {
      Vue.set(
        config,
        sub,
        subconfig
      )
    }
  },
  // Setting instance props
  setClassProps ({filtered}, {classId, remove}) {
    // NOT removing
    if (!remove) {
      Vue.set(filtered.classProps, classId, {
        blueprint: [],
        instances: [],
      })
    } else {
      // if removing
      Vue.delete(filtered.classProps, classId)
    }
  },
  setBlueprintProps ({filtered}, {classId, propIds}) {
    const propsByClass = filtered.classProps[classId]
    // save
    Vue.set(propsByClass, 'blueprint', propIds)
    // then remove intersection from instances' props
    Vue.set(
      propsByClass,
      'instances',
      _.without(propsByClass.instances, ...propIds)
    )
  },
  setInstancesProps ({filtered}, {classId, propIds}) {
    const propsByClass = filtered.classProps[classId]
    // remove ones in blueprint
    _.pull(propIds, ...propsByClass.blueprint)
    // then save
    Vue.set(filtered.classProps[classId], 'instances', propIds)
  },

  // EDITING
  /**
   * [setFilteredItems description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  setFilteredItems (state, payload) {
    Vue.set(state.filtered, 'items', payload)
  },

  setResolveLayout (state, payload) {
    state.resolveLayout = payload
  },
}
