import _ from 'lodash'
import WatchedSet from './WatchedSet'

export default class WatchedSetIds extends WatchedSet {
  init ({
    vm, paths = [], getFullPath,
    onAdd, onRemove, onChange, onUpdate,
    type = 'Array'
  }) {
    this.counter = {}
    this.ids = []
    this.data = {}
    // preprocess various kinds of data to id array
    this.preprocess =
      (type === 'Array' && (newVal => newVal)) ||
      (type === 'Object' && (newVal => _.keys(newVal))) ||
      (type === 'String' && (newVal => [newVal]))

    this.onAdd = onAdd && onAdd.bind(this)
    this.onRemove = onRemove && onRemove.bind(this)
    this.onChange = onChange && onChange.bind(this)

    super.init({vm, paths, onUpdate, getFullPath})
  }

  removePath (path, ...rest) {
    // add rest to path
    path = path + rest.join('.')
    if (this.watchers[path]) {
      // remove ids from this path
      this.onWatched(null, this.data[path], path)
      delete this.data[path]
      // unwatch
      super.removePath(path)
    }
  }

  onWatched (newIds, oldIds, path, customPreprocess) {
    const {
      counter, data,
      onAdd, onRemove, onChange,
      preprocess
    } = this
    // preprocess various kinds of data to id array
    newIds =
      (customPreprocess && customPreprocess(newIds)) ||
      (preprocess && preprocess(newIds))

    const oldIdsSet = _.keys(counter)
    let changed = false
    // add new ones
    _.forEach(newIds, id => {
      if (id) {
        if (counter[id] === undefined) {
          counter[id] = 0
          changed = true
          if (onAdd) {
            onAdd(id, path)
          }
        }
        counter[id]++
      }
    })
    // remove old propIds
    _.forEach(data[path], id => {
      if (id) {
        if (counter[id] !== undefined) {
          counter[id]--
        }
        if (!counter[id]) {
          changed = true
          delete counter[id]
          if (onRemove) {
            onRemove(id, path)
          }
        }
      }
    })

    // if the ids are changed, call with resulting set of ids
    const ids = _.keys(counter)
    if (changed && onChange) {
      onChange(ids, counter, oldIdsSet)
    }
    // update the saved ids
    this.ids = ids
    // update saved data
    if (path) {
      data[path] = newIds ? [...newIds] : []
    }
    // call onUpdate
    super.onWatched(newIds, oldIds, path)
  }
  destroy () {
    // call onRemove for all ids
    if (this.onRemove) {
      _.forEach(this.counter, (count, id) => {
        this.onRemove(id)
      })
    }
    delete this.counter
    delete this.ids
    delete this.data

    delete this.onAdd
    delete this.onRemove
    delete this.onChange

    super.destroy()
  }
}
