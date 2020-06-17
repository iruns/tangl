<template>
  <div>
  </div>
</template>

<script>

import {
  mapActions,
} from 'vuex'
import _ from 'lodash'

import ValueSet from './ValueSet'

export default {
  name: 'prop',
  components: {
    ValueSet,
  },
  props: [
    'parentId',
    'id',

    'sources',
    'paths',

    'parentState',

    'setSubProp',
  ],
  // TODO optimization, watchers should watch an object that collects
  // all prop of this id in all the source items so as to not be triggered
  // by changes in other props
  // 2 alternate ways to do this if the source item doesn't have the prop:
  // 1. fill with null and watch it
  // 2. watch the "props" object as long as the prop doesn't exist
  data () {
    return {
      watchers: [],
    }
  },
  created () {
    // if a sub prop, use the setSubProp instead of the store's action
    if (this.setSubProp) {
      this.setProp = this.setSubProp
    }

    this.watchSources()
  },
  watch: {
    // watch sources
    paths: 'watchSources'
  },
  methods: {
    ...mapActions('item', [
      'setProp',
    ]),
    watchSources (newVal, oldVal) {
      const {
        id, watchers, paths, applyInheritance
      } = this
      // unwatch prev
      watchers.map(unwatch => {
        unwatch()
      })
      // watch new
      paths.map(path => {
        path = `${path}.ps.${id}`
        watchers.push(
          this.$watch(
            path,
            applyInheritance
          )
        )
      })
      // call once to initiate
      applyInheritance(true)
    },
    applyInheritance (newVal, oldVal) {
      console.log((this.parentId + ' ' + this.id).green)
      // console.log('--- new'.grey)
      console.log(JSON.stringify(
        newVal, undefined, 2
      ))
      // console.log('--- old'.grey)
      // console.log(JSON.stringify(
      //   oldVal, undefined, 2
      // ))
      // this.paths.map(path => {
      //   console.log(('> ' + path).blue)
      //   console.log(JSON.stringify(
      //     _.get(this, `${path}.ps.${this.id}`), undefined, 2
      //   ))
      // })
      if (
        // if used to be undefined but now defined OR
        (!oldVal && newVal) ||
        // different
        !_.isEqual(newVal, oldVal)
      ) {
        // console.log(JSON.stringify(
        //   newVal, undefined, 2
        // ))
        const {
          id, paths, parentState, setProp
        } = this
        let data = {}
        // for each path
        paths.map(path => {
          const source = _.get(this, `${path}.ps.${id}`)
          // if exists
          if (source) {
            // for each val set (in order)
            _.forEach(source, (valSet, valSetId) => {
              // set the value (add / overwrite)
              data[valSetId] = valSet
            })
          }
        })
        // if empty, remove
        if (_.keys(data).length === 0) {
          data = undefined
        }
        setProp({parentState: parentState.ps, id, data})
      }
    }
  },
  destroyed () {
    const {
      id, parentState,
      watchers,
      setProp,
    } = this
    watchers.map(unwatch => {
      unwatch()
    })
    setProp({parentState: parentState.ps, id})
  }
}
</script>
