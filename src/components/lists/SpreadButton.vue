<template>
<!-- <li -->
<v-list-tile
  @dblclick.native = "displayEditInfo"
  @mouseover = "hover(info.id)"
  @mouseout = "unhover(info.id)"
  :class = "[
    'list-button',
    selected ? 'selected' : '',
    featured ? 'featured' : 'unfeatured',
    own ? 'own' : '',
    hoveredSpread ? 'hovered' : ''
  ]"
  :style = "{
    height: h  + 'px'
  }"
  >
  <!-- {{info.label}} -->
  <v-list-tile-content
    @click = "select(info.id)"
    >
    <v-tooltip :right = "right" :left = "!right">
      <v-list-tile-title slot = "activator">
        {{info.label}}
      </v-list-tile-title>
      <span>{{info.description}}</span>
    </v-tooltip>
  </v-list-tile-content>

  <v-icon
    v-if = "!right && !featuredList"
    small
    :color = "featured ? 'primary' : 'black'"
    @click = "setFeatured({id: info.id, remove: featured})"
    >
    bookmark
  </v-icon>
  <!-- Menu -->
  <v-menu
    v-if = "!right"
    transition = "slide-x-transition"
    bottom right
    :nudge-right = "25"
    >
    <v-icon
      color = "black"
      slot = "activator"
      @click.prevent
      >
      more_vert
    </v-icon>
    <v-list dense>

      <v-list-tile
        @click = "cloneSpread(info.id)"
        >
        <v-icon class = "mr-3">file_copy</v-icon>
        <v-tooltip right>
          <v-list-tile-title
          slot = "activator"
          v-text = "'Clone'"
          />
          <span>Create an exact clone of this spread</span>
        </v-tooltip>
      </v-list-tile>

      <v-list-tile
        @click = "extendSpread(info.id)"
        >
        <v-icon class = "mr-3">add_circle</v-icon>
        <v-tooltip right>
          <v-list-tile-title
          slot = "activator"
          v-text = "'Extend'"
          />
          <span>Create a new empty spread that uses this spread as it's base</span>
        </v-tooltip>
      </v-list-tile>

      <template v-if="!selected">
        <v-list-tile
          @click = "extendSpread(info.id)"
          >
          <v-icon class = "mr-3">arrow_forward</v-icon>
          <v-tooltip right>
            <v-list-tile-title
              slot = "activator"
              v-text = "'Use as Base'"
            />
            <span>Add this spread to the selected spread's base</span>
          </v-tooltip>
        </v-list-tile>
      </template>

      <v-divider/>

      <v-list-tile
        v-if = "featured"
        @click = "setFeatured({id: info.id, remove: true})"
        >
        <v-icon class = "mr-3">bookmark</v-icon>
        <v-tooltip right>
          <v-list-tile-title
          slot = "activator"
          v-text = "'Unfeature'"
          />
          <span>Remove from "Featured" list</span>
        </v-tooltip>
      </v-list-tile>
      <v-list-tile
        v-else
        @click = "setFeatured({id: info.id})"
        >
        <v-icon color = "primary" class = "mr-3">bookmark</v-icon>
        <v-tooltip right>
          <v-list-tile-title
          slot = "activator"
          v-text = "'Feature'"
          />
          <span>Add to "Featured" list</span>
        </v-tooltip>
      </v-list-tile>

      <template v-if = "editable">

        <v-divider/>

        <v-list-tile
          @click = "editInfo(info.id)"
          >
          <v-icon class = "mr-3">edit</v-icon>
          <v-tooltip right>
            <v-list-tile-title
            slot = "activator"
            v-text = "'Edit Info'"
            />
            <span>Edit the spread's name and description</span>
          </v-tooltip>
        </v-list-tile>

        <v-list-tile
          @click = "confirmDelete(info.id)"
          >
          <v-icon class = "mr-3" color = "warning">delete</v-icon>
          <v-list-tile-title v-text = "'Delete'"/>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</v-list-tile>
<!-- </li> -->
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
import Vue from 'vue'

export default {
  name: 'spread-button',
  props: [
    'info',
    'own',
    'editable',

    'animate',

    'right',

    'featuredList',
    'featured',

    'hoveredSpread',
    'hover',
    'unhover',

    'editInfo',
    'confirmDelete',
  ],
  data () {
    return {
      h: 0,
    }
  },
  mounted () {
    // if animating, shrink then grow
    if (this.animate) {
      this.h = 1
      const growAnim = setInterval(() => {
        if (this.h < 39) {
          this.h += (40 - this.h) / 2
        } else {
          this.h = 40
          clearInterval(growAnim)
        }
      }, 50)
    } else {
      // else, simply set
      this.h = 40
    }
  },
  computed: {
    ...mapState({
      selectedId: state => state.spread.selectedId,
      featuredSpreads: state => state.spread.featuredSpreads || [],
    }),
    selected () {
      return this.info.id === this.selectedId
    },
    menuButton () { return this.$refs.menuButton},
    label: {
      get () {
        return this.info.label
      },
      set (value) {
        // if changed, set
        if (this.info.label !== value) {
          this.newLabel = value
        } else {
          // else, nullify
          this.newLabel = null
        }
      }
    },
    description: {
      get () {
        return this.info.description
      },
      set (value) {
        // if changed, set
        if (this.info.description !== value) {
          this.newDescription = value
        } else {
          // else, nullify
          this.newDescription = null
        }
      }
    },
  },
  methods: {
    ...mapActions('spread', [
      'select',
      'cloneSpread',
      'extendSpread',
      'setFeatured',
    ]),
    displayEditInfo () {
      this.editInfo = true
      Vue.nextTick(() => {
        this.$refs.labelField.focus()
      })
    }
  },
}
</script>
