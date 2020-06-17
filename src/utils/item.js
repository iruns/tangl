import _ from 'lodash'
import Vue from 'vue'

export function getPathResultType (path) {
  // if 2nd to last /i/ = item
  // if 2nd to last /(?:p|.q)s/ = prop
  // if 3rd to last /(?:p|.q)s/ = statement
}

export function collectVals (prop, qualifiers) {
  const valSets = []
  if (prop) {
    // TEMP sort using ids in alphabetical order
    const order = _.keys(prop).sort()
    _.forEach(order, valId => {
      valSets.push(prop[valId].vs)
    })
  }
  return valSets
}

// TEMP get the first val
export function getVal (prop, qualifiers) {
  const valSets = collectVals(prop, qualifiers)
  if (valSets && valSets[0]) {
    return valSets[0][0]
  }
}

// add language to statements from "language specific data"
export function addLanguage (item, lang) {
  if (item && item.ps) {
    _.forEach(item.ps, prop => {
      _.forEach(prop, valSet => {
        _.set(valSet, ['qs', 'e', 'p_lang', lang, 'vs'], [lang])
      })
    })
  }
}

// update a whole item, or parts of it
export function updateItem (updateKey, update, parent) {
  // if NOT deleting
  if (update !== null) {
    _.forEach(update, (val, key) => {
      // if undefined in parent, simply copy the whole update
      if (!parent[key] || parent[key] === true) {
        Vue.set(parent, key, val)
      } else {
        // else, dig deeper
        updateItem(key, val, parent[key])
      }
    })
  } else {
    // else if deleting
    Vue.delete(parent, updateKey)
  }
}

// /**
//  * Extracts valueSets from a prop in an ordered manner
//  * TODO incorporate qualifiers
//  * @param  {Object} prop a prop from an item's props
//  * @return {Object}      [description]
//  */
// export function extractValueSets (prop) {
//   const values = []
//   prop.order.map(valSetId => {
//     values.push(prop.values[valSetId])
//   })
//   return values
// }
//
// /**
//  * Extracts item ref values from a prop in an ordered manner
//  * @param  {Object} prop a prop from an item's props
//  * @return {Object}      [description]
//  */
// export function extractItemValues (prop) {
//   const values = extractValueSets(prop)
//   const items = []
//   values.map(valSet => {
//     items.push(valSet.ref)
//   })
//   return items
// }
