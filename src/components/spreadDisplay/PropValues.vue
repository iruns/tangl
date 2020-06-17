<template>
  <div>
    <div
      v-if = "style.showProp"
      class = "prop-label"
      :style = "{
        'color':style.colors[1],
      }"
      >
      {{infos[propId] ? infos[propId].label : propId}}
    </div>
    <ul
      :class = "[
        'val-sets',
        'pt-1',
        valSetArray.length > 1
          ? 'pl-3'
          : 'single-val'
      ]"
      >
      <li
        v-for = "(valSet, idx) in valSetArray"
        :key = "idx"
        :class = "valSet.type"
        :style = "{
          'color':style.showProp
            ? 'black'
            : style.colors[1],
        }"
        >
        <template
          v-if = "valSet.type === 'boolean'"
          >
          <v-checkbox
            v-model = "valSet.val"
            value
            :color = "style.colors[0]"
            hide-details
            />
        </template>
        <template
          v-else
          >
            {{valSet.val}}
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'prop-values',
  props: [
    'propId',
    'propData',
    'propStyle',
    'infos',
  ],
  computed: {
    style () {
      const style =
          this.propStyle[this.propId] ||
          this.propStyle['default']
      return style
    },
    valSetArray () {
      const valSetArray = []
      _.forEach(this.propData.order, valId => {
        const valSet =
            _.clone(this.propData.values[valId])

        switch (valSet.type) {
          case 'item_ref':
            const valItem = this.infos[valSet.val]
            if (valItem) {
              valSet.val = valItem.label
            }
            break
          case 'datetime':
            valSet.val =
                new Date(valSet.val).toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }
                )
            break
        }
        valSetArray.push(valSet)
      })
      return valSetArray
    }
  }
}
</script>
