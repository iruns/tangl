<template>
<v-tabs
  id = "left-panel"
  v-model = "active"
  :scrollable = "false"
  grow
  >
  <v-tabs-slider color = "primary"/>
  <v-tab
    key = "spread"
    href = "#spread"
    class = "sidebar-tab"
    ripple
    >
    spread
  </v-tab>
  <v-tab
    key = "item"
    href = "#item"
    class = "sidebar-tab"
    ripple
    >
    item
  </v-tab>
  <v-tab-item
    key = "spread"
    id = "spread"
    >
    <spread-editor/>
  </v-tab-item>
  <v-tab-item
    key = "item"
    id = "item"
    >
    <item-editor/>
  </v-tab-item>
</v-tabs>
</template>

<script>
import SpreadEditor from './SpreadEditor'
import ItemEditor from './ItemEditor'
export default {
  name: 'editors',
  data () {
    return {
      active: 'spread'
    }
  },

  components: {
    SpreadEditor,
    ItemEditor,
  },
}
</script>

<style lang = "scss">

  @import '../../base';

  $colorSize: 20px;

  .editor {
    .sublabel {
      font-weight: medium;
      font-size: 11px;
    }
    h3.sublabel{
      text-transform: uppercase;
      color: $darkGrey;
    }
    h4.sublabel{
      color: black;
    }

    .color-picker {
      vertical-align: top;

      .color-picker-activator {
        width: $colorSize;
        height: $colorSize;
        border-radius: $colorSize / 2;
        margin: (36px - $colorSize) / 2;
        margin-right: 10px;
        margin-left: 0;
      }
    }
  }
  .color-picker-container {
    border-radius: 10px;
    background-color: transparent;
    cursor: pointer;
  }
  .color-menu {
    overflow: hidden;

    .color-row {
      width: 200px;
      height: 20px;
      padding: 0;

      .color-btn {
        display: inline-block;
        width: 20px;
        height: 20px;

        .selection {
          width: 10px;
          height: 10px;
          margin: 5px;
          border-radius: 5px;
          opacity: .8;
        }
      }
    }
  }
</style>
