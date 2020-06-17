<template>
  <div>
  </div>
</template>

<script>
import {
  mapActions,
} from 'vuex'
import _ from 'lodash'

export default {
  name: 'class-comp',
  props: [
    'id',
    'sourceSetHashes',
    'classItem',
    'items',
  ],
  data () {
    return {
      packIds: []
    }
  },
  created () {
    this.setClassProps({classId: this.id})
  },
  computed: {
    mergedSourceSets () {
      const result = {}
      _.forEach(this.sourceSetHashes, hash => {
        result[hash] = this.$store.state.item.mergedSourceSets[hash]
      })
      return result
    },
    instanceIds () {
      const result = []
      _.forEach(this.mergedSourceSets, sourceSet => {
        if (sourceSet) {
          result.push(..._.keys(sourceSet.meta.users[0]))
        }
      })
      return result
    },
    instancesProps () {
      let result = []
      _.forEach(this.instanceIds, instanceId => {
        result = _.union(result, _.keys(this.items[instanceId].ps))
      })
      return result
    }
  },
  watch: {
    instanceIds (instanceIds) {
      const instanceIdsByPack = {}
      instanceIds.map(id => {
        // TODO watch the item's packId if it can change later
        const packId = this.items[id].packId
        if (!instanceIdsByPack[packId]) {
          instanceIdsByPack[packId] = []
        }
        instanceIdsByPack[packId].push(id)
      })
      this.setInstanceIdsByPack({
        classId: this.id,
        instanceIdsByPack,
        oldPackIds: this.packIds
      })
      // save old pack ids
      this.packIds = _.keys(instanceIdsByPack)
    },
    'classItem.data.bp.data.ps' (newVal) {
      // this.setBlueprintProps({
      //   classId: this.id,
      //   propIds: _.keys(newVal)
      // })
    },
    instancesProps (newVal) {
      // this.setInstancesProps({
      //   classId: this.id,
      //   propIds: newVal
      // })
    }
  },
  methods: {
    ...mapActions('item', [
      'setInstanceIdsByPack',
    ]),
    ...mapActions('spread', [
      'setClassProps',
      'setBlueprintProps',
      'setInstancesProps',
    ]),
  },
  beforeDestroy () {
    this.setInstanceIdsByPack({
      classId: this.id,
      oldPackIds: this.packIds
    })
    this.setClassProps({
      classId: this.id,
      remove: true
    })
  }
}
</script>
