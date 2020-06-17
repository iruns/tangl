<template>
  <div class = "mt-3">
    <h3 class = "sublabel">{{category}}</h3>
    <div
      class = "used"
      v-if = "set.used"
      >
      <toggle-chip
        v-for = "id in set.used.order"
        :key = "'chip-' + id"
        :category = "category"
        :id = "id"
        :active = "set.used.values[id]"
        :label = "refs[id]?refs[id].label:id"
        :used = "true"
        />
    </div>
    <v-divider class = "my-2"/>
    <div
      class = "unused"
      v-if = "set.unused"
      >
      <toggle-chip
        v-for = "id in set.unused"
        :key = "'chip-' + id"
        :category = "category"
        :id = "id"
        :active = "false"
        :label = "refs[id]?refs[id].label:id"
        />
    </div>
  </div>
</template>

<script>
import ToggleChip from './ToggleChip'

export default {
  name: 'filter-set',
  components: {
    ToggleChip
  },
  props: [
    'set',
    'refs',
    'category',
  ]
}
</script>
