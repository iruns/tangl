import _ from 'lodash'

export default class WatchedSet {
  init ({
    vm, paths = [], getFullPath,
    onUpdate,
  }) {
    this.vm = vm
    this.watchers = {}

    this.getFullPath = getFullPath
    this.onUpdate = onUpdate && onUpdate.bind(this)

    this.addPath = this.addPath.bind(this)
    this.removePath = this.removePath.bind(this)
    this.setPaths = this.setPaths.bind(this)

    this.onWatched = this.onWatched.bind(this)
    this.destroy = this.destroy.bind(this)

    paths.map((path) => {
      this.addPath(path)
    })
  }

  addPath (path, ...rest) {
    const fullPath = this.getFullPath
      ? this.getFullPath(path, ...rest)
      : path
    // add rest to path
    path = path + rest.join('.')
    // watch
    const {onWatched} = this
    this.watchers[path] =
      this.vm.$watch(
        fullPath,
        function (newVal, oldVal) {
          onWatched(newVal, oldVal, path)
        }
      )
    // initial call
    onWatched(_.get(this.vm, fullPath), null, path)
  }

  removePath (path, ...rest) {
    // add rest to path
    path = path + rest.join('.')
    if (this.watchers[path]) {
      // unwatch
      this.watchers[path]()
      delete this.watchers[path]
    }
  }

  setPaths (paths) {
    _.forEach(this.watchers, (unwatch, path) => {
      this.removePath(path)
    })
    _.forEach(paths, path => {
      this.addPath(path)
    })
  }

  onWatched (newVal, oldVal, path) {
    // call onUpdate
    if (this.onUpdate) {
      this.onUpdate(newVal, oldVal, path)
    }
  }

  destroy () {
    _.forEach(this.watchers, unwatch => {
      unwatch()
    })
    delete this.vm
    delete this.watchers
    delete this.counter
    delete this.ids

    delete this.onUpdate

    delete this.addPath
    delete this.removePath
    delete this.setPaths
    delete this.onWatched
    delete this.destroy
  }
}
