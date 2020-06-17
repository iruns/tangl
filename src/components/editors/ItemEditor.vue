<template>
  <v-card
    id = "item-editor"
    flat
    >
    <!-- <v-list>
      <v-list-tile
        v-for = "(itemData, itemId) in items"
        :key = "itemId"
        @click = "select"
        >

        <v-list-tile-content>
          <v-list-tile-title>
            {{itemData.label || itemId}}
          </v-list-tile-title>
        </v-list-tile-content>

      </v-list-tile>
    </v-list> -->
  </v-card>
</template>

<script>
import {mapState} from 'vuex'
import _ from 'lodash'

export default {
  name: 'item-editor',

  computed: {
    ...mapState('item', [
      'items'
    ]),
    selection () {
      // return this.$store.getters['spread/selection']
    }
  },

  methods: {
    select (ids) {
      // this.$store.dispatch('spread/select', ids)
    }
  }
}
</script>

<style scoped>
  .selected {
    background-color:
  }
</style>
