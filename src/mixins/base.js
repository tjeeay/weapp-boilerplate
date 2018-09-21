import util from "../utils/util.js"

const _obj = Object.create(null)

export default {
  data: {
  },

  $preset (key, val) {
    const p = val instanceof Promise 
                ? val
                : Promise.resolve(val)
    _obj[key] = p.then(data => data)
  },

  $getPreset () {
    const key = `/${this.route}`
    if (!(key in _obj)) {
      return null
    }
    const p = _obj[key]
    delete _obj[key]
    return p
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
  },

  $goto ({ target, detail }) {
    let { type, path } = target.dataset

    type = type || 'navigateTo'
    if (type[0] !== '$') {
      type = `$${type}`
    }
    const allowedTypes = ['$redirectTo', '$switchTab', '$reLaunch', '$navigateTo']
    if (allowedTypes.indexOf(type) === -1) {
      throw new Error(`not allowed type: ${type}`)
    }

    const queryStr = util.stringifyQuery(detail)
    path = path.indexOf('?') === -1
      ? `${path}?${queryStr}`
      : `${path}&${queryStr}`

    this[type](path)
  },
  
  /**
   * 显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
   * @param {String} title - 提示的内容
   * @param {Boolean} mask - 是否显示透明蒙层，防止触摸穿透，默认：false
   */
  $showLoading (title = '加载中...', mask = false) {
    return wx.$showLoading({
      title,
      mask
    })
  },

  /**
   * 隐藏 loading 提示框
   */
  $hideLoading () {
    return wx.$hideLoading()
  },

  /**
   * 显示消息提示框
   * @param {Object|String} options 
   */
  $showToast (options) {
    let title = ''
    let icon = 'none'

    if (typeof options === 'string') {
      title = options

      if (typeof arguments[1] === 'string') {
        icon = arguments[1]
      }
    }

    return wx.$showToast({
      ...options,
      title,
      icon
    })
  }
}
