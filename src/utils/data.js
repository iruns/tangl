import _ from 'lodash'

export function resolvePath ({path, items, item, prop, statement}) {
  let type = false
  let obj
  let i = 0
  let step = path[i]

  switch (step) {
    case '$id':
      obj = items
      type = 'its'
      break
    case '$it':
      obj = item
      type = 'it'
      break
    case '$pr':
      obj = prop
      type = 'pr'
      break
    case '$st':
      obj = statement
      type = 'st'
      break
    case '$vl':
      // TODO how to do this? Go to the statement,
      // then the value(s) that is another statement
      // obj = statement
      // type = 'st'
      break
    // case '$cn':
    //   obj = resolvePath({
    //     path: ['$it', 'pr', 'p_context'],
    //     item: item,
    //   }).obj
    //   break
  }
  i++

  // if starting point not found, return false
  if (!obj) {
    return {err: {type: 'invalid starting point', i}}
  }

  // try to get to the last step
  while (obj && i < path.length) {
    step = path[i]
    // if special step
    if (step[0] === '$') {
      // if instance
    } else {
      // if ordinary step
      obj = obj[step]
      // TODO how to access steps that are not directly below the object
      // or even children of aggregate of many object directly below this object
      // ! by stopping at the prop, and let the prop and valueSet computers dig deeper with another round of resolvePath
      if (!obj) {
        return {err: {type: 'next step not found', i}}
      }
      switch (type) {
        // if from items
        case 'id':
          type = 'it'
          break
        // if from a particular item
        case 'it':
          // go to either the props or the blueprint
          switch (step) {
            case 'pr':
              type = 'prs'
              break
            case 'bp':
              type = 'it'
              break
            default:
              // if not either, invalid
              return {err: {type: 'invalid next step after item', i}}
          }
          break
        // if from props
        case 'prs':
          // go to the particular prop
          type = 'pr'
          break
        // if from a particular prop
        case 'pr':
          // go to the statements
          switch (step) {
            case 'st':
              type = 'sts'
              break
            // case 'mt':
            //   type = 'prs'
              // break
            default:
              // if not either, invalid
              return {err: {type: 'invalid next step after prop', i}}
          }
          break
        // if from statements
        case 'sts':
          type = 'st'
          break
        // if from a particular statement
        // TODO how to handle sub statements
        case 'st':
          // go to either the values, the qualifiers, or the metadata
          switch (step) {
            case 'vl':
              type = 'vls'
              break
            case 'ql':
              type = 'qls'
              break
            case 'mt':
              type = 'prs'
              break
            default:
              // if not either, invalid
              return {err: {type: 'invalid next step after statements', i}}
          }
          break
        // if from values
        case 'vls':
          // set type according to the type of the value
          switch (step) {
            case 'vl':
              type = 'vls'
              break
            case 'ql':
              type = 'qls'
              break
            case 'mt':
              type = 'mt'
              break
            default:
              // if not either, invalid
              return {err: {type: 'invalid next step after statements', i}}
          }
          break
        // if from qualifiers
      }
    }
    i++
  }

  switch (type) {
    case 'id':
      return {err: {type: 'can\'t stop on items', i}}
    case 'prs':
      return {err: {type: 'can\'t stop on props', i}}
    case 'sts':
      return {err: {type: 'can\'t stop on statements', i}}
    case 'qls':
      return {err: {type: 'can\'t stop on qualifiers', i}}
  }

  return {type, obj}
}

export function getUpStatement (path, i, statement) {
  while (path[i] === 'up') {
    if (statement.up) {
      statement = statement.up
    } else {
      return false
    }
    i++
  }
  return [i, statement]
}

// hard-coded processes
export function replaceStatement (propVals) {

}
export function replaceStatementParts (propVals) {

}
export function nullifyStatement (propVals) {

}

// all unused
export function toMap (idValSet) {
  const map = new Map()
  if (idValSet) {
    idValSet.ids.map(id => {
      map.set(id, idValSet.values[id])
    })
  }
  return map
}

export function fromMap (map) {
  const ids = []
  const values = {}
  map.forEach((val, id) => {
    ids.push(id)
    values[id] = val
  })
  return {ids, values}
}

/**
 * Adding, changing value of, or deleting entry of an ordered object
 * exampleOrderedObject: {
 *   order: [id1, id2, ...],
 *   values: {
 *     id1: ...,
 *     id2: ...
 *   }
 * }
 * @param {Object}  rootRef root firebase reference of the path
 * @param {Object}  root    root state of the path
 * @param {Array}   path    path pointing to the ordered object
 * @param {String}  id      id of the ordered object's entry
 * @param {Object}  value   the new value
 */
export function saveOrderedObject ({rootRef, root, path, id, value}) {
  const ref = rootRef.child(path.join('/'))
  const object = _.get(root, path, {
    order: [],
    values: {}
  })
  const idx = object.order.indexOf(id)
  // if changing value
  if (value !== undefined) {
    ref.child('values').update({[id]: value})
    // if adding
    if (idx < 0) {
      ref.child('order').set([...object.order, id])
    }
  } else if (idx >= 0) {
    // else if deleting
    ref.child('values/' + id).remove()
    const order = [...object.order]
    order.splice(idx, 1)
    ref.child('order').set(order)
  }
}
