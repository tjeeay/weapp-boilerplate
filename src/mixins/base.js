import util from "../utils/util.js"

const _obj = Object.create(null)

export default {
  $set (key, val) {
    const p = Promise.resolve(val)
    _obj[key] = p.then(data => data)
  },

  $get (key) {
    const val = Promise.resolve(_obj[key])
    delete _obj[key]
    return val
  },

  onPreload (query) {
  },

  $beforeLeave (url) {
    const { route, query } = util.parseUrl(url)
    const preloadFn = this.$_preloadFns[route]
    if (util.isFunction(preloadFn)) {
      preloadFn.call(this, { route, query })
    }
  },

  $redirectTo (url) {
    url = util.normalizeUrl(url)
    this.$beforeLeave(url)
    return wx.$redirectTo({ url })
  },

  $switchTab (url) {
    url = util.normalizeUrl(url)
    this.$beforeLeave(url)
    return wx.$switchTab({ url })
  },

  $reLaunch (url) {
    url = util.normalizeUrl(url)
    this.$beforeLeave(url)
    return wx.$reLaunch({ url })
  },

  $navigateTo (url) {
    url = util.normalizeUrl(url)
    this.$beforeLeave(url)
    return wx.$navigateTo({ url })
  }
}
