
const util = {}

util.isObject = (value) => {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}

util.isFunction = (fn) => {
  const tag = Object.prototype.toString.call(fn)
  return typeof fn === 'function'
    && (
      tag == '[object Function]'
      || tag == '[object AsyncFunction]'
      || tag == '[object GeneratorFunction]'
      || tag == '[object Proxy]'
    )
}

util.parseUrl = (url) => {
  const [ route, search ] = url.split('?')

  let query = {}
  if (search) {
    query = search.split('&').reduce((obj, pair) => {
      const [key, val] = pair.split('=')
      obj[key] = val
      return obj
    }, {})
  }

  return {
    route,
    query
  }
}

util.normalizeUrl = (url) => {
  if (!url) {
    return url
  }

  if (url[0] === '/') {
    url = url.substr(1)
  }

  if (!/^pages/.test(url)) {
    url = `pages/${url}`
  }

  url = `/${url}`

  return url
}

export default util
