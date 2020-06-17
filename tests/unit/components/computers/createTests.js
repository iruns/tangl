import Vue from 'vue'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import store from '@/store'

import Data from '@/components/computers/Data'

import chai from 'chai'
import diff from 'variable-diff'
import _ from 'lodash'
import colors from 'colors' // eslint-disable-line
import {
  mapActions,
} from '../../../utils'

const expect = chai.expect
const localVue = createLocalVue()
localVue.use(Vuex)

export default function createTests ({groups, options = {}}) {
  mount(Data, {
    store,
    localVue,
    sync: false
  })

  const actions = {
    ...mapActions(store, ['setState'])
  }

  let activeGroups = []
  let exclusiveGroups = false

  groups.map(group => {
    if (group.only) {
      exclusiveGroups = true
      activeGroups.push(group)
    }

    let activeSubs = []
    let exclusiveSubs = false

    group.subs.map(sub => {
      if (sub.only) {
        exclusiveSubs = true
        activeSubs.push(sub)
      }
    })

    if (exclusiveSubs) {
      group.subs = activeSubs
    }
  })

  if (!exclusiveGroups) {
    activeGroups = groups
  }

  activeGroups.map(group => {
    describe(group.name, () => {
      group.subs.map(sub => {
        describe(sub.name, () => {
          before(async () => {
            // reset items
            // store.dispatch('setState', {
            //   path: 'item.items',
            //   value: {}
            // })
            // store.dispatch('setState', {
            //   path: 'pack.includes',
            //   value: {}
            // })
            actions.setState({
              path: 'item.items',
              value: {}
            })
            actions.setState({
              path: 'pack.includes',
              value: {}
            })
            // init
            await Vue.nextTick()
            sub.init.map(initGroup => {
              const path = initGroup.path ? initGroup.path + '.' : ''
              initGroup.subs.map(initSub => {
                // add filler props
                actions.setState({
                  path: path + initSub.id,
                  value: initSub.value || initSub,
                })
              })
            })

            await Vue.nextTick()

            if (options.logs.init) {
              options.logs.init.map(log => {
                console.log(log.cyan)
                console.log(JSON.stringify(
                  _.get(store.state, log), undefined, 2
                ))
              })
            }
          })

          sub.steps.map(configStep => {
            if (configStep) {
              it(configStep.name, async () => {
                options.logs.stepNames && console.log(('--- ' + configStep.name).cyan.bold)
                if (configStep.init) {
                  configStep.init.map(change => {
                    if (configStep.path) {
                      change.path = configStep.path + '.' + change.path
                    }
                    actions.setState(change)
                  })
                  if (options.logs.stepInit) {
                    options.logs.stepInit.map(log => {
                      console.log(log.cyan)
                      console.log(JSON.stringify(
                        _.get(store.state, log), undefined, 2
                      ))
                    })
                  }
                }

                await Vue.nextTick()

                options.logs.stepNames && console.log('------ changes'.cyan)
                // apply changes
                if (configStep.changes) {
                  configStep.changes.map(change => {
                    if (configStep.path) {
                      change.path = configStep.path + '.' + change.path
                    }
                    actions.setState(change)
                  })
                }
                if (options.logs.stepChanged) {
                  options.logs.stepChanged.map(log => {
                    console.log(log.cyan)
                    console.log(JSON.stringify(
                      _.get(store.state, log), undefined, 2
                    ))
                  })
                }
                // test
                await Vue.nextTick()

                options.logs.stepNames && console.log('------ tests'.cyan)
                if (configStep.tests && configStep.tests.length > 0) {
                  configStep.tests.map(test => {
                    // if it's a function (because it needs changed store value)
                    if (typeof test === 'function') {
                      test = test(store.state)
                    }
                    if (configStep.path) {
                      test.path = configStep.path + '.' + test.path
                    }
                    // expect

                    let value = test.value
                    const actual = _.get(
                      store.state, test.path
                    )
                    // if ignoring the order, delete the order
                    if (test.ignoreOrder) {
                      delete value.order
                      delete actual.order
                    }
                    // console.log('actual', actual)
                    // console.log('value', value)
                    if (options.prettyDiff && !_.isEqual(value, actual)) {
                      console.log('FAILED'.red.bold)
                      console.log('path:', test.path)
                      console.log('expected'.yellow)
                      console.log(JSON.stringify(
                        value, undefined, 2
                      ))
                      console.log('actual'.yellow)
                      console.log(JSON.stringify(
                        actual, undefined, 2
                      ))
                      console.log('diff'.yellow)
                      console.log(diff(
                        actual, value
                      ).text)
                      expect(true).to.equal(true)
                    } else {
                      expect(actual).to.deep.equal(value)
                    }
                  })
                } else {
                  expect(true).to.deep.equal(true)
                }
                // call custom post function
                configStep.after && configStep.after(store.state)

                // finishing
                await Vue.nextTick()

                if (options.logs.stepAfter) {
                  options.logs.stepAfter.map(log => {
                    console.log(log.cyan)
                    console.log(JSON.stringify(
                      _.get(store.state, log), undefined, 2
                    ))
                  })
                }
              })
            }
          })
        })
      })
    })
  })
}
