import consts from './consts.js'
import storage from '../lib/storage.js'
import regeneratorRuntime from '../lib/regenerator/runtime-module.js'

const helper = {}

helper.setAccessToken = async (token, duration) => {
  return await storage.set(consts.ACCESS_TOKEN, token, duration)
}

helper.getAccessToken = async _ => {
  return await storage.get(consts.ACCESS_TOKEN)
}

helper.clearAccessToken = async _ => {
  return await storage.remove(consts.ACCESS_TOKEN)
}

helper.setMobile = async (mobile, duration) => {
  return await storage.set(consts.MOBILE, mobile, duration)
}

helper.getMobile = async _ => {
  return await storage.get(consts.MOBILE)
}

export default helper
