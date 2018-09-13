const request = {}

[
  'get',
  'post',
  'put',
  'patch',
  'delete'
].map(method => {
  request[method] = function (options) {
    let { url, data, header, dataType, responseType } = options

    if (typeof options === 'string') {
      url = options
    }

    if (arguments.length === 2 && typeof arguments[0] === 'string') {
      url = arguments[0]
      data = arguments[1]
    }

    return request.send({
      url,
      data,
      header,
      method,
      dataType,
      responseType
    })
  }
})

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
request.send = (options) => {
  return wx.$request(options)
}

export default request