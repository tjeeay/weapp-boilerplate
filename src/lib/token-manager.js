import request from './request.js'
import helper from '../utils/storage-helper.js'
import regeneratorRuntime from './regenerator/runtime-module.js'

const manager = {}

let _fetching = false
let _waitingQequests = []

manager.isFetchingToken = _ => {
  return _fetching
}

manager.setAccessToken = helper.setAccessToken
manager.clearAccessToken = helper.clearAccessToken

manager.getAccessToken = async _ => {
  const token = await helper.getAccessToken()
  if (token) {
    return token
  }

  if (_fetching) {
    return !_fetching
  }

  _fetching = true

  const { code } = await wx.$login()

  try {
    const { data } = await request.send({
      method: 'POST',
      url: `/user/login?code=${code}`
    })

    _fetching = false
    await Promise.all([
      manager.setAccessToken(data.token),
      helper.setMobile(data.mobile)
    ])

    // process waiting requests
    while (_waitingQequests.length) {
      const { options, resolve } = _waitingQequests.shift()
      request[options.method](options).then(res => resolve(res))
    }

    return data.token
  } catch (reason) {
    console.warn(`failed to get token: ${reason}`)
    _fetching = false
  }
}

manager.pushWaitingRequest = (options) => {
  return new Promise(resolve => {
    _waitingQequests.push({
      options,
      resolve
    })
  })
}

export default manager
