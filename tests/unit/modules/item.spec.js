import Vue from 'vue'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import store from '@/store'

import _ from 'lodash'

const expect = chai.expect
const localVue = createLocalVue()
localVue.use(Vuex)

/*
npm run unit -- -t=modules-item
*/

describe('modules-item', () => {
  describe('updating item includer', () => {
    // const base = {
    //   config: {
    //     label: 'Base',
    //     description: 'Just the base project',
    //   },
    //   items: {
    //     item: {
    //       id: 'item',
    //     },
    //     prop: {
    //       id: 'prop',
    //     },
    //   }
    // }
    // const project1 = {
    //   config: {
    //     label: 'Project 1',
    //     description: 'Just project 1',
    //   },
    //   items: {
    //     p_item1: {
    //       id: 'p_item1',
    //       props: {}
    //     },
    //     p_item2: {
    //       id: 'p_item2',
    //       props: {}
    //     },
    //   }
    // }
    // const dep1 = {
    //   config: {
    //     label: 'dep1',
    //   },
    //   items: {
    //     dep1_item1: {
    //       id: 'dep1_item1',
    //     },
    //     dep1_item2: {
    //       id: 'dep1_item2',
    //     },
    //   }
    // }

    // split items by project
    function splitItemsByProject (items, projects) {
      const itemIdsByProject = {}
      _.forEach(items, (item, itemId) => {
        _.forEach(projects, (project, projectId) => {
          if (project.items[itemId]) {
            if (!itemIdsByProject[projectId]) {
              itemIdsByProject[projectId] = []
            }
            itemIdsByProject[projectId].push(itemId)
            return false
          }
        })
      })
      return itemIdsByProject
    }

    let itemState
    let items

    describe('actions.processProps', () => {
      beforeEach(() => {
        items = {
          prop1: {
            id: 'prop1',
            thisIsAnExistingProp: true
          },
          item1: {
            id: 'item1',
            props: {
              prop1: {
                valSets: {
                  val1: {
                    val: 'value1'
                  }
                }
              }
            }
          },
          item2: {
            id: 'item2',
            props: {
              prop2: {
                valSets: {
                  val1: {
                    val: 'value1'
                  }
                }
              }
            }
          },
          item3: {
            id: 'item3',
            props: {
              prop1: {
                valSets: {
                  val1: {
                    val: 'item1',
                    type: 'item_ref'
                  }
                }
              }
            }
          },
        }
        itemState = {
          items,
          combinedItems: {},
          combinedUsedItemIdsByItem: {},
        }

        // reset store
        store.dispatch('setState', {
          key: 'item',
          value: itemState
        })
      })

      it('processes existing props, and adds the prop\'s ref', () => {
        store.dispatch(
          'item/processProps',
          items.item1
        )
        expect(items.item1.props.prop1.ref).toBe(
          items.prop1
        )
      })
    })
  })
})
