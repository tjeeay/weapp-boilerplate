const storage = {}

/**
 * set storage
 * @param {String} key 
 * @param {*} val 
 * @param {Number} duration 单位：min
 */
storage.set = (key, value, duration) => {
  let expires
  if (duration && typeof duration === 'number') {
    expires = Date.now() + duration * 60 * 1000
  }

  return wx.$setStorage({
    key,
    data: {
      value,
      expires
    }
  })
}

storage.get = (key) => {
  return wx.$getStorage({ key })
    .then(res => {
      const { value, expires } = res.data
      if (expires && Date.now() >= Number(expires)) {
        return null
      }
      return value
    }, ({ errMsg }) => {
      if (errMsg === 'getStorage:fail data not found') {
        return null
      }
      throw new Error(errMsg)
    })
}

storage.remove = (key) => {
  return wx.$removeStorage({ key })
}

storage.clear = () => {
  return wx.$clearStorage()
}

storage.info = () => {
  return wx.$getStorageInfo()
}

export default storage
