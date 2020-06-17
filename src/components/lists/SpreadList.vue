<template>
<v-card
  id = "spread-list"
  flat
  color = "transparent"
  >
  <template v-if = "groupedIds">
    <div class = "featured-list pb-4">
      <div class = "small-header pt-3">
        <v-icon
          small
          color = "primary"
          class ="mr-2"
          >
          bookmarks
        </v-icon>
        featured
      </div>
      <draggable
        v-model = "featuredIds"
        element = "v-list"
        :component-data = "{
          props: {
            dense: true
          }
        }"
        class = "py-0"
        >
      <!-- <ul> -->
        <spread-button
          v-for = "id in featuredIds"
          v-if = "infos[id]"
          :key = "id"

          :info = "infos[id]"
          :own = "groupedIds[1][0].indexOf(id)>=0"
          :editable = "
            infos[id].packId === selectedPackId
          "

          :animate = "animate"

          :featuredList = "true"
          :featured = "true"

          :hoveredSpread = "id === hoveredId"
          :hover = "hover"
          :unhover = "unhover"

          :editInfo = "editInfo"
          :confirmDelete = "confirmDelete"
          />
        <!-- </ul> -->
      </draggable>

      <div class = "text-xs-center">
        <v-btn
          small color = "grey lighten-3"
          class = "mt-4"
          @click = "createSpread()"
          depresultsed
          >
          Create new
        </v-btn>
      </div>
    </div>
    <div class = "small-header mt-3">
      this pack's
    </div>
    <!-- selected pack -->
    <v-expansion-panel
      class = "packs"
      >
      <v-expansion-panel-content>
        <div slot = "header" class = "pack-header">
          {{packInfos[selectedPackId] ? packInfos[selectedPackId].label : '(' + selectedPackId + ')'}}
        </div>
        <v-list dense>
          <spread-button
            v-for = "id in sortedGroupedIds[1][0]"
            v-if = "infos[id]"
            :key = "id"

            :info = "infos[id]"
            :own = "true"
            :editable = "true"

            :animate = "animate"

            :featured = "featuredIds.indexOf(id)>=0"

            :hoveredSpread = "id === hoveredId"
            :hover = "hover"
            :unhover = "unhover"

            :editInfo = "editInfo"
            :confirmDelete = "confirmDelete"
            />
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- directly included packs -->
    <template v-if = "directIds && directIds.length>0">
    <v-divider class="my-4"/>
      <div class = "small-header">
        included packs' featured
      </div>
      <v-expansion-panel class = "packs">
        <v-expansion-panel-content
          v-for = "(packId, idx) in directIds"
          v-if = "sortedGroupedIds[2][idx]"
          :key = "packId"
          >
          <div slot = "header" class = "pack-header">
            {{packInfos[packId] ? packInfos[packId].label : '(' + packId + ')'}}
          </div>
          <v-list dense>
            <spread-button
              v-for = "id in sortedGroupedIds[2][idx]"
              v-if = "infos[id]"
              :key = "id"

              :info = "infos[id]"
              :editable = "false"

              :animate = "animate"

              :featured = "featuredIds.indexOf(id)>=0"

              :hoveredSpread = "id === hoveredId"
              :hover = "hover"
              :unhover = "unhover"

              :editInfo = "editInfo"
              :confirmDelete = "confirmDelete"
              />
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>

    <!-- indirectly included packs -->
    <template v-if = "indirectIds && indirectIds.length>0">
    <v-divider class="my-4"/>
      <div class = "small-header">
        indirect packs' featured
      </div>
      <v-expansion-panel class = "packs">
        <v-expansion-panel-content
          v-for = "(packId, idx) in indirectIds"
          v-if = "sortedGroupedIds[2][idx]"
          :key = "packId"
          >
          <div slot = "header" class = "pack-header">
            {{packInfos[packId] ? packInfos[packId].label : '(' + packId + ')'}}
          </div>
          <v-list dense>
            <spread-button
              v-for = "id in sortedGroupedIds[2][idx]"
              v-if = "infos[id]"
              :key = "id"

              :info = "infos[id]"
              :editable = "false"

              :animate = "animate"

              :featured = "featuredIds.indexOf(id) >= 0"

              :hoveredSpread = "id === hoveredId"
              :hover = "hover"
              :unhover = "unhover"

              :editInfo = "editInfo"
              :confirmDelete = "confirmDelete"
              />
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <div class = "mt-5"/>

    </template>
  </template>

  <!-- Edit Info -->
  <v-dialog v-model = "editInfoPanel" max-width = "520">
    <v-card>
      <v-card-text>
        <v-text-field
          ref = "labelField"
          v-model = "newLabel"
          label = "Label"
          counter
          max = "15"
          />
        <v-textarea
          v-model = "newDescription"
          label = "Description"
          counter
          max = "512"
          multi-line
          />
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color = "grey" flat
          @click.native = "() => {
            editInfoPanel = false
          }"
          >
          Cancel
        </v-btn>
        <v-btn
          color = "primary" flat
          :disabled = "
            newLabel === info.label &&
            newDescription === info.description
          "
          @click.native = "() => {
            editInfoPanel = false
            saveInfo({
              info,
              label: newLabel,
              description: newDescription,
            })
          }"
          >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Delete Confirmation -->
  <v-dialog v-model = "confirmDeletePanel" max-width = "260">
    <v-card>
      <v-card-text>
        Delete info <b>{{infos[editing] && infos[editing].label}}</b>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color = "grey" flat
          @click.native = "confirmDeletePanel = false"
          >
          Cancel
        </v-btn>
        <v-btn
          color = "warning" flat
          @click.native = "() => {
            deleteSpread(editing)
            confirmDeletePanel = false
          }"
          >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'
import _ from 'lodash'

import Draggable from 'vuedraggable'
import SpreadButton from './SpreadButton'

export default {
  name: 'spread-list',
  components: {
    Draggable,
    SpreadButton,
  },
  data () {
    return {
      left: true,
      animate: false,

      editing: null,
      editInfoPanel: false,
      confirmDeletePanel: false,

      info: {},
      newLabel: null,
      newDescription: null,
    }
  },
  mounted () {
    setTimeout(() => { this.animate = true }, 500)
  },
  computed: {
    ...mapState('pack', {
      selectedPackId: 'selectedId',
      packInfos: 'infos',
    }),
    ...mapState('spread', [
      'selectedId',
      'hoveredId',
      'infos',
    ]),
    ...mapGetters({
      directIds: 'pack/directIds',
      indirectIds: 'pack/indirectIds',
      groupedIds: 'spread/groupedIds',
    }),
    self () { return this.$refs.menu },
    featuredIds: {
      get () {
        return this.groupedIds ? this.groupedIds[0][0] : []
      },
      set (val) {
        this.setFeaturedIds(val)
      }
    },
    sortedGroupedIds () {
      const result = _.cloneDeep(this.groupedIds)
      for (var i = 1; i < result.length; i++) {
        result[i].map(ids => {
          ids.sort((a, b) => {
            const lA = this.infos[a].label
            const lB = this.infos[b].label
            return lA < lB ? -1 : 1
          })
        })
      }
      return result
    },
  },
  watch: {
    // if no selection, when this changes, autoselect one
    infos () {
      if (
        !this.selectedId ||
        !this.infos[this.selectedId]
      ) {
        this.select()
      }
    }
  },
  methods: {
    ...mapActions('spread', [
      'select',
      'hover',
      'unhover',

      'createSpread',
      'setFeaturedIds',

      'setFeatured',
      'saveInfo',
      'deleteSpread',
    ]),
    editInfo (id) {
      this.editing = id
      this.info = this.infos[id]
      this.newLabel = this.info.label
      this.newDescription = this.info.description
      this.editInfoPanel = true
    },
    confirmDelete (id) {
      this.editing = id
      this.confirmDeletePanel = true
    },
  }
}
</script>

<style lang = "scss">
@import '../../base';

#spread-list {
  .featured-list {
    background-color: white;
    border-bottom: 1px solid $grey;
  }
  .small-header {
    text-transform: uppercase;
    font-size: 11px;
    font-weight: bold;
    color: $grey;

    padding-top: $spacer * 1;
    padding-bottom: $spacer * 1;
    padding-left: $spacer * 2;
  }
  .v-expansion-panel__header {
    padding-left: $spacer * 2;
    padding-right: $spacer * 2;
  }
  .pack-header {
    font-weight: bold;
  }
  .packs {
    webkit-box-shadow: none;
    box-shadow: none;
    .featured {
      opacity: .6;
    }
  }
}
.own {
  .v-list__tile__title {
    font-weight: bold;
    color: black;
  }
}

.grow-enter-active {
  animation: grow-in .5s;
}
.grow-leave-active {
  animation: grow-in .5s reverse;
}
@keyframes grow-in {
  0% {
    height: 0;
  }
  100% {
    height: 20px;
  }
}
/* Add button */
.add-button {
  text-decoration: underline;
  font-size: 13px;

  padding-top: $spacer * 2;
  padding-bottom: $spacer * 2;
  padding-left: $spacer * 4;
}
</style>
