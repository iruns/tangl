<template>
<v-card
  id = "item-list"
  flat
  >
  <v-list
    dense
  >
    <v-list-tile
      v-for = "(itemId, idx) in processedItems"
      :key = "itemId"
      @click.exact = "click(idx)"
      @click.ctrl.exact = "ctrlClick(idx)"
      @click.shift.exact = "shiftClick(idx)"
      @mouseover = "hover(itemId)"
      @mouseout = "unhover(itemId)"
      :class = "[
        'list-button',
        selectedIds.indexOf(itemId) >= 0 ? 'selected' : '',
        hoveredId === itemId ? 'hovered' : ''
      ]"
      >
      <!-- own ? 'own' : '', -->

      <v-list-tile-content>
        <v-list-tile-title>
          {{infos[itemId].label || (itemId)}}
        </v-list-tile-title>
      </v-list-tile-content>

    </v-list-tile>
  </v-list>
</v-card>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex'
// import _ from 'lodash'

export default {
  name: 'item-list',
  data () {
    return {
      lastSelectedIdx: null,
    }
  },
  computed: {
    ...mapState('item', [
      // 'packItemData',
      'items',
      'infos',

      'selectedIds',
      'hoveredId',
    ]),
    ...mapState({
      filteredItems: state => state.spread.filtered.items,
    }),
    processedItems () {
      const {
        infos
      } = this
      const result = [...this.filteredItems]
      return result.sort((a, b) => infos[a].label > infos[b].label ? 1 : -1)
    }
  },

  methods: {
    ...mapActions('item', [
      'select',
      'addSelection',
      'addOneSelection',
      'removeOneSelection',
      'hover',
      'unhover',

      // 'createItem',
    ]),
    click (idx) {

    },
    ctrlClick (idx) {
      const selected = switchSelect(itemId)
      if (selected) {
        lastSelectedIdx = idx
      }
    },
    shiftClick (idx) {
      if (lastSelectedIdx !== null) {
        const range = [this.lastSelectedIdx, idx].sort()
        const a = this.addSelect(this.processedItems.slice(range[0], range[1] + 1))
      } else {
        /* const selected = await switchSelect(itemId)
        if (selected) {
          lastSelectedIdx = idx
        } */
      }
    },
  }
}
</script>

<style lang = "scss">
@import '../../base';
</style>
