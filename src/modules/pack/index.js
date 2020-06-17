import mutations from './mutations'
import actions from './actions'

import {db} from '@/firebase'
import _ from 'lodash'

export default {
  namespaced: true,
  state: {
    // BOUND
    infos: {},
    includes: {},

    // FIREBASE REFS
    infoRefs: {},
    includeRefs: {},

    // DIRECT INTERACTION
    selectedId: null,
  },
  getters: {
    selectedInfo: (state) => state.infos[state.selectedId] || {},
    directIds: (state) => {
      return state.includes[state.selectedId]
        ? state.includes[state.selectedId].order
        : []
    },
    indirectIds: (state, getters) => {
      let indirectIds = []
      const {infos, includes, selectedId} = state

      // for each includes
      _.forEach(includes, (includes, packId) => {
        // if not of selected object, collect
        if (packId !== selectedId) {
          indirectIds = _.union(
            indirectIds,
            includes.order
          )
        }
      })

      indirectIds = _.difference(
        indirectIds,
        getters['directIds']
      )

      // sort by label
      indirectIds.sort((a, b) => {
        const lA = infos[a] && infos[a].label
        const lB = infos[b] && infos[b].label
        if (lA > lB) {
          return 1
        } else if (lA < lB) {
          return -1
        }
        return 0
      })

      return indirectIds
    },

    // FIREBASE REFS
    selectedConfigRef: (state) => {
      if (state.selectedId) {
        return db.ref('packConfigs/' + state.selectedId)
      }
    },
    selectedInfoRef: (state, getters) => {
      const ref = state.infoRefs[state.selectedId]
      return ref && ref()
    },
    selectedIncludeRef: (state, getters) => {
      const ref = state.includeRefs[state.selectedId]
      return ref && ref()
    },
  },
  mutations,
  actions
}
