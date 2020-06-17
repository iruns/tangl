<template>
<v-list dense>
  <spread-button
    v-for = "spreadId in spreadIds"
    :key = "spreadId"
    />
</v-list>
</template>

<script>
import {mapState} from 'vuex'
import SpreadButton from './SpreadButton'

export default {
  name: 'pack-spreads',
  components: {
    SpreadButton,
  },
  props: [
    'spreadIds',
  ],
}
</script>
