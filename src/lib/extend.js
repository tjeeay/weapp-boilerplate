import util from '../utils/util.js'
import BaseMinxin from '../mixins/base.js'

/**
 * promisify wx api
 */

const wxApis = Object.keys(wx).filter(api => util.isFunction(wx[api]))

wxApis.map(api => {
  wx[`$${api}`] = /Sync$/.test(api)
    ? wx[api]
    : args => new Promise((resolve, reject) => {
        wx[api]({
          ...args,
          success: resolve,
          fail: reject
        })
      })
})


/**
 * extend Page:
 * 1. support mixins
 * 2. add onPreload lifecycle
 */

const OriginPage = Page
const _preloadFns = {}
const lifecycleHooks = [
  'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh',
  'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap'
]

Page = function (options) {

  const opts = { mixins: [], ...options }

  // mixnis
  if (!~opts.mixins.indexOf(BaseMinxin)) {
    opts.mixins.unshift(BaseMinxin)
  }

  for (let item of opts.mixins) {
    let mixin = { ...item }
    if (!util.isObject(mixin)) continue

    // data
    if (util.isObject(mixin.data)) {
      opts.data = { ...mixin.data, ...opts.data }
    }
    delete mixin.data

    for (let key in mixin) {

      // custom property/function
      if (!~lifecycleHooks.indexOf(key)) {
        opts[key] = opts[key] || mixin[key]
        continue 
      }

      // lifecycle hooks
      const originHook = opts[key] || function () { }
      if (util.isFunction(mixin[key])) {
        opts[key] = function () {
          originHook.apply(this, arguments)
          mixin[key].apply(this, arguments)
        }
      } else {
        console.warn(`page hook '${key}' must be a function.`)
      }
    }
  }
  delete opts.mixins

  // preload lifecycle
  if (opts.$route) {
    opts.$route = util.normalizeUrl(opts.$route)
    _preloadFns[opts.$route] = opts.onPreload
  }
  opts.$_preloadFns = _preloadFns

  return OriginPage(opts)
}
