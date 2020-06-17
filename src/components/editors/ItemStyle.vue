<template>
  <div>
    <h4 class = "sublabel py-2">
      {{descriptions[itemId]?descriptions[itemId].label:itemId}}
    </h4>
    <div class = "pb-2">
      <v-menu
        transition = "slide-x-transition"
        bottom left
        :nudge-left = "40"
        content-class = "color-picker-container"
        class = "color-picker"
      >
        <v-btn
          slot = "activator"
          icon small
          :dark = "config.colors[2]!== 'black'"
          class = "ml-0 mt-0"
          :color = "config.colors[0]"
          >
          <v-icon>color_lens</v-icon>
        </v-btn>
        <div class = "color-menu">
          <div
            v-for = "(colorRow, i) in colorRows"
            :key = "i"
            class = "color-row"
            >
            <div
              v-for = "(colorSet, i) in colorRow"
              :key = "i"
              :class = "[
                'color-btn',
                colorSet[0],
              ]"
              @click = "saveConfigValue(
                ['colors'],
                colorSet
              )"
              >
              <div
                :class = "[
                  'selection',
                  colorSet[2]
                ]"
                v-if = "config.colors[0]=== colorSet[0]"
                />
            </div>
          </div>
        </div>
      </v-menu>
      <v-btn-toggle
        v-if = "size!== undefined"
        v-model = "size"
        mandatory small
        >
        <v-btn flat small>
          <v-icon small>title</v-icon>
        </v-btn>
        <v-btn flat small>
          <v-icon>title</v-icon>
        </v-btn>
        <v-btn flat small>
          <v-icon medium>title</v-icon>
        </v-btn>
      </v-btn-toggle>
      <template
        v-if = "config.showProp!== undefined"
        >
        <v-btn
          :color = "config.showProp?'primary':'grey'"
          class = "ml-0 mt-0"
          icon small
          @click = "saveConfigValue(
            ['showProp'],
            !config.showProp
          )"
          >
          <v-icon>label</v-icon>
        </v-btn>
        <v-btn
          :color = "config.connector.path === 'curve'?'primary':'grey'"
          class = "ml-0 mt-0"
          icon small
          @click = "saveConfigValue(
            ['connector', 'path'],
            config.connector.path === 'off'
              ?'curve'
              :'off'
          )"
          >
          <v-icon>arrow_right_alt</v-icon>
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'item-style',
    props: [
      'itemId',
      'config',
      'colorRows',
      'isNew',
      'type',
    ],
    data () {
      return {
        paths: [
          'curve',
          'off'
        ]
      }
    },
    computed: {
      descriptions () {
        return this.$store.getters['item/descriptions']
      },
      size: {
        get () {
          return this.$props.config.size
        },
        set (newValue) {
          this.saveConfigValue(
            ['size'],
            newValue
          )
        }
      }
    },
    methods: {
      saveConfigValue (path, value) {
        // if existing, save the specific value
        if (!this.$props.isNew) {
          this.$store.dispatch('spread/saveConfigValue', {
            path: [
              'config',
              'itemStyle',
              this.$props.type,
              this.$props.itemId,
              ...path
            ],
            value
          })
        } else {
          // else, save the entire style
          const newConfig = _.cloneDeep(this.config)

          _.set(newConfig, [...path, key], value)

          this.$store.dispatch('spread/saveConfigValue', {
            path: [
              'config',
              'itemStyle',
              this.$props.type,
              this.$props.itemId
            ],
            value: newConfig
          })
        }
      },
    }
  }
</script>
