import _ from 'lodash'
import {
  createBlankSpread
} from '@/utils/spread'
import {
  saveOrderedObject
} from '@/utils/data'

export default {

  // PACK WIDE ACTIONS
  /**
   * [addIncluder description]
   * @param  {[type]} payload.id       [description]
   * @param  {[type]} payload.includer [description]
   * @param  {[type]} payload.config      [description]
   * @return {void}
   */
  updateIncluder (context, {config, includer}) {
    // bind included pack's featured
    context.dispatch(
      'vf/updateBinder',
      {
        binder: includer + ' featured spreads',
        ids: _.keys(config),
        getPath: id => 'packConfigs/' + id + '/spreads/featured',
        getLive: id => config[id],
        config: {
          parent: context.state.featureds,
          refParent: context.state.featuredRefs,
          asArray: true,
        }
      },
      {root: true}
    )
    // bind included pack's spread infos
    context.dispatch(
      'vf/updateBinder',
      {
        binder: includer + ' spreadInfos',
        ids: _.keys(config),
        getPath: id => 'packConfigs/' + id + '/spreads/infos',
        getLive: id => config[id],
        config: {
          parent: context.state.infos,
          childListParent: context.state.spreadsByPack,
          refParent: context.state.infoRefs,
          bindChildren: true,
        }
      },
      {root: true}
    )
  },

  // DIRECT INTERACTION
  /**
   * [select description]
   * @param  {Array} selectedId [description]
   * @return {void}
   */
  select (context, selectedId) {
    // if no set selection,
    // try to select the first one
    if (!selectedId) {
      const groupedIds = context.getters['groupedIds']

      selectedId =
        groupedIds[0][0][0] ||
        groupedIds[1][0][0]
    }
    if (
      // if the selection is different
      context.state.selectedId !== selectedId &&
      // AND the selected's info is ready
      context.state.infos[selectedId]
    ) {
      context.dispatch('updateReferer', {
        idPairs: {[selectedId]: context.state.infos[selectedId].packId},
        referer: '_SS_',
      })
      // commit selectedId
      context.commit('select', selectedId)
    }
  },
  hover ({commit}, id) {
    commit('hover', id)
  },
  unhover ({commit}, id) {
    commit('unhover', id)
  },

  /**
   * [addIncluder description]
   * @param  {[type]} payload.id       [description]
   * @param  {[type]} payload.includer [description]
   * @param  {[type]} payload.ids      [description]
   * @return {void}
   */
  updateReferer (context, {idPairs, referer}) {
    // bind referred spreads
    context.dispatch(
      'vf/updateBinder',
      {
        binder: referer + ' spreadConfig',
        ids: _.keys(idPairs),
        getPath: id => 'packConfigs/' + idPairs[id] +
                       '/spreads/configs/' + id,
        getLive: () => true,
        config: {
          parent: context.state.configs,
          refParent: context.state.configRefs,
          unBindDelay: 60000,
        }
      },
      {root: true}
    )
  },

  // SPREAD LIST FUNCTIONS
  /**
   * [feature description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  setFeaturedIds ({getters}, ids) {
    getters['packFeaturedRef'].set(ids)
  },
  setFeatured ({getters, dispatch}, {id, remove}) {
    const featuredIds = getters['packFeaturedIds']
    if (!remove) {
      dispatch('setFeaturedIds', [...featuredIds, id])
    } else {
      dispatch('setFeaturedIds', _.without(featuredIds, id))
    }
  },
  /**
  * [createSpread description]
  * @param  {[type]} baseSpread [description]
  * @return {void}
  */
  createSpread ({rootState, dispatch}, baseSpread) {
    dispatch(
      'saveCreatedSpread',
      createBlankSpread(rootState.pack.selectedId)
    )
  },

  /**
   * [cloneSpread description]
   * @param  {[type]} originalId [description]
   * @return {void}
   */
  cloneSpread ({state, rootState, dispatch}, originalId) {
    const newSpread = {
      config: _.cloneDeep(state.configs[originalId]),
      info: _.cloneDeep(state.infos[originalId]),
    }
    const packId = rootState.pack.selectedId
    newSpread.info.packId = packId
    newSpread.info.label += ' (clone)'
    newSpread.config.filter.packs = {
      order: [packId],
      values: {[packId]: true}
    }
    dispatch('saveCreatedSpread', newSpread)
  },

  /**
   * [cloneSpread description]
   * @param  {[type]} originalId [description]
   * @return {void}
   */
  extendSpread ({state, rootState, dispatch}, originalId) {
    const newSpread = createBlankSpread(rootState.pack.selectedId)
    newSpread.info.label = state.infos[originalId].label + ' (ext.)'
    newSpread.config.baseSpreads = [originalId]
    dispatch('saveCreatedSpread', newSpread)
  },

  saveCreatedSpread ({getters, dispatch}, spread) {
    // push blank to configs + get id
    const newConfigRef = getters['packSpreadConfigsRef'].push()
    const id = newConfigRef.key
    spread.info.id = id
    spread.config.id = id

    // add actual
    getters['packSpreadInfosRef'].update({
      [id]: spread.info
    })
    newConfigRef.set(spread.config)

    // add to featured in server
    getters['packFeaturedRef'].set([
      ...getters['packFeaturedIds'],
      id
    ])
    // and select the spread
    dispatch('select', id)
  },

  /**
  * [deleteSpread description]
  * @param  {[type]} spreadId [description]
  * @return {void}
  */
  deleteSpread ({state, getters, dispatch}, spreadId) {
    // if featured, remove from featured
    const packFeaturedIds = _.clone(getters['packFeaturedIds'])
    const idx = packFeaturedIds.indexOf(spreadId)
    if (idx >= 0) {
      packFeaturedIds.splice(idx, 1)
      getters['packFeaturedRef'].set(packFeaturedIds)
    }
    // if selected, deselect
    if (state.selectedId === spreadId) {
      dispatch('select')
    }
    // remove from infos
    getters['packSpreadInfosRef'].child(spreadId).remove()
    // remove from configs
    getters['packSpreadConfigsRef'].child(spreadId).remove()
  },

  /**
   * [saveInfo description]
   * @param  {[type]} payload [description]
   * @return {void}
   */
  saveInfo (context, {label, description}) {
    // if the label is changed, set
    if (label) {
      context.getters['selectedInfoRef']
        .update({
          label: label
        })
    }
    // if the description is changed, set
    if (description) {
      context.getters['selectedInfoRef']
        .update({
          description: description
        })
    }
  },

  // COMPUTER FUNCTIONS
  // Baking spread
  /**
   * [setBakedContainer description]
   * @param  {[type]} payload [description]
   * @return {void}
   */
  setBakedContainer (context, payload) {
    context.commit('setBakedContainer', payload)
  },
  /**
   * [setBakedStatus description]
   * @param  {[type]} payload [description]
   * @return {void}
   */
  setBakedStatus (context, payload) {
    context.commit('setBakedStatus', payload)
  },
  /**
   * [setBakedSub description]
   * @param  {[type]} payload [description]
   * @return {void}
   */
  setBakedSub (context, payload) {
    context.commit('setBakedSub', payload)
  },

  /**
   * [saveConfigValue description]
   * @param  {[type]} payload.spreadId [description]
   * @param  {[type]} payload.path [description]
   * @param  {[type]} payload.value [description]
   * @return {void}
   */
  saveConfigValue ({getters}, {spreadId, path, value}) {
    const configRef = getters['selectedConfigRef']

    if (configRef) {
      path = path.join('/')
      // if setting value
      if (value !== null) {
        configRef.update({
          [path]: value
        })
      } else {
        // else if deleting
        configRef.child(path).remove()
      }
    }
  },
  // Setting instance props
  setClassProps (context, payload) {
    context.commit('setClassProps', payload)
  },
  setBlueprintProps (context, payload) {
    context.commit('setBlueprintProps', payload)
  },
  setInstancesProps (context, payload) {
    context.commit('setInstancesProps', payload)
  },

  // EDITING
  // triggered by editing filters & items
  setFilteredItems (context, payload) {
    context.commit('setFilteredItems', payload)
  },

  // triggered by changing layout,
  // changing the items, or manually moving the items
  setResolveLayout (context, payload) {
    context.commit('setResolveLayout', payload)
  },

  // TODO these two should not exist
  /**
   * [saveConfigValue description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  saveOrderedObject ({getters, commit}, {path, id, value}) {
    // add to spreads in server
    saveOrderedObject({
      rootRef: getters['selectedConfigRef'],
      root: getters['selectedConfig'],
      path,
      id,
      value
    })
  },
}
