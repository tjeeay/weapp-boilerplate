import util from '../utils/util.js'

const _preloadFns = {}
const _obj = Object.create(null)

const preload = {

  register (key, fn) {
    if (key) {
      _preloadFns[key] = fn
    }
  },

  preload (key, val) {
    const p = Promise.resolve(val)
    _obj[key] = p.then(data => data)
  },

  getPreload (key, fetchFn) {
    if (!(key in _obj)) {
      if (util.isFunction(fetchFn)) {
        return Promise.resolve(fetchFn())
      }
      return null
    }
    const p = _obj[key]
    delete _obj[key]
    return p
  },

  beforeLeave (url) {
    const { route, query } = util.parseUrl(url)
    const preloadFn = _preloadFns[route]
    if (util.isFunction(preloadFn)) {
      this.preload(route, preloadFn.call(null, query))
    }
  }

}

export default preload
