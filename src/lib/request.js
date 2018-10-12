import tokenManager from './token-manager.js'
import config from '../config/index.js'
import util from '../utils/util.js'
import regeneratorRuntime from './regenerator/runtime-module'

const request = {}
const methods = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]

const maxRetry = 5
let retryCounter = 0

methods.map(method => {
  request[method] = async function (options) {
    let { url, data, header, dataType, responseType } = options

    if (typeof options === 'string') {
      url = options

      if (arguments.length === 2) {
        data = arguments[1]
      }    
    }
  
    const opts = {
      url,
      data,
      header,
      method,
      dataType,
      responseType
    }

    const token = await tokenManager.getAccessToken()

    if (tokenManager.isFetchingToken()) {
      return await tokenManager.pushWaitingRequest(opts)
    }

    opts.header = opts.header || {}
    opts.header['Authorization'] = `Bearer ${token}`

    try {
      const res = await request.send(opts)
  
      // token expired
      if (res.statusCode === 401 && retryCounter <= maxRetry) {
        retryCounter++
        await tokenManager.clearAccessToken()
        return await request[method](opts)
      }
      retryCounter = 0

      if (res.statusCode >= 500) {
        wx.showToast({
          title: '系统错误',
          icon: 'none'
        })
        return
      }
  
      return res.data
    } catch (err) {
      console.error(`request filed: ${method} ${url}`, err)
      wx.showToast({
        title: '请求失败',
        icon: 'none'
      })
    }

    return
  }
})

function buildUrl (relativeUrl) {
  if (~relativeUrl.indexOf('://')) {
    return relativeUrl
  }

  let url = util.trimEnd(config.server, '/')
  url += `/${util.trimStart(config.prefix, '/')}`
  url += `/${util.trimStart(relativeUrl, '/')}`
  return url
}

/**
 * send request
 * @param {Object} options 
 * @param {String} options.url 开发者服务器接口地址
 * @param {String/Object/ArrayBuffer} options.data 请求的参数
 * @param {Object} options.header 设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
 * @param {String} options.method HTTP 请求方法 default: GET
 * @param {String} options.dataType 返回的数据格式 default: json
 * @param {String} options.responseType 响应的数据类型 default: text
 */
request.send = async (options) => {
  const opts = Object.assign({}, options)
  opts.url = buildUrl(options.url)

  if (!config.isProduction()) {
    console.log(`${options.method.toUpperCase()} ${options.url}`, opts)
  }

  const res = await wx.$request(opts)

  if (!config.isProduction()) {
    console.log(`${res.statusCode}`, `${options.method.toUpperCase()} ${options.url}`, res)
  }

  return res
}

export default request
