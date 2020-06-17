<template>
  <div>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
} from 'vuex'
import _ from 'lodash'

import Prop from './Prop'
import Condition from './Condition'

export default {
  name: 'value-set',
  components: {
    Condition,
  },
  props: [
    'st', // the statement
    'up', // parent statements (if a sub qualifier)
    'pr', // the prop
    'it', // the item

    'setProp',
  ],
  data () {
    return {
      consecutiveRefreshes: 0,
    }
  },
  computed: {
    ...mapState('item', {
      cn: 'context',
      id: 'bakedItems'
    })
  },
  methods: {
    processPath (path) {

    }
  }
}
</script>
