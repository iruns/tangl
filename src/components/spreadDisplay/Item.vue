<template>
  <v-card
    :class = "[
      'item',
      'size' + itemStyle.size,
      hidden ? 'hidden' : ''
    ]"
    :id = "data.id"
    ref = "element"
    hover
    :style = "{
      'z-index': dragged ? 1 : 0,
      transform:
        'translate(' +
          position.x + 'px,' +
          position.y + 'px)'
    }"
  >
    <v-card-title class = "pa-0">
      <h3
        :style = "{
          'color':itemStyle.colors[2],
        }"
        :class = "[
          'px-3',
          'py-2',
          itemStyle.colors[0]
        ]"
        @mousedown.left.prevent = "startDrag"
        ref = "title"
      >
        {{(info && info.label) || id}}
      </h3>
      <draggable
        v-if="data.props"
        v-model = "filteredPropIds"
        class = "props px-3 py-2"
        >
          <!-- TEMP display all -->
          <transition-group>
            <div
              v-for = "(prop, propId) in data.props"
              class = "prop pa-0 mb-3"
              :key = "propId"
              :ref = "'prop_' + propId"
              >
              <prop-values
                :propId = "propId"
                :propData = "prop"
                :propStyle = "propStyle"
                :infos = "infos"
                />
            </div>
          </transition-group>
          <!-- <transition-group>
            <div
              v-for = "propId in filteredPropIds"
              v-if = "
                propsFilter.values[propId] &&
                data.props[propId]
                "
              class = "prop pa-0 mb-3"
              :key = "propId"
              :ref = "'prop_' + propId"
              >
              <prop-values
                :propId = "propId"
                :propData = "data.props[propId]"
                :propStyle = "propStyle"
                :infos = "infos"
                />
            </div>
          </transition-group> -->
      </draggable>
    </v-card-title>
  </v-card>
</template>

<script>

import {
  mapActions
} from 'vuex'

import Draggable from 'vuedraggable'

import Vue from 'vue'
import PropValues from './PropValues'

export default {
  name: 'item',
  components: {
    Draggable,
    PropValues,
  },
  props: [
    'itemId',
    'data',
    'infos',

    'propsFilter',
    'classStyle',
    'propStyle',

    'lastPosition',

    'scale',
    'dimension',
    'position',
    'hidden',
    'targetPosition',
  ],

  data () {
    return {
      mouseStart: {x: null, y: null},
      elementStart: {x: null, y: null},
      dragged: false,
      tweener: null,
    }
  },
  mounted () {
    Vue.nextTick(() => {
      this.updateTargetPosition()
    })
  },
  updated () {
    this.updateDimensions()
  },
  computed: {
    id () {
      return this.itemId
    },
    info () {
      return this.infos[this.id]
    },
    // usedItemIds () {
    //   return this.$store.getters['item/mergedSourceIdsByItem'][this.id]
    // },
    filteredPropIds: {
      get () {
        return this.propsFilter.order
      },
      set (value) {
        this.$store.dispatch('spread/saveConfigValue', {
          path: ['filters', 'props'],
          key: 'ids',
          value
        })
      }
    },
    // position () {
    //   // if the position is set,
    //   // return it and display
    //   if (this.position) {
    //     this.hidden = false
    //     return this.position
    //   }
    //   // else, return def value and hide
    //   this.hidden = true
    //   return {x: 0, y: 0}
    // },
    itemStyle () {
      let itemStyle
      let classIds = ['*']
      // TEMP use default
      const itemClass =
          _.get(this.data, ['props', 'p_class', 'values', 'item:v0', 'val'])
      return this.classStyle[itemClass] || this.classStyle.default
      // if (this.usedItemIds.classes.length > 0) {
      //   classIds =
      //     classIds.concat(this.usedItemIds.classes)
      // } else {
      //   classIds.push('item')
      // }
      // classIds.push('default')
      //
      // _.forEach(classIds, classId => {
      //   if (classStyles[classId]) {
      //     itemStyle = classStyles[classId]
      //     return false
      //   }
      // })
      // return itemStyle or default
      // return itemStyle
    },
  },
  watch: {
    // data () {
    //   console.log('data')
    //   this.updateDimensions()
    // },
    // propsFilter () {
    //   // console.log('propsFilter')
    //   this.updateDimensions()
    // },
    // itemStyle () {
    //   // console.log('itemStyle')
    //   this.updateDimensions()
    // },
    lastPosition () {
      this.updateTargetPosition()
    },
    targetPosition (newTargetPosition) {
      clearTimeout(this.tweener)

      if (newTargetPosition) {
        // if from hidden (no position), warp to target
        if (this.hidden) {
          this.setPosition({
            id: this.id,
            data: {
              x: newTargetPosition.x,
              y: newTargetPosition.y,
            }
          })
        } else if (
          newTargetPosition.x !== this.position.x ||
            newTargetPosition.y !== this.position.y
        ) {
          this.moveToTarget()
        }
      }
    },
  },
  methods: {
    ...mapActions('item', [
      'setPosition',
      'setTargetPosition',
      'setDimensions',
      'destroyDisplayedItem',
    ]),
    ...mapActions('spread', [
      'saveConfigValue',
      'setResolveLayout',
    ]),
    moveToTarget () {
      let x, y

      const distances = {
        x: this.targetPosition.x - this.position.x,
        y: this.targetPosition.y - this.position.y,
      }
      // if still far enough, set new position closer to the target
      // and setTimeout to next tick
      if (Math.abs(distances.x + distances.y) > 1) {
        x = this.position.x + distances.x / 3
        y = this.position.y + distances.y / 3

        this.tweener = setTimeout(this.moveToTarget, 1000 / 20)
      } else {
        // else, simply warp to
        x = this.targetPosition.x
        y = this.targetPosition.y
      }

      this.setPosition({
        id: this.id,
        data: {x: x, y: y}
      })
    },
    updateTargetPosition () {
      // set targetPosition to lastPosition, or a default value
      this.setTargetPosition(
        {
          id: this.id,
          data: this.lastPosition || {x: 500, y: 200}
        }
      )
    },
    updateDimensions () {
      const rect =
          this.$refs.element &&
          this.$refs.element.$el.getBoundingClientRect()

      if (rect) {
        const width = (rect.right - rect.left) / this.scale
        const height = (rect.bottom - rect.top) / this.scale
        // if different, update
        if (
          !this.dimension ||
            (
              this.dimension.width !== width ||
              this.dimension.height !== height
            )
        ) {
          this.setDimensions({
            id: this.id,
            data: {
              width: width,
              height: height,
            }
          })
          this.setResolveLayout(true)
        }
      }
    },
    startDrag (e) {
      this.setResolveLayout(false)
      this.$data.dragged = true

      this.$data.mouseStart.x = e.clientX
      this.$data.mouseStart.y = e.clientY

      this.$data.elementStart.x = _.round(this.position.x)
      this.$data.elementStart.y = _.round(this.position.y)

      document.onmousemove = this.drag
      document.onmouseup = () => {
        // stop drag
        document.onmousemove = null
        document.onmouseup = null

        // stop drag vars
        this.setResolveLayout(true)
        this.$data.dragged = false

        // round and save position for the current spread
        this.saveConfigValue({
          path: ['layout', 'lastPositions', this.id],
          value: {
            x: _.round(this.position.x, -1),
            y: _.round(this.position.y, -1),
          }
        })
      }
    },
    drag (e) {
      e.preventDefault()

      const newPosition = {
        x: this.elementStart.x +
            ((e.clientX - this.mouseStart.x) / this.scale),
        y: this.elementStart.y +
            ((e.clientY - this.mouseStart.y) / this.scale)
      }

      this.setTargetPosition({
        id: this.id,
        data: newPosition
      })
    }
  },
  beforeDestroy () {
    this.destroyDisplayedItem(
      this.id
    )
  }
}

</script>

<style lang = "scss">

  @import '../../base';

  .item {
    position: absolute;

    border-radius: 4px;

    overflow: hidden;

    transform: translate(10px, 10px);

    &.size0 {
      width: 150px;
      h3 {
        font-size: 16px;
      }
    }
    &.size1 {
      width: 200px;
      h3 {
        font-size: 24px;
      }
    }
    &.size2 {
      width: 300px;
      h3 {
        font-size: 36px;
      }
    }

    h3 {
      font-weight: normal;
      width: 100%;
    }

    .props {
      list-itemStyle: none;
      .prop {
        .prop-label, .values {
          // padding-bottom: 10px;
          // vertical-align: text-top;
        }
        .prop-label {
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .val-sets {
          font-size: 12px;

          &.single-val {
            list-style: none;
          }

          .boolean {
            height: 25px;
            .checkbox {
              display: inline;
              .input-group__input {
                display: inline;
              }
            }
          }
          .number {
            font-family: 'Roboto Condensed';
          }
          .item_ref {
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
