import _ from 'lodash'

function mapActions (store, param1, param2) {
  const result = {}
  const module = param2 ? (param1 + '/') : ''
  const names = param2 || param1
  _.forEach(names, (name, key) => {
    key = typeof key === 'number' ? name : key
    result[key] = payload => store.dispatch(module + name, payload)
  })
  return result
}

function addProp (valConfigs, itemId) {
  if (valConfigs) {
    const result = {}
    valConfigs.map((valConfig, idx) => {
      let vId
      if (valConfig.id) {
        vId = valConfig.id
      } else {
        vId = (itemId ? itemId + '__' : '') + 'v' + idx
      }
      result[vId] = {
        vs: valConfig.vs,
        qs: valConfig.qs,
        t: valConfig.t,
      }
    })
    return result
  }
  return valConfigs
}

function addFillerProps ({item, items, blueprints, qualifier}) {
  const isArray = items
  if (!isArray) {
    items = [item]
  }
  items.map(item => {
    const additions = [
      ['', '']
    ]
    if (blueprints) {
      additions.push(['bp.data.', '_bp'])
      additions.push(['bp.data.bp.data.', '_bp_bp'])
    }
    additions.map(strings => {
      _.set(
        item,
        strings[0] + 'ps.prop_0',
        addProp([
          {
            vs: [item.id + ' prop_0 a' + strings[1]],
          },
          {
            vs: [item.id + ' prop_0 b' + strings[1]],
            qs: !qualifier
              ? undefined
              : {
                v: {
                  'q_prop_0': addProp([
                    { vs: [item.id + ' prop_0 b.qs.v.q_prop_0' + strings[1]] }
                  ], item.id)
                }
              }
          },
        ], item.id)
      )
    })
  })
  return isArray ? items : items[0]
}

function processPathPropSet (config) {
  const configs = []
  const pathParts = config.path.split('.')
  const propsIdx = pathParts.indexOf('ps')
  const preString = pathParts.slice(0, propsIdx).join('.')
  const postString = pathParts.slice(propsIdx).join('.')

  // get itemId (after items or bakedItems)
  let folderIdx = pathParts.indexOf('items')
  if (folderIdx < 0) {
    folderIdx = pathParts.indexOf('bakedItems')
  }
  let itemId = folderIdx >= 0 ? pathParts[folderIdx + 1] : undefined

  const additions = [
    ['', '']
  ]
  if (config.blueprints) {
    additions.push(['.bp.data', '_bp'])
    additions.push(['.bp.data.bp.data', '_bp_bp'])
  }

  additions.map(strings => {
    configs.push({
      path: preString + strings[0] + '.' + postString,
      value: config.value
        ? addProp(
          config.value.map(valConfig => {
            return {
              vs: valConfig.t !== 'null'
                ? valConfig.vs.map(v => v + strings[1])
                : valConfig.vs,
              qs: valConfig.qs,
              id: valConfig.id,
              t: valConfig.t,
            }
          }),
          itemId
        )
        : undefined,
      ignoreOrder: config.ignoreOrder
    })
  })

  return configs
}

function getSourceSetHash (state, itemId, blueprintLevel) {
  return _.get(
    state.item.bakedItems[itemId],
    'data.bp.'.repeat(blueprintLevel) +
    'meta.mergedSourceSetHash'
  )
}

export {
  mapActions,
  addProp,
  addFillerProps,
  processPathPropSet,
  getSourceSetHash,
}
