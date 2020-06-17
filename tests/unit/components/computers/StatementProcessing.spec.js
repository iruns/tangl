// import Vue from 'vue'
import Vuex from 'vuex'
import {
  // mount,
  createLocalVue
} from '@vue/test-utils'
// import store from '@/store'

// import ValueSet from '@/components/computers/ValueSet'

// import {
//   addProp,
//   addFillerProps,
//   processPathPropSet,
// } from '../../utils'

import chai from 'chai'
// import diff from 'variable-diff'
// import _ from 'lodash'
// import {
//   mapActions,
// } from '../../../utils'

import {
  resolvePath
} from '@/utils/data'

const expect = chai.expect
const localVue = createLocalVue()
localVue.use(Vuex)
/*
npm run test:unit ./tests/unit/components/computers/StatementProcessing.spec.js -- -w
*/

// this file tests utils/data.js, espeially the path resolving function
describe('utils/data.js', () => {
  // let actions
  // before(() => {
  //   actions = {
  //     ...mapActions(store, ['setState'])
  //   }
  // })
  describe('resolvePath', () => {
    describe('resolving various path starting points', () => {
      // test('$st: the statement', () => {
      //   const items = {
      //     main_item: {}
      //   }
      //   const path = '$st'
      //   const resolvedVal = resolvePath({
      //     items,
      //     path
      //   })
      //   expect(resolvedVal).to.equal(items.main_item)
      // })
      // test('$pr: the prop', () => {
      //   const items = {
      //     main_item: {}
      //   }
      //   const path = '$pr'
      //   const resolvedVal = resolvePath({
      //     items,
      //     path
      //   })
      //   expect(resolvedVal).to.equal(items.main_item)
      // })
      // test('$it: the item', () => {
      //   const items = {
      //     main_item: {}
      //   }
      //   const path = '$it'
      //   const resolvedVal = resolvePath({
      //     items,
      //     path
      //   })
      //   expect(resolvedVal).to.equal(items.main_item)
      // })
      // test('$up: parent statement (of qualifier)', () => {
      //   const items = {
      //     main_item: {}
      //   }
      //   const path = '$up'
      //   const resolvedVal = resolvePath({
      //     items,
      //     path
      //   })
      //   expect(resolvedVal).to.equal(items.main_item)
      // })
      test('$id: another item', () => {
        const items = {
          value_item: {}
        }
        const path = '$id.value_item'
        const resolvedVal = resolvePath({
          items,
          path
        })
        expect(resolvedVal).to.equal(items.value_item)
      })
    })
    describe.skip('resolving various path\'specify middle parts', () => {
    })
    describe.skip('resolving various path end points', () => {
    })
  })
  describe.skip('processing statements with qualifiers', () => {
    test('item qualifier', () => {
      // actions.setState({
      //
      // })
      // const items = {
      //   main_item: {
      //     ps: {
      //       p_prop_sample: {
      //         st1: {
      //
      //         }
      //       }
      //     }
      //   }
      // }
      // const wrapper = mount(ValueSet, {
      //   store,
      //   localVue,
      // })
      // const path = '$st'
      // const resolvedVal = resolvePath({
      //   items,
      //   path
      // })
      // expect(resolvedVal).to.equal(items.main_item)
    })
    test('value qualifier', () => {
    })
    test('prop qualifier', () => {
    })
    test('context qualifier', () => {
    })
    test('longer path qualifier', () => {
    })
  })
})
