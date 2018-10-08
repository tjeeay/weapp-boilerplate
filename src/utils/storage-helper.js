import { storageKeys } from './consts.js'
import storage from '../lib/storage.js'
import regeneratorRuntime from '../lib/regenerator/runtime-module.js'

const helper = {}

helper.setAccessToken = async (token, duration) => {
  return await storage.set(storageKeys.ACCESS_TOKEN, token, duration)
}

helper.getAccessToken = async _ => {
  return await storage.get(storageKeys.ACCESS_TOKEN)
}

helper.clearAccessToken = async _ => {
  return await storage.remove(storageKeys.ACCESS_TOKEN)
}

helper.setMobile = async (mobile, duration) => {
  return await storage.set(storageKeys.MOBILE, mobile, duration)
}

helper.getMobile = async _ => {
  return await storage.get(storageKeys.MOBILE)
}

export default helper
