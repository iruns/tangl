<template>
  <v-card
    class = "editor"
    id = "spread-editor"
    flat
    >
    <v-expansion-panel
      :value = "panel"
      expand
      >
      <!-- Base Spreads -->
      <!-- <v-expansion-panel-content>
        <div
          class = "category-header"
          slot = "header"
          >
          Base Spreads
        </div>
        <base-spreads/>
      </v-expansion-panel-content> -->
      <!-- Filters -->
      <v-expansion-panel-content>
        <div
          class = "category-header"
          slot = "header"
          >
          Filters
        </div>
        <filters/>
      </v-expansion-panel-content>
      <!-- Style -->
      <!-- <v-expansion-panel-contentz
        :value = "true"
        >
        <div
          class = "category-header"
          slot = "header"
          >
          Style
        </div>
        <item-styles
          :filters = "filters"
          :config = "itemStyle"
          />
      </v-expansion-panel-content> -->
      <!-- Layout -->
      <!-- <v-expansion-panel-content
        >
        <div
          class = "category-header"
          slot = "header"
          >
          Layout
        </div>
        <v-card class = "grey lighten-4">
          <v-card-text>
            coming soon
          </v-card-text>
        </v-card>
      </v-expansion-panel-content> -->

    </v-expansion-panel>
  </v-card>
</template>

<script>
import BaseSpreads from './BaseSpreads'
import Filters from './Filters'
// import ItemStyles from './ItemStyles'
// import Layout from './Layout'

import _ from 'lodash'

export default {
  name: 'spread-editor',
  components: {
    BaseSpreads,
    Filters,
    // ItemStyles,
    // Layout,
  },
  data () {
    return {
      panel: [true, true],
    }
  },
}
</script>

<style lang = "scss">
  .chip__close {
    width: 3px;
  }
  .item-chip {
    border-radius: 5px;
    cursor: pointer;
    span {
      cursor: pointer !important;
    }
  }
  .config-row {
    /* height: 30px */
  }
</style>
