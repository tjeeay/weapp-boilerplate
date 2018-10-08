import util from '../../utils/util.js'
import preload from '../preload.js'

export default {
  data: {
  },

  $getPreload (fetchFn, ...args) {
    const argArray = [this.$route]
    if (util.isFunction(fetchFn)) {
      argArray.push(fetchFn.bind(null, ...args))
    }
    return preload.getPreload.apply(preload, argArray)
  },

  $goto ({ currentTarget, detail }) {
    let { type, path } = currentTarget.dataset

    type = type || 'navigateTo'
    if (type[0] !== '$') {
      type = `$${type}`
    }
    const allowedTypes = ['$redirectTo', '$switchTab', '$reLaunch', '$navigateTo']
    if (allowedTypes.indexOf(type) === -1) {
      throw new Error(`not allowed type: ${type}`)
    }

    // remove default event arguments
    delete detail.x
    delete detail.y

    const queryStr = util.stringifyQuery(detail)
    path = path.indexOf('?') === -1
      ? `${path}?${queryStr}`
      : `${path}&${queryStr}`

    wx[type](path)
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
  },

  /**
   * 拨打电话
   * @param {Object} e.currentTarget.dataset.phone 电话号码
   */
  $makePhoneCall ({ currentTarget }) {
    return wx.$makePhoneCall({
      phoneNumber: currentTarget.dataset.phone
    })
  }
}
