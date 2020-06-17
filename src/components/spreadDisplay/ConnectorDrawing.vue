<template>
  <div id = 'connector_drawing' ref = "drawing">
    <svg width="100%" height="100%">
      <!-- :width = "size.w"
      :height = "size.h"
      > -->
      <marker
        id = "DotM" refX= "4" refY= "4"
        markerWidth = "8" markerHeight = "8" orient = "auto">
        <circle  cx = "4" cy = "4" r = "4" fill = "black"/>
      </marker>
      <marker
        id = "TriangleM" viewBox = "0 0 10 10" refX= "10" refY= "5"
        markerWidth = "10" markerHeight = "10" orient = "auto">
        <path  d = "M 0 0 L 10 5 L 0 10 z" fill = "black"/>
      </marker>
      <g
        :transform = "
          'translate(' +
            (position.x + scale.dx) + ' ' +
            (position.y + scale.dy) + ') ' +
          'scale(' + scale.s + ')'
        "
      >
        <path
          v-for = "connection in connections"
          :d = "connection.d"
          :stroke-width = "connection.width"
          :stroke = "connection.color"
          :opacity = "connection.opacity"
          fill = "none"
          marker-start = "url(#DotM)"
          marker-end = "url(#TriangleM)"
          />
      </g>
    </svg>
    <!-- <ul>
      <li
        v-for = "(position, id) in itemPositions"
        >
        {{id}}: {{position}}
      </li>
    </ul> -->
  </div>
</template>

<script>

import {
  mapState,
  mapGetters,
} from 'vuex'

import _ from 'lodash'

export default {
  name: 'connector-drawing',
  props: [
    'activeItems',
    'position',
    'scale',
  ],
  data () {
    return {
      size: {
        w: 500,
        h: 500,
      }
    }
  },
  computed: {
    // itemPositions () {
    //   return this.$store.getters['item/positions']
    // },
    ...mapState('item', [
      'bakedItems',
      'dimensions',
      'positions',
    ]),
    ...mapGetters('spread', [
      'propStyle',
    ]),
    connections () {
      const {
        bakedItems, dimensions, positions,
        propStyle
      } = this

      const configs = {}

      _.forEach(propStyle, (style, propId) => {
        if (style.connector.path !== 'off') {
          configs[propId] = _.clone(style.connector)

          configs[propId].color = style.colors[1]
          configs[propId].source = 'item'
          configs[propId].width = 1
          configs[propId].opacity = 0.5
        }
      })

      // const config = {
      //   p_parent: {
      //     source: 'item',
      //     width: 1,
      //     color: 'black'
      //   },
      //   p_spouse: {
      //     source: 'item',
      //     width: 2,
      //     color: 'red'
      //   },
      // }
      // const config = {
      //   p_class: {
      //     source: 'item',
      //     width: 1,
      //     opacity: .5,
      //     color: 'black'
      //   },
      //   p_refItem: {
      //     source: 'item',
      //     width: 1,
      //     opacity: .5,
      //     color: 'grey'
      //   },
      // }
      const rects = {}
      _.forEach(dimensions, (itemDimensions, id) => {
        if (positions[id]) {
          rects[id] = _.cloneDeep(itemDimensions)

          rects[id].centerX =
              positions[id].x +
              (itemDimensions.width / 2)
          rects[id].centerY =
              positions[id].y +
              (itemDimensions.height / 2)
        }
      })

      const connections = []

      _.forEach(this.activeItems, itemId => {
        const item =
            bakedItems[itemId] &&
            bakedItems[itemId].data
        // const element = items[itemId].element

        if (
        // element &&
        // element.style.display !== 'none'
          item
        ) {
          _.forEach(item.props, (propData, propId) => {
            // _.forEach(config, (propConfig, propId) => {
            const config = configs[propId] || configs['default']

            // const propData = _.get(item, ['props', propId])

            if (propData !== undefined) {
              const prop = _.get(item, ['props', propId])
              // const propRect = prop.getBoundingClientRect()

              _.forEach(propData.values, valSet => {
                const valId = valSet.val

                if (
                  valId && item &&
                    true
                    // items[valId].element &&
                    // items[valId].element.style.display !== 'none'
                ) {
                  const source = rects[itemId]
                  const target = rects[valId]

                  if (target && source) {
                    switch (config.source) {
                      case 'item':
                        this.getEdgeCoords(source, target, -0.1)
                        this.getEdgeCoords(target, source, 0.1)
                        break
                      case 'prop':
                        source.x = propRect.x
                        source.y = propRect.y
                        break
                      default:
                    }

                    target.x -= source.x
                    target.y -= source.y
                    const length = Math.sqrt(
                      (target.x * target.x) +
                        (target.y * target.y)
                    )
                    const shift = 0
                    connections.push({

                      d: 'M ' + source.x +
                          ' ' + source.y +
                          ' q ' + target.x / 2 +
                          ' ' + (target.y / 2 - (length * 0.2)) +
                          ' ' + target.x +
                          ' ' + target.y,
                      // " l " + target.x +
                      // " " + target.y,

                      width: config.width,
                      color: config.color,
                      opacity: config.opacity,

                      t: rects[itemId]
                    })
                  }
                }
              })
            }
          })
        }
      })
      return connections
    }
  },
  methods: {
    getEdgeCoords (source, target, shift = 0) {
      const quarter = 1.5708

      // connection angle
      const A = Math.atan2(
        source.centerY - target.centerY,
        source.centerX - target.centerX,
      ) - shift

      const absA = Math.abs(A)

      const C1 = Math.atan2(
        source.height / 2,
        source.width / 2
      )
      const C2 = quarter - C1

      // vert or horz
      const horz = (
        absA < C1 ||
          absA > C1 + (C2 * 2)
      )

      let placement = {}
      if (horz) {
        placement.x = source.width / 2
        // if not 0, calculate; else set to 0
        placement.r = placement.x ? placement.x / Math.cos(A) : 0
        placement.y = Math.sin(A) * placement.r
        if (absA < quarter) {
          placement.x = placement.x * -1
          placement.y = placement.y * -1
        }
      } else {
        placement.y = source.height / 2
        // if not 0, calculate; else set to 0
        placement.r = placement.y ? placement.y / Math.sin(A) : 0
        placement.x = Math.cos(A) * placement.r
        if (A > 0) {
          placement.x = placement.x * -1
          placement.y = placement.y * -1
        }
      }

      source.x = placement.x + source.centerX
      source.y = placement.y + source.centerY
    }
  }
}
</script>

<style>
  #connector_drawing{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;
  }
</style>
