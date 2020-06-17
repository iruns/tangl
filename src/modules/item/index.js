import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    // BOUND
    items: {
      // [itemId]: {
      //   id: id,
      //   packId: packId,
      //   props: {
      //     [propId]: {
      //       ref: the prop item,
      //       values: {
      //         [valSetId]: {
      //           type: item, string, etc //TODO check this
      //           val: value,
      //           ref: the value item,
      //           qualifiers: (LATER)
      //         }
      //       },
      //       order: []
      //     }
      //   },
      //   blueprint: {
      //     same format as props
      //   }
      // }
    },

    // DERIVATIVES
    // same format as items
    bakedItems: {
      // [itemId]: {
      //   id: id,
      //   packId: packId,
      //   data: {
      //     props: {},
      //     blueprint: {
      //       data: {
      //         props: {},
      //         blueprint: {}
      //       },
      //       meta: {
      //         ready: true,
      //         circular: false,
      //         mergedSourceSetHash: '',
      //         allPropIds: [],
      //       },
      //     }
      //   },
      //   meta: {
      //     ready: true,
      //     sourcesReady: true,
      //     mergedSourceSetHash: '',
      //     allPropIds: [],
      //   },
      // }
    },
    // combination of a collection of source items
    // typically used by several other items
    mergedSourceSets: {
      // [hash]: {
      //   hash: hash,
      //   data: {
      //     props: {},
      //     blueprint: {
      //       data: {
      //         props: {},
      //         blueprint: {}
      //       },
      //       meta: {
      //         allPropIds: [],
      //       }
      //     }
      //   },
      //   meta: {
      //     users: [{}, {}, {}...], // direct users and blueprints
      //     sourceItemds: {
      //       baseItem: [],
      //       class: []
      //     },
      //     ready: true,
      //     sourcesReady: true,
      //     conflicts: {
      //       circularDependency: [
      //         {
      //           [itemId]: false || 'baseItem' || 'class' || 'classOfClass'
      //         },
      //         ...
      //       ]
      //       sameBaseItemAndClass: false || [itemIds],
      //       sameBaseItemAndClassOfClass: false || [itemIds],
      //       sameClassAndClassOfClass: false || [itemIds],
      //     },
      //     allPropIds: [],
      //     // used by Item (computer) to check for circular dependency
      //     // and by SpreadEditor to filter items
      //     allSourceItemIds: {
      //       baseItem: {},
      //       class: {}
      //       classOfClass: {} // incl. classes of classes
      //     }
      //   },
      // }
    },
    // the currently active label and description
    // (determined by current languange, and maybe others)
    infos: {
      // [itemId]: {
      //   label: '',
      //   description: ''
      // }
    },

    // various item things grouped by their packs
    itemIdsByPack: {
      // [packId]: [ itemIds ]
    },
    sourceSetHashesByPack: {
      // [packId]: [ sourceSetHashes ]
    },
    classIdsByPack: {
      // [packId]: [ classId ]
    },
    instanceIdsByPack: {
      // [packId]: {
      //   [classId]: [ itemIds ]
      // }
    },

    sourceSetHashesByClass: {
      // [classId]: [ sourceSetHashes ]
    },

    // DIRECT INTERACTION
    selectedIds: [],
    hoveredId: null,

    // DISPLAY DATA
    dimensions: {

    },
    targetPositions: {

    },
    positions: {

    },
  },
  getters: {
    // // ITEMS
    //
    // items:
    //   (state) => state.items,
    // bakedItems:
    //   (state) => state.bakedItems,
    // infos:
    // (state) => state.infos,
    //
    // mergedSourceIdsByItem:
    //   (state) => state.mergedSourceIdsByItem,
    // // mergedSourceIdsByPack:
    // //   (state) => state.mergedSourceIdsByPack,
    //
    // // DISPLAY ITEMS
    // dimensions:
    //   (state) => state.dimensions,
    // targetPositions:
    //   (state) => state.targetPositions,
    // positions:
    //   (state) => state.positions,
  },
  mutations,
  actions
}
