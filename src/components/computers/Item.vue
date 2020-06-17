<template>
  <div>
    <baker
      :parentState = "bakedItems"
      :id = "id"
      :bpLevel = "0"
      :item = "item"
      />
  </div>
</template>

<script>

import {
  mapState,
  mapActions,
} from 'vuex'

import Baker from './Baker'

import {getVal} from '@/utils/item'

export default {
  name: 'item',
  components: {
    Baker,
  },
  props: [
    'id',
    'item'
  ],
  computed: {
    ...mapState('item', [
      'bakedItems'
    ]),
    bakedItem () {
      const bakedItem = this.bakedItems[this.id]
      if (bakedItem && bakedItem.meta.ready) {
        return bakedItem.data
      }
    }
  },
  methods: {
    ...mapActions('item', [
      'setInfo',
    ]),
    updateInfo () {
      const props = this.bakedItem && this.bakedItem.ps
      if (props) {
        this.setInfo({
          id: this.id,
          info: {
            label: getVal(props.p_label),
            description: getVal(props.p_description),
          }
        })
      }
    },
  },
  watch: {
    'bakedItem.ps.p_label': {
      handler: 'updateInfo',
      deep: true
    },
    'bakedItem.ps.p_description': {
      handler: 'updateInfo',
      deep: true
    },
  },
  beforeDestroy () {
    this.setInfo({id: this.id})
  },
}
</script>
