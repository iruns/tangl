<template>
  <v-card class = "grey lighten-4">
    <v-card-text>
      <h3 class = "sublabel">Classes</h3>
      <item-style
        v-for = "(config, idx) in itemStyles.classes"
        :key = "'class-' + idx"
        :colorRows = "colorRows"
        :itemId = "config.id"
        :isNew = "config.isNew"
        :config = "config.itemStyle"
        type = "classes"
        />
      <h3 class = "sublabel  mt-3">Props</h3>
      <item-style
        v-for = "(config, idx) in itemStyles.props"
        :key = "'prop-' + idx"
        :colorRows = "colorRows"
        :itemId = "config.id"
        :isNew = "config.isNew"
        :config = "config.itemStyle"
        type = "props"
        />
    </v-card-text>
  </v-card>
</template>

<script>
import ItemStyle from './ItemStyle'
import _ from 'lodash'
import colors from 'vuetify/es5/util/colors'

export default {
  name: 'item-styles',

  props: [
    'toggle',
    'filters',
    'config',
  ],

  components: {
    ItemStyle
  },

  data () {
    return {
      size: 1,
      defaultClassStyle: {
        colors: [
          'grey darken-2',
          '#616161',
          'white',
        ],
        size: 1,
      },
      defaultPropsStyle: {
        colors: [
          'grey',
          '#9E9E9E',
          'white',
        ],
        showProp: true,
        // showValue: false,
        // showConnector: false,

        value: {
          type: 'label', // label, icon, scale
          showLabel: true,
          // byValue: {
          //   val1: {
          //     icon: '',
          //     color: '',
          //   }
          // },
          // showImage: false,
        },

        connector: {
          path: 'curve', // false === off

          thickness: 1,
          lineStyle: 'solid',
          opacity: 0.5,
          arrow: true,
        }
      }
    }
  },

  computed: {
    colorRows () {
      const hues = [
        {
          color: 'yellow',
          lightI: 1,
          shades: [
            'darken-1',
            'accent-4',
            'accent-3',
            'accent-2',
            'accent-1',
          ]
        },
        {
          color: 'orange',
          lightI: 3,
          shades: [
            'darken-4',
            'darken-3',
            'base',
            'accent-2',
            'accent-1',
          ]
        },
        {
          color: 'red',
          lightI: 3,
          shades: [
            'darken-4',
            'darken-3',
            'base',
            'accent-2',
            'accent-1',
          ]
        },
        {
          color: 'pink',
          lightI: 3,
          shades: [
            'darken-4',
            'darken-3',
            'base',
            'accent-2',
            'accent-1',
          ]
        },
        {
          color: 'purple',
          lightI: 3,
          shades: [
            'darken-4',
            'darken-3',
            'base',
            'accent-2',
            'accent-1',
          ]
        },
        {
          color: 'blue',
          shades: [
            'darken-4',
            'darken-3',
            'base',
            'lighten-1',
            'lighten-3',
          ]
        },
        {
          color: 'cyan',
          lightI: 3,
          shades: [
            'darken-4',
            'darken-3',
            'base',
            'accent-2',
            'accent-1',
          ]
        },
        {
          color: 'green',
          lightI: 3,
          shades: [
            'darken-4',
            'darken-3',
            'accent-4',
            'accent-3',
            'accent-2',
          ]
        },
        {
          color: 'lime',
          lightI: 3,
          shades: [
            'darken-4',
            'darken-3',
            'accent-4',
            'accent-3',
            'accent-2',
          ]
        },
        {
          color: 'brown',
          shades: [
            'darken-4',
            'darken-3',
            'darken-1',
            'base',
            'lighten-1',
          ]
        },
        {
          color: 'grey',
          shades: [
            'darken-4',
            'darken-3',
            'darken-1',
            'base',
            'lighten-1',
          ]
        },
      ]

      const shades = [
        'darken-4',
        'darken-3',
        'base',
        'accent-2',
        'accent-1',
      ]

      const colorRows = []

      hues.map((hue, hueIdx) => {
        let lightI = 4
        let currentShades = shades
        let altName = hue // alternate naming for colors js

        // if the hue uses custom config
        if (typeof hue === 'object') {
          lightI = hue.lightI
            ? hue.lightI
            : lightI

          currentShades = hue.shades
            ? hue.shades
            : currentShades

          altName = hue.altName
            ? hue.altName
            : hue.color

          hue = hue.color
        }

        // every 2 hues, new row
        if (hueIdx % 2 === 0) {
          colorRows.push([])
        }

        currentShades.map((shade, shadeIdx) => {
          const hex =

            colorRows[colorRows.length - 1].push([
              [hue, shade].join(' '),
              colors[altName][shade.replace('-', '')],
              shadeIdx < lightI ? 'white' : 'black',
            ])
        })
      })

      return colorRows
    },
    itemStyles () {
      const itemStyles = {
        classes: [],
        props: []
      }
      const config = this.$props.config

      let classStyles = {}
      let propStyles = {}

      // add defaults
      if (config) {
        // class
        if (config.classes) {
          classStyles = config.classes
          itemStyles.classes.push({
            id: 'default',
            isNew: classStyles.default === undefined,
            itemStyle: classStyles.default
              ? classStyles.default
              : _.cloneDeep(this.defaultClassStyle)
          })
        }
        // props
        if (config.props) {
          propStyles = config.props
          itemStyles.props.push({
            id: 'default',
            isNew: propStyles.default === undefined,
            itemStyle: propStyles.default
              ? propStyles.default
              : _.cloneDeep(this.defaultPropsStyle)
          })
        }
      }

      // add filtered (and fill empties with defaults)
      const filters = this.$props.filters
      if (filters) {
        // class
        if (filters.classes) {
          filters.classes.order.map(classId => {
            if (filters.classes.values[classId]) {
              itemStyles.classes.push({
                id: classId,
                isNew: classStyles[classId] === undefined,
                itemStyle: classStyles[classId]
                  ? classStyles[classId]
                  : _.cloneDeep(this.defaultClassStyle)
              })
            }
          })
        }
        // props
        if (filters.props) {
          filters.props.order.map(propId => {
            if (filters.props.values[propId]) {
              itemStyles.props.push({
                id: propId,
                isNew: propStyles[propId] === undefined,
                itemStyle: propStyles[propId]
                  ? propStyles[propId]
                  : _.cloneDeep(this.defaultPropsStyle)
              })
            }
          })
        }
      }

      return itemStyles
    }
  },
}
</script>
