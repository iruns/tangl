<template>
<v-tabs
  id = "left-panel"
  v-model = "active"
  :scrollable = "false"
  grow
  >
  <v-tabs-slider color = "primary"/>
  <v-tab
    key = "spreads"
    href = "#spreads"
    class = "sidebar-tab"
    ripple
    >
    spreads
  </v-tab>
  <v-tab
    key = "items"
    href = "#items"
    class = "sidebar-tab"
    ripple
    >
    items
  </v-tab>

  <v-tab-item
    key = "spreads"
    id = "spreads"
    >
    <spread-list/>
  </v-tab-item>
  <v-tab-item
    key = "items"
    id = "items"
    >
    <item-list/>
  </v-tab-item>
</v-tabs>
</template>

<script>
import SpreadList from './SpreadList'
import ItemList from './ItemList'
export default {
  name: 'lists',
  data () {
    return {
      active: 'items'
    }
  },
  components: {
    SpreadList,
    ItemList,
  },
}
</script>

<style lang="scss">
@import '../../base';

/* List button */
.list-button {
  cursor: pointer;
  color: black;
  border-left: $spacer * 2 solid transparent;
  &.hovered {
    border-left-color: $primary;
  }
  &.selected {
    background-color: $secondary;
  }
  .v-list__tile {
    padding-left: $spacer * 2;
    padding-right: $spacer * 2;
  }
  a {
    padding-right: $spacer * 1;
  }
  i {
    opacity: .2;
  }
  &:hover i {
    opacity: .5;
  }
  &:hover i:hover {
    opacity: 1;
  }
}
</style>
