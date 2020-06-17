<template>
  <v-app light id = "app">
    <vue-headful
        :title = "
          (packLabel || '(' + packId + ')')+
          ' - Tangl'"
    />
    <data-computer/>

    <!-- Lists -->
    <!-- <v-navigation-drawer
      fixed app clipped
      width = 250
      v-model = "left"
      class = "sidebar"
      fill-height
      >
      <lists/>
    </v-navigation-drawer> -->

    <!-- Editors -->
    <!-- <v-navigation-drawer
      fixed app right clipped
      width = 250
      v-model = "right"
      class = "sidebar"
      fill-height
      >
      <editors/>
    </v-navigation-drawer> -->

    <v-content>
      <v-container id = "spread-container" fluid fill-height>
        <!-- <v-btn
          color="black" dark small fab
          top left fixed
          @click.stop = "left = !left"
          :style = "{
            opacity: .25,
            left: (left ? drawerWidth : 0) + 20 + 'px'
          }"
          >
          <v-icon>
            {{left
              ? 'keyboard_arrow_left'
              : 'keyboard_arrow_right'
            }}
          </v-icon>
        </v-btn> -->
        <spread-display/>
        <!-- <div>
          <v-btn
            color="black" dark small fab
            top right fixed
            @click.stop = "right = !right"
            :style = "{
              opacity: .25,
              right: (right ? drawerWidth : 0) + 20 + 'px'
            }"
            >
            <v-icon>
              {{right
                ? 'keyboard_arrow_right'
                : 'keyboard_arrow_left'
              }}
            </v-icon>
          </v-btn>
        </div> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

import {
  mapActions,
  mapGetters,
} from 'vuex'

import SpreadDisplay from '@/components/spreadDisplay/SpreadDisplay'
// import Lists from '@/components/lists/Lists'
// import Editors from '@/components/editors/Editors'
import DataComputer from '@/components/computers/Data'

import VueHeadful from 'vue-headful'

export default {
  name: 'pack',

  components: {
    SpreadDisplay,
    // Lists,
    // Editors,
    DataComputer,
    'vue-headful': VueHeadful,
  },

  props: [
    'packId', //  strictly from router
  ],
  data: () => ({
    drawerWidth: 250,
    right: true,
    left: true
  }),
  created () {
    this.select(this.packId)
  },
  computed: {
    ...mapGetters('pack', [
      'selectedInfo'
    ]),
    packLabel () {
      return this.selectedInfo && this.selectedInfo.label
    }
  },
  methods: {
    ...mapActions('pack', [
      'select'
    ]),
  }
}
</script>

<style lang = "scss">
  @import '../base';

  .sidebar {
    background-color: $lightGrey !important;
    .sidebar-tab {
      border-bottom: 2px $lightGrey solid;
    }
    .expansion-panel__header {
      padding: $spacer * 2;
      padding-left: $spacer * 3;
    }
    .v-expansion-panel__container {
      background-color: transparent !important;
    }
  }
  #spread-container {
    padding: 0
  }
</style>
