import WatchedSet from './WatchedSet'

export default class WatchedSetPathCheck extends WatchedSet {
  init ({
    vm, paths = [], getFullPath, getOutputPath,
    onAdd, onRemove, onChange, onUpdate,
  }) {
    this.checkedPaths = {}
    this.paths = []
    this.getOutputPath = getOutputPath || (path => path)

    this.onAdd = onAdd && onAdd.bind(this)
    this.onRemove = onRemove && onRemove.bind(this)
    this.onChange = onChange && onChange.bind(this)

    super.init({vm, paths, onUpdate, getFullPath})
  }

  addPath (path, ...rest) {
    // add rest to path
    path = path + rest.join('.')
    this.paths.push(path)
    super.addPath(path)
  }

  removePath (path, ...rest) {
    // add rest to path
    path = path + rest.join('.')
    const idx = this.paths.indexOf(path)
    if (idx >= 0) {
      this.paths.splice(idx, 1)
    }
    super.removePath(path)
  }

  onWatched (newVal, oldVal, path) {
    const {
      checkedPaths, getOutputPath,
      onAdd, onRemove, onChange
    } = this

    let changed = false
    if (newVal && !oldVal) {
      changed = true
      if (onAdd) {
        onAdd(newVal, oldVal, path)
      }
      checkedPaths[path] = true
    } else if (!newVal && oldVal) {
      if (onRemove) {
        onRemove(newVal, oldVal, path)
      }
      changed = true
      delete checkedPaths[path]
    }
    // if the paths are changed,
    // call with resulting set of paths (in the original order)
    if (changed && onChange) {
      const paths =
        this.paths.filter(
          path => checkedPaths[path]
        ).map(
          path => getOutputPath(path)
        )
      onChange(paths)
    }
    // call onUpdate
    super.onWatched(newVal, oldVal, path)
  }

  destroy () {
    delete this.checkedPaths
    delete this.paths
    delete this.onAdd
    delete this.onRemove

    super.destroy()
  }
}
