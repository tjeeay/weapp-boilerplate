import util from '../utils/util.js'
import BaseMinxin from '../mixins/base.js'
import regeneratorRuntime from './regenerator/runtime-module'

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

    for (let key in mixin) {
      const prop = mixin[key]

      if (~lifecycleHooks.indexOf(key) && !util.isFunction(prop)) {
        console.warn(`page hook '${key}' must be a function.`)
        continue
      }

      // undefined: set
      if (!(key in opts)) {
        opts[key] = prop
      }
      // for function: chain
      else if (util.isFunction(prop)) {
        if (util.isFunction(opts[key])) {
          const originFn = opts[key]
          opts[key] = function () {
            originFn.apply(this, arguments)
            prop.apply(this, arguments)
          }
        }
      }
      // for object: merge
      else if (util.isObject(prop)) {
        if (util.isObject(opts[key])) {
          opts[key] = { ...prop, ...opts[key] }
        }
      }
    }
  }
  delete opts.mixins

  // overwirte onLoad,
  // and promisify this.setData()
  const onLoad = opts.onLoad
  opts.onLoad = function () {
    const page = this

    page.$setData = function (data) {
      return new Promise(resolve => {
        page.setData(data, resolve)
      })
    }

    if (typeof onLoad === 'function') {
      onLoad.apply(page, arguments)
    }
  }

  // preload lifecycle
  if (opts.$route) {
    opts.$route = util.normalizeUrl(opts.$route)
    _preloadFns[opts.$route] = opts.onPreload
  }
  opts.$_preloadFns = _preloadFns

  return OriginPage(opts)
}
