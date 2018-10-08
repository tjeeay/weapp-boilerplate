import util from '../utils/util.js'
import preload from './preload'
import BaseMinxin from './mixins/base.js'
import BaseBehavior from './mixins/behavior.js'
import regeneratorRuntime from './regenerator/runtime-module'

// promisify
Object.keys(wx)
  .filter(api => util.isFunction(wx[api]))
  .map(api => {
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

// rewrite
;['$redirectTo', '$switchTab', '$reLaunch', '$navigateTo']
  .map(api => {
    const origin = wx[api]
    wx[api] = args => {
      if (typeof args === 'string') {
        args = {
          url: args
        }
      }
      args.url = util.normalizeUrl(args.url)
      preload.beforeLeave(args.url)
      return origin.call(null, args)
    }
  })

/**
 * extend Page:
 * 1. support mixins
 * 2. add onPreload lifecycle
 */
const OriginPage = Page
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
        console.warn(`page hook '${key}' must be a function in mixin.`)
        continue
      }

      // undefined: set
      if (!(key in opts)) {
        opts[key] = prop
      }
      else if (util.isFunction(prop)) {
        // for lifecycle hooks: chain
        if (~lifecycleHooks.indexOf(key)) {
          if (!util.isFunction(opts[key])) {
            console.warn(`page hook '${key}' must be a function in page options.`)
            continue
          }

          const originFn = opts[key]
          opts[key] = function () {
            originFn.apply(this, arguments)
            prop.apply(this, arguments)
          }
        }
        // for normal function: ignore
        else {
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

    page.$app = getApp()

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
  opts.$route = util.normalizeUrl(opts.$route)
  preload.register(opts.$route, opts.onPreload)

  return OriginPage(opts)
}

/**
 * extend Component:
 * 1. apply base behavior
 */
const OriginComponent = Component

Component = function (options) {

  const opts = { behaviors: [], ...options }

  // mixnis
  if (!~opts.behaviors.indexOf(BaseBehavior)) {
    opts.behaviors.unshift(BaseBehavior)
  }

  return OriginComponent(opts)
}