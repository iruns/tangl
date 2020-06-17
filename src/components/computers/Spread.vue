<template>
  <div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex'
import _ from 'lodash'

import WatchedSet from './WatchedSet'

export default {
  name: 'spread',
  props: [
    'id',
    'config',
  ],
  data () {
    return {
      watchedConfigs: new WatchedSet(),
      watchedSubConfigs: {
        filter: new WatchedSet(),
        style: new WatchedSet(),
        layout: new WatchedSet(),
      },
    }
  },
  computed: {
    ...mapState({
      bakedConfigs: state => state.spread.bakedConfigs,
    }),
  },
  mounted () {
    const {
      id, config,
      watchedConfigs, watchedSubConfigs,
      updateBaseSpreads, checkBaseStatus, bake,
    } = this
    // setup bakedContainer
    this.setBakedContainer({id})

    // and prepare watchers for the bases
    watchedConfigs.init({
      vm: this,
      onUpdate () {
        checkBaseStatus()
      }
    })
    _.forEach(watchedSubConfigs, (watchedSubConfig, sub) => {
      // watch own subs
      this.$watch('config.' + sub, function (newVal, oldVal) {
        bake(sub, newVal, oldVal)
      })
      // and prepare watchers for the bases
      watchedSubConfig.init({
        vm: this,
        getFullPath (path) {
          return path + '.' + sub
        },
        onUpdate () {
          bake(sub)
        },
      })
    })
    // watch own config
    this.$watch('config.baseSpreads', updateBaseSpreads)
    updateBaseSpreads(config.baseSpreads)
  },
  methods: {
    ...mapActions('spread', [
      'updateReferer',
      'setBakedContainer',
      'setBakedStatus',
      'setBakedSub',
    ]),
    updateBaseSpreads (newVal, oldVal) {
      const {
        watchedConfigs, watchedSubConfigs,
        updateReferer, checkBaseStatus
      } = this

      const spreadPaths = []
      const spreadIds = []
      const idPairs = {}

      // if ready
      if (newVal) {
        newVal.map(([packId, spreadId]) => {
          // save id pairs
          idPairs[spreadId] = packId
          // and update paths
          spreadPaths.push('bakedConfigs.' + spreadId)
          spreadPaths.push('bakedConfigs.' + spreadId + '.ready')
          spreadPaths.push('bakedConfigs.' + spreadId + '.allBasesStatus')
          spreadIds.push(spreadId)
        })
      }

      // update watchers
      watchedConfigs.setPaths(spreadPaths)
      _.forEach(watchedSubConfigs, (watchedSubConfig, sub) => {
        watchedSubConfig.setPaths(spreadIds)
      })
      // bind new baseSpreads and unbind unused ones
      updateReferer({
        referer: this.id,
        idPairs
      })
      // check the base status
      checkBaseStatus()
    },
    /**
       * checks the status of own config and
       * base spread's whether they're ready or not,
       * or if there are circular dependency
       * @return {void}
       */
    checkBaseStatus () {
      const {
        id, config,
      } = this

      // if not ready, set status
      if (!config) {
        this.setBakedStatus({
          id,
          ready: false
        })
      } else {
        // if no baseSpreads, set status as ready
        if (!config.baseSpreads || config.baseSpreads.length === 0) {
          this.setBakedStatus({
            id,
            ready: true,
            allBasesStatus: {}
          })
        } else {
          // check if all baseSpreads are ready AND
          // doesn't reference this spread (non-circular)
          let ready = true
          const allBasesStatus = {}

          _.forEach(config.baseSpreads, ([packId, baseId]) => {
            const base = this.bakedConfigs[baseId]
            // if not ready yet
            if (!base || !base.ready) {
              allBasesStatus[baseId] = -1
              ready = false
            } else {
              // if ready
              // if requires this spread (is circular)
              if (base.allBasesStatus[this.id] !== undefined) {
                allBasesStatus[baseId] = 0
                ready = false
              } else {
                // else add its bases
                allBasesStatus[baseId] = 1
                Object.assign(allBasesStatus, base.allBasesStatus)
              }
            }
          })
          // update status
          this.setBakedStatus({
            id, ready, allBasesStatus
          })
        }
      }
    },
    // bake own and baseSpreads's configs
    bake (sub) {
      const {
        id, config,
      } = this

      // if no config, empty
      if (!config) {
        this.setBakedSub({id, sub, config: {}})
      } else {
        // else, bake
        const baseConfigs = []
        _.forEach(config.baseSpreads, ([packId, baseId]) => {
          // add it's sub config, in reverse
          const base = this.bakedConfigs[baseId]
          if (base) {
            baseConfigs.unshift(base[sub])
          }
        })
        if (config[sub]) {
          baseConfigs.unshift(config[sub])
        }
        this.setBakedSub({
          id, sub, subconfig: _.defaultsDeep({}, ...baseConfigs)
        })
      }
    }
  },
  beforeDestroy () {
    // remove self from the baseSpreads' referers
    this.updateReferer({referer: this.id})
    // remove self from baked
    this.setBakedContainer({id: this.id, remove: true})
  },
}
</script>
