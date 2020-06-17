import _ from 'lodash'

import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    // BOUND
    infos: {},
    featureds: {},
    configs: {},

    // FIREBASE REFS
    infoRefs: {},
    featuredRefs: {},
    configRefs: {},

    spreadsByPack: {},

    // DIRECT INTERACTION
    selectedId: null,
    hoveredId: null,
    resolveLayout: false,

    // COMPUTED
    bakedConfigs: {},
    lastConfig: {},
    defaultConfig: {
      baseSpreads: [],
      filter: {},
      style: {
        classes: {
          default: {
            colors: [
              'grey darken-4',
              '#212121',
              'white',
            ],
            size: 2,
            props: {
              default: {
                colors: [
                  'grey darken-2',
                  '#212121',
                  'white',
                ],
                showProp: true,
                connector: {
                  path: 'curve'
                }
              },
            }
          },
        },
      },
      layout: {
        lastPositions: {}
      }
    },

    // DISPLAY
    filtered: {
      packClasses: [
        // classIds
      ],
      items: [
        // itemIds
      ],
      instances: {
        // [classId]: [ itemIds ]
      },
      classProps: {
        // [classId]: {
        //   blueprint: [ propIds ],
        //   instance: [ propIds ],
        // }
      },
    },
    bakedStyle: {
      classes: {
        // [classId]: {style}
      },
      sourceSets: {
        // [sourceSetHash]: {style}
      },
    }
  },
  getters: {
    // SPREAD LIST
    // from pack
    selectedPackId: (state, getters, rootState) =>
      rootState.pack.selectedId,

    directPackIds: (state, getters, rootState, rootGetters) =>
      rootGetters['pack/directIds'] || [],
    indirectPackIds: (state, getters, rootState, rootGetters) =>
      rootGetters['pack/indirectIds'] || [],

    // featured ids of the selected pack
    packFeaturedIds: (state, getters) => {
      return state.featureds[getters['selectedPackId']] || []
    },
    // spread ids of the selected pack
    packOwnIds: (state, getters) => {
      return state.spreadsByPack[getters['selectedPackId']] || []
    },
    // featured ids of directly included packs
    includedFeatureds: (state, getters) => {
      const featureds = []
      getters['directPackIds'].map(packId => {
        featureds.push(state.featureds[packId] || [])
      })
      return featureds
    },
    // featured ids of indirectly included packs
    indirectFeatureds: (state, getters) => {
      const featureds = []
      getters['indirectPackIds'].map(packId => {
        featureds.push(state.featureds[packId] || [])
      })
      return featureds
    },
    // array of spreadIds to be featured by SpreadList and auto selector
    groupedIds: (state, getters) => {
      return [
        [getters['packFeaturedIds']], // featured
        [getters['packOwnIds']], // selected
        getters['includedFeatureds'], // direct
        getters['indirectFeatureds'], // indirect
      ]
    },

    // FIREBASE REFS
    packFeaturedRef: (state, getters) => {
      const ref = state.featuredRefs[getters.selectedPackId]
      return ref && ref()
    },
    packSpreadsRef: (state, getters, rootState, rootGetters) => {
      const ref = rootGetters['pack/selectedConfigRef']
      return ref.child && ref.child('spreads')
    },
    packSpreadInfosRef: (state, getters) => {
      const ref = getters['packSpreadsRef']
      return ref.child && ref.child('infos')
    },
    packSpreadConfigsRef: (state, getters) => {
      const ref = getters['packSpreadsRef']
      return ref.child && ref.child('configs')
    },

    selectedInfoRef: (state) => {
      const ref = state.infoRefs[state.selectedId]
      return ref && ref()
    },
    selectedConfigRef: (state) => {
      const ref = state.configRefs[state.selectedId]
      return ref && ref()
    },

    // SELECTED CONFIG DETAILS
    // (details to be featured by spreadDisplay,
    // spread editor uses only selectedConfig, and digs deeper by itself)

    selectedInfo: (state) => state.infos[state.selectedId],
    selectedConfig (state) {
      const selectedConfig = state.bakedConfigs[state.selectedId]
      // either return the current selection,
      // or temporarily use the lastConfig
      if (selectedConfig) {
        return selectedConfig
      } else {
        return state.lastConfig
      }
    },

    // base spread
    baseSpreads: (state) => {
      return _.get(state,
        `configs.${state.selectedId}.baseSpreads`,
        state.defaultConfig.baseSpreads
      ).map(set => set[1])
    },

    // filter
    filter: (state, getters) => {
      return _.get(getters,
        'selectedConfig.filter',
        state.defaultConfig.filter
      )
    },
    propsFilter: (state, getters) => {
      return _.get(getters,
        'filter.props',
        state.defaultConfig.filter.props
      )
    },

    // style
    style: (state, getters) => {
      return _.get(getters,
        'selectedConfig.style',
        state.defaultConfig.style
      )
    },
    classStyle: (state, getters) => {
      return _.get(getters,
        'style.classes',
        state.defaultConfig.style.classes
      )
    },
    propStyle: (state, getters) => {
      return _.get(getters,
        'style.props',
        state.defaultConfig.style.classes.default.props
      )
    },

    // layout
    layout: (state, getters) => {
      return _.get(getters,
        'selectedConfig.layout',
        state.defaultConfig.layout
      )
    },
    lastPositions: (state, getters) => {
      return _.get(getters,
        'layout.lastPositions',
        state.defaultConfig.layout.lastPositions
      )
    },
  },
  mutations,
  actions
}
