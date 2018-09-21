import config from "../config/index.js";

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

util.trimStart = (str, char) => {
  if (str[0] === char) {
    return util.trimStart(str.substr(1))
  }
  return str
}

util.trimEnd = (str, char) => {
  if (str[str.length - 1] === char) {
    return util.trimEnd(str.substr(0, str.length - 1))
  }
  return str
}

util.stringifyQuery = query => {
  return Object.keys(query).reduce((arr, key) => {
    arr.push(`${key}=${query[key]}`)
    return arr
  }, []).join('&')
}

export default util
