<template>
</template>

<script type = "text/javascript">
import _ from 'lodash'

export default {
  name: 'layout-resolver',
  props: [
    'activeItems',
  ],
  data () {
    return {
      MIN_SPEED: 0.3,
      MAX_SPEED: 50,
      paused: false,
      timeoutFunc: undefined,
      tick () {console.log('NOT STARTED') },
      setTargetPosition (payload) {
        this.$store.dispatch(
          'item/setTargetPosition',
          payload
        )
      },
      saveItemPositions (payload) {
        this.$store.dispatch(
          'spread/saveConfigValue',
          {
            path: ['layout', 'lastPositions'],
            value: payload
          }
        )
      },
    }
  },
  computed: {
    resolveLayout () {
      return this.$store.getters['spread/resolveLayout']
    }
  },
  watch: {
    resolveLayout (newValue) {
      // if resolving, resolve
      if (newValue) {
        this.resolve()
      } else {
        // else, stop running resolve process
        clearTimeout(this.timeoutFunc)
      }
    }
  },
  methods: {
    // TODO force in relation to other's prop value
    // TODO force of itemData with same prop value

    // TODO add default values to the force config
    resolve () {
      const activeItems = this.$props.activeItems
      const itemData = this.$store.getters['item/items']
      const itemPositions = this.$store.getters['item/positions']
      const itemDimensions = this.$store.getters['item/dimensions']

      // const config = this.$store.getters['spread/layout']
      // const config = [
      //   {
      //     p_class: [
      //       // lift above
      //       {
      //         directional: true,
      //         strength: .9,
      //         minDist: [null, 110],
      //         maxDist: [Infinity, Infinity],
      //         priority: 1
      //       },
      //       {
      //         directional: true,
      //         strength: .7,
      //         minDist: [null, 110],
      //         maxDist: [null, 110],
      //         priority: 1
      //       },
      //       // x alignment
      //       {
      //         strength: .5,
      //         minDist: [null, null],
      //         maxDist: [100, null],
      //         priority: 1
      //       },
      //     ],
      //     p_refItem: [
      //       // lift above
      //       {
      //         directional: true,
      //         strength: .9,
      //         minDist: [null, 110],
      //         maxDist: [Infinity, Infinity],
      //         priority: 1
      //       },
      //       {
      //         directional: true,
      //         strength: .7,
      //         minDist: [null, 110],
      //         maxDist: [null, 110],
      //         priority: 1
      //       },
      //       // x alignment
      //       {
      //         strength: .5,
      //         minDist: [null, null],
      //         maxDist: [100, null],
      //         priority: 1
      //       },
      //     ],
      //     '*': [
      //         {
      //           strength: .05,
      //           minDist: [50, 10],
      //           maxDist: [Infinity, Infinity],
      //           priority: 0
      //         },
      //       ]
      //   },
      //   {
      //   '*': [
      //       {
      //         strength: .7,
      //         minDist: [200, 100],
      //         maxDist: [Infinity, Infinity],
      //         priority: 0
      //       },
      //       {
      //         strength: .7,
      //         minDist: [250, 100],
      //         maxDist: [Infinity, Infinity],
      //         priority: 0
      //       },
      //     ]
      //   }
      // ]
      const config = [
        {
          '*': [
            {
              axis: [0, 1], // [] / 'r'
              direction: 0,

              dists: [10, 10],
              strength: 30,
              priority: 0
            },
          ]
        }
      ]

      // clear prev timeout
      clearTimeout(this.timeoutFunc)

      const nodes = {}
      let forces = {}

      // if there are actually stuff to resolve
      if (activeItems.length > 0) {
        // create nodes
        activeItems.map((id, idx) => {
          nodes[id] = {
            idx: idx,
            id: id,
            props: itemData[id].props,
            position: itemPositions[id]
              ? [
                itemPositions[id].x,
                itemPositions[id].y,
              ]
              : [0, 0],
            dimensions: itemDimensions[id],
            offset: [0, 0],
            forces: []
          }
        })

        // fill the nodes' forces
        _.forEach(nodes, (node, id) => {
          config.map((phase, phaseIdx) => {
            // check if any config applies
            _.forEach(phase, (propConfigs, propId) => {
              // if for all
              if (propId === '*') {
                propConfigs.map(propConfig => {
                  _.forEach(nodes, (target, targetId) => {
                    if (
                    // if not self
                      id !== targetId &&
                        (
                          // if the same force has been created by the other item
                          !forces[targetId] ||
                          !forces[targetId][id]
                        )
                    ) {
                      const newForce = {
                        config: this.fillSides(
                          this.getType(propConfig.axis),
                          node, target, propConfig
                        ),
                        // phase: phaseIdx,
                        target: target
                      }

                      _.set(forces, [id, targetId], true)
                      node.forces.push(newForce)
                    }
                  })
                })
                return true
              }

              // const prop = node.props[propId]

              // if(prop !== undefined){
              //
              //   propConfigs.map(propConfig => {
              //
              //     _.forEach(prop, valSet => {
              //
              //       const target = nodes[valSet.val]
              //
              //       if(target){
              //         const newForce = {
              //           config: propConfig,
              //           phase: phaseIdx,
              //           target: target
              //         }
              //         node.forces.push(newForce)
              //       }
              //     })
              //   })
              // }
            })
          })
        })
        forces = null

        let frames = 0
        let lastPhase = 0
        let lastNode = Math.min(1, activeItems.length - 1)

        // for (var i = lastNode + 1; i < activeItems.length; i ++)
        //   nodes[activeItems[i]].element.style.display = 'none'

        // TODO quantize positions after each this.tick
        this.tick = () => {
          // for each node
          for (let n = 0; n <= lastNode; n++) {
            const id = activeItems[n]
            const node = nodes[id]

            // for each force set in the node
            node.forces.map(force => {
              // if in active phase
              // if(force.phase <= lastPhase){

              // if the target is already activated
              // if(force.target.idx <= lastNode){

              const type = this.getType(force.config.axis)

              const offset = this.getOffset(
                type, node,
                force.target, force.config
              )
              node.offset[0] += offset[0] / 2
              node.offset[1] += offset[1] / 2
              force.target.offset[0] -= offset[0] / 2
              force.target.offset[1] -= offset[1] / 2

              // }
              // }
            })
          }

          let going = false

          // for (let n = 0; n <= lastNode; n ++) {
          for (let n = 0; n < activeItems.length; n++) {
            const id = activeItems[n]
            const node = nodes[id]

            // if still moving more than this.MIN_SPEED, don't stop
            if (
              !going && (
                Math.abs(node.offset[0]) > this.MIN_SPEED ||
                  Math.abs(node.offset[1]) > this.MIN_SPEED
              )
            ) {going = true}

            // move position
            for (var i = 0; i < 2; i++) {
              // node.offset[i] *= .2
              node.offset[i] = _.clamp(node.offset[i], -this.MAX_SPEED, this.MAX_SPEED)
              node.position[i] += Math.round(node.offset[i])
            }

            this.setTargetPosition({
              id: id,
              data: {
                x: node.position[0],
                y: node.position[1],
              }
            })

            node.offset = [0, 0]
          }

          // if not going any more, try to activate next phase or node
          if (!going) {
            going = true
            lastPhase++

            // if already last phase, activate next node,
            // and restart phase
            if (lastPhase === config.length) {
              lastNode++
              if (lastNode < activeItems.length) {
                // nodes[activeItems[lastNode]].element.style.display = 'block'
                lastPhase = 0
              }
              // if already last node, finish
              else {going = false}
            }
          }

          frames++
          // console.log('------',frames)

          if (going && frames < 50 && !this.paused) {
            this.timeoutFunc = setTimeout(this.tick, 1000)
            // if ending, save positiond
          } else {
            const positions = {}
            _.forEach(nodes, (node, id) => {
              positions[id] = {
                x: node.position[0],
                y: node.position[1],
              }
            })
            this.saveItemPositions(positions)
          }
        }
        this.tick()
      }
    },
    getType (axis) {
      if (axis === 'r') {
        return 'field'
      }
      return axis.length
    },
    fillSides (type, node, target, propConfig) {
      const itemConfig = _.cloneDeep(propConfig)

      // get edges of effect relative to the
      // coordinate position [left, right]

      itemConfig.ownSides = [null, null]

      switch (type) {
        // if spacing
        case 2:
          itemConfig.ownSides = [
            [
              -propConfig.dists[0] + 0,
              propConfig.dists[0] + node.dimensions.width
            ],
            [
              -propConfig.dists[1] + 0,
              propConfig.dists[1] + node.dimensions.height
            ]
          ]
          itemConfig.targetSides = [
            [0, target.dimensions.width],
            [0, target.dimensions.height],
          ]
          break
          // if sort or align
        case 1:

          break
          // if attract or repel
        default:
      }
      return itemConfig
    },
    getOffset (type, node, target, config) {
      let offset = [0, 0]
      switch (type) {
        // if spacing
        case 2:

          const ownSides = [[], []]
          const targetSides = [[], []]

          for (var axis = 0; axis < 2; axis++) {
            for (var side = 0; side < 2; side++) {
              ownSides[axis][side] =
                  node.position[axis] +
                  config.ownSides[axis][side]

              targetSides[axis][side] =
                  target.position[axis] +
                  config.targetSides[axis][side]
            }
          }

          // check if both axis overlap
          const overlaps = (
            ownSides[0][0] < targetSides[0][1] &&
              ownSides[0][1] > targetSides[0][0] &&
              ownSides[1][0] < targetSides[1][1] &&
              ownSides[1][1] > targetSides[1][0]
          )

          // if overlaps, get shortest side
          if (overlaps) {
            let minDist = Infinity
            let minAxis

            // for each axis
            for (var axis = 0; axis < 2; axis++) {
              // for each target side
              for (var side = 0; side < 2; side++) {
                const mult = side === 0 ? -1 : 1
                const other = side === 0 ? 1 : 0
                const dist = (targetSides[axis][side] - ownSides[axis][other])

                // if this target side is inside
                if (dist * mult > 0) {
                  if (Math.abs(dist) < Math.abs(minDist)) {
                    minDist = dist
                    minAxis = axis
                  }
                }
              }
            }

            // set force in direction of, and limit to minDist
            let force
            if (minDist > 0) {force = Math.min(config.strength, minDist) } else {force = Math.max(-config.strength, minDist) }

            // set offset to match
            if (minAxis !== undefined) {offset[minAxis] = force}
          }
          break
          // if sort or align
        case 1:

          break
          // if attract or repel
        default:
      }
      return offset
    },
  }
}

document.addEventListener('keyup', (event) => {
  const keyName = event.key

  if (keyName === ' ') {
    this.paused = !this.paused
    console.log('-----' + (this.paused ? 'PAUSED' : 'RESUMED') + '-----')
    if (!this.paused) {this.tick() } else {clearTimeout(this.timeoutFunc) }
  }
})

</script>
