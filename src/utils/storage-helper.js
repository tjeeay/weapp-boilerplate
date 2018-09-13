import storage from '../lib/storage.js'

const PREFIX = 'D1M_'
const KEYS = {
  ACCESS_TOKEN: `${PREFIX}_token`
}

const helper = {}

helper.setAccessToken = (token, duration) => {
  return storage.set(KEYS.ACCESS_TOKEN, token, duration)
}

helper.getAccessToken = _ => {
  return storage.get(KEYS.ACCESS_TOKEN)
}

export default helper
