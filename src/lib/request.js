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
      if (res.statusCode === 401) {
        await tokenManager.clearAccessToken()
        return await request[method](opts)
      }
  
      return res.data
    } catch (err) {
      console.error(`request filed: ${method} ${url}`, err)
    }

    return
  }
})

function buildUrl (relativeUrl) {
  if (/^http/.test(relativeUrl)) {
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
  options.url = buildUrl(options.url)
  return await wx.$request(options)
}

export default request
