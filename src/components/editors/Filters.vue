<template>
  <v-card class = "grey lighten-4">
    <v-card-text class = "pt-1">
      <filter-set
        :set = "packs"
        :refs = "packInfos"
        category = "packs"
        />
      <!-- <filter-set
        :set = "classes"
        :refs = "itemInfos"
        category = "classes"
        />
      <filter-set
        :set = "superitems"
        :refs = "itemInfos"
        category = "superitems"
        />
      <filter-set
        :set = "props"
        :refs = "itemInfos"
        category = "props"
        /> -->
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mapGetters,
  mapState,
  mapActions,
} from 'vuex'

import _ from 'lodash'
import FilterSet from './FilterSet'

export default {
  name: 'filters',
  components: {
    FilterSet
  },
  data () {
    return {
      prevFilteredItemsHash: ''
    }
  },
  methods: {
    ...mapActions('spread', [
      'setFilteredItems',
    ]),
  },
  computed: {
    ...mapState({
      'packInfos': state => state.pack.infos,
      'itemInfos': state => state.item.infos,
    }),
    ...mapGetters('spread', [
      'filter',
    ]),
    ...mapState('item', [
      'itemIdsByPack',
      'sourceSetHashesByPack',
      // 'propsByClass',
    ]),
    usedItemIdsByPack () {
      return this.$store.getters['item/mergedSourceIdsByPack']
    },
    usedItemIds () {
      return this.$store.getters['item/mergedSourceIdsByItem']
    },
    packs () {
      const packs = {
        used: {
          order: [],
          values: {},
        },
        objs: this.packInfos,
      }

      packs.unused = _.keys(packs.objs)

      if (
        this.filter &&
          this.filter.packs
      ) {
        packs.used = this.filter.packs
        _.pull(packs.unused, ...packs.used.order)
      }
      return packs
    },
    filteredByPacks () {
      const {
        packs,
        itemIdsByPack
      } = this
      
      if (packs) {
        const items = []
        _.forEach(packs.used.values, (active, packId) => {
          if (active && itemIdsByPack[packId]) {
            items.push(...itemIdsByPack[packId])
          }
        })
        return items
      }
    },
    // classes () {
    //   if (this.packs) {
    //     const classes = {
    //       used: {
    //         order: [],
    //         values: {},
    //       },
    //       unused: []
    //     }
    //     _.forEach(this.packs.used.order, packId => {
    //       const usedByPack = this.usedItemIdsByPack[packId]
    //       if (usedByPack) {
    //         classes.unused = _.union(
    //           classes.unused,
    //           usedByPack.classes
    //         )
    //       }
    //     })
    //
    //     if (
    //       this.filter &&
    //       this.filter.classes
    //     ) {
    //       classes.used = this.filter.classes
    //       _.pull(classes.unused, ...classes.used.order)
    //     }
    //     return classes
    //   }
    // },
    // filteredByClasses () {
    //   // if (
    //   //   this.filteredByPacks &&
    //   //   this.classes
    //   // ) {
    //   //   const displayNoClasses = this.classes.used.values['item']
    //   //
    //   //   const items = _.filter(this.filteredByPacks, itemId => {
    //   //
    //   //     const usedClasses =
    //   //       this.usedItemIds[itemId].classes
    //   //
    //   //     let classMatch = false
    //   //     // if no class, filter by the class 'item'
    //   //     if (
    //   //       !usedClasses ||
    //   //       usedClasses.length === 0
    //   //     ) {
    //   //       classMatch = displayNoClasses
    //   //     } else {
    //   //       // else check if contains included classes
    //   //       _.forEach(this.classes.used.values, (active, classId) => {
    //   //         if (
    //   //           active &&
    //   //           usedClasses.indexOf(classId) > -1
    //   //         ) {
    //   //           classMatch = true
    //   //           return false
    //   //         }
    //   //       })
    //   //     }
    //   //     return classMatch
    //   //   })
    //   //
    //   //   return items
    //   // }
    // },
    // superitems () {
    //   // if (this.classes) {
    //   //   const superitems = {
    //   //     used: {
    //   //       order: [],
    //   //       values: {},
    //   //     },
    //   //     unused: []
    //   //   }
    //   //   _.forEach(this.filteredByClasses, itemId => {
    //   //     const usedSuperitems =
    //   //       this.usedItemIds[itemId].superitems
    //   //
    //   //     if (usedSuperitems) {
    //   //       superitems.unused = _.union(
    //   //         superitems.unused,
    //   //         usedSuperitems
    //   //       )
    //   //     }
    //   //   })
    //   //
    //   //   if (
    //   //     this.filter &&
    //   //     this.filter.superitems
    //   //   ) {
    //   //     superitems.used = this.filter.superitems
    //   //     _.pull(superitems.unused, ...superitems.used.order)
    //   //   }
    //   //   return superitems
    //   // }
    // },
    // filteredBySuperitems () {
    //   // if (
    //   //   this.filteredByClasses &&
    //   //   this.superitems
    //   // ) {
    //   //
    //   //   let items = this.filteredByClasses
    //   //   const displayNoSuperitems =
    //   //     this.superitems.used.values['none']
    //   //
    //   //   // if not displaying all superitems, filter
    //   //   if (!this.superitems.used.values['any']) {
    //   //     items = _.filter(items, itemId => {
    //   //
    //   //       // if it's the actual superitem, include
    //   //       if (this.superitems.used.values[itemId]) {
    //   //         return true
    //   //       }
    //   //
    //   //       const usedSuperitems =
    //   //         this.usedItemIds[itemId].superitems
    //   //
    //   //       // if displaying items with no superitems
    //   //       if (
    //   //         displayNoSuperitems &&
    //   //         usedSuperitems.length === 0
    //   //       ) {
    //   //         return true
    //   //       }
    //   //
    //   //       // then check if contains included superitems
    //   //       let superitemMatch = false
    //   //       _.forEach(this.superitems.used.values, (active, superitemId) => {
    //   //         if (
    //   //           active &&
    //   //           usedSuperitems.indexOf(superitemId) > -1
    //   //         ) {
    //   //           superitemMatch = true
    //   //           return false
    //   //         }
    //   //       })
    //   //       return superitemMatch
    //   //     })
    //   //   }
    //   //   return items
    //   // }
    // },
    // props () {
    //   // if (this.superitems) {
    //   //   const props = {
    //   //     used: {
    //   //       order: [],
    //   //       values: {},
    //   //     },
    //   //     unused: []
    //   //   }
    //   //   _.forEach(this.filteredBySuperitems, itemId => {
    //   //     const usedProps =
    //   //       this.usedItemIds[itemId].props
    //   //
    //   //     if (usedProps) {
    //   //       props.unused = _.union(
    //   //         props.unused,
    //   //         usedProps
    //   //       )
    //   //     }
    //   //   })
    //   //
    //   //   if (
    //   //     this.filter &&
    //   //     this.filter.props
    //   //   ) {
    //   //     props.used = this.filter.props
    //   //     _.pull(props.unused, ...props.used.order)
    //   //   }
    //   //   return props
    //   // }
    // },
  },
  watch: {
    filteredByPacks (newVal) {
      // TEMP bypass all other filters
      this.setFilteredItems(newVal)
    },
    // filteredBySuperitems (newValue) {
    //   const filteredItemsHash = hash(newValue)
    //   if (filteredItemsHash !== this.prevFilteredItemsHash) {
    //     this.$store.dispatch('spread/setFilteredItems', newValue)
    //     this.prevFilteredItemsHash = filteredItemsHash
    //   }
    // }
  }
}
</script>

<style>

</style>
