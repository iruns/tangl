import _ from 'lodash'
import {
  addLanguage,
  updateItem,
} from '@/utils/item'

export default {
  // PACK WIDE ACTIONS
  /**
   * [addIncluder description]
   * @param  {[type]} payload.id       [description]
   * @param  {[type]} payload.includer [description]
   * @param  {[type]} payload.config   [description]
   * @return {void}
   */
  updateIncluder ({rootState, state, dispatch}, {config, includer}) {
    // bind included pack's contents' items
    dispatch(
      'vf/updateBinder',
      {
        binder: includer + ' items',
        ids: _.keys(config),
        getPath: id => 'packs/' + id + '/fs/contents/is',
        // getLive: id => config[id],
        getLive: id => true,
        config: {
          parent: state.items,
          bindChildren: true,
          childListParent: state.itemIdsByPack,
          customAddChild (id, child, parent) {
            child.id = id
            // and update the item
            updateItem(id, child, parent)
            // return true to say that it's already added
            return true
          },
        }
      },
      {root: true}
    )
    const languages = rootState.languages
    languages.map(lang => {
      // bind included pack's contents' "language specific data"
      dispatch(
        'vf/updateBinder',
        {
          binder: includer + ' items',
          ids: _.keys(config),
          getPath: id => `packs/${id}/fs/contents/lsd/${lang}/is`,
          // getLive: id => config[id],
          getLive: id => true,
          config: {
            parent: state.items,
            bindChildren: true,
            customAddChild (id, child, parent) {
              child.id = id
              // add language qualifier
              addLanguage(child, lang)
              // and update the item
              updateItem(id, child, parent)
              // return true to say that it's already added
              return true
            },
            customRemoveChild (id, child, parent) {
              // TODO remove only statements
              // updateItem(id, child, parent)
            }
          }
        },
        {root: true}
      )
    })
  },

  // CALCULATING BAKED ITEMS
  //    used by Item (computer)
  /**
   * [setInfo description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  setInfo (context, payload) {
    context.commit('setInfo', payload)
  },
  //    used by Baker
  /**
  * [setSourceSet description]
  * @param  {[type]} payload.id [description]
  * @param  {[type]} payload.oldHash [description]
  * @param  {[type]} payload.hash [description]
  * @param  {[type]} payload.sourceItemIds [description]
  * @return {void}
  */
  setSourceSetContainer (context, payload) {
    context.commit('setSourceSetContainer', payload)
  },
  setBakedContainer (context, payload) {
    context.commit('setBakedContainer', payload)
  },
  /**
   * Sets the baked data from an item (from ItemComputer)
   * @param  {Object} payload.id the baked item data
   * @param  {Object} payload.mergedSourceSetHash
   * @param  {Object} [payload.remove = false]
   * @return {void}
   */
  setBakedSourceSet (context, payload) {
    context.commit('setBakedSourceSet', payload)
  },
  setBakedStatus (context, payload) {
    context.commit('setBakedStatus', payload)
  },

  //    used by MergedSourceSet
  /**
   * [setSourceSet description]
   * @param  {[type]} payload.hash [description]
   * @param  {[type]} payload.allSourceItems [description]
   * @return {void}
   */
  setSourceSetStatus (context, payload) {
    context.commit('setSourceSetStatus', payload)
  },
  setAllSourceItemIds (context, payload) {
    context.commit('setAllSourceItemIds', payload)
  },
  setSourceSetHashesByClass (context, payload) {
    context.commit('setSourceSetHashesByClass', payload)
  },

  //    used by all above
  setAllPropIds (context, payload) {
    context.commit('setAllPropIds', payload)
  },
  setBlueprintContainer (context, payload) {
    context.commit('setBlueprintContainer', payload)
  },

  //    used by Prop (computer)
  /**
   * [setProp description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  setProp (context, payload) {
    context.commit('setProp', payload)
  },

  //    used by blueprintBaker (computer)
  /**
   * [setBakedBlueprint description]
   * @param  {[type]} payload. [description]
   * @return {void}
   */
  setBakedBlueprint (context, payload) {
    context.commit('setBakedBlueprint', payload)
  },

  //    used by pack (computer)
  setSourceSetHashesByPack (context, payload) {
    context.commit('setSourceSetHashesByPack', payload)
  },
  setClassIdsByPack (context, payload) {
    context.commit('setClassIdsByPack', payload)
  },
  setInstanceIdsByPackContainer (context, payload) {
    context.commit('setInstanceIdsByPackContainer', payload)
  },

  //    used by class (computer)
  setInstanceIdsByPack (context, payload) {
    context.commit('setInstanceIdsByPack', payload)
  },

  // DIRECT INTERACTION
  /**
   * [select description]
   * @param  {Array} id [description]
   * @return {void}
   */
  select ({commit}, payload) {
    commit('select', payload)
  },
  addSelection ({commit}, payload) {
    commit('addSelection', payload)
  },
  addOneSelection ({commit}, payload) {
    commit('addOneSelection', payload)
  },
  removeOneSelection ({commit}, payload) {
    commit('removeOneSelection', payload)
  },
  hover ({commit}, payload) {
    commit('hover', payload)
  },
  unhover ({commit}, payload) {
    commit('unhover', payload)
  },

  // EDITING ITEMS

  // DISPLAYING ITEMS
  setDimensions (context, payload) {
    context.commit('setDimensions', payload)
  },
  destroyDisplayedItem (context, payload) {
    context.commit('destroyDisplayedItem', payload)
  },
  setTargetPosition (context, payload) {
    context.commit('setTargetPosition', payload)
  },
  setPosition (context, payload) {
    context.commit('setPosition', payload)
  },
}
