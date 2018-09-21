import request from '../lib/request.js'
import regeneratorRuntime from '../lib/regenerator/runtime-module'

export const login = async ({ mobile, verifyCode }) => {
  return request.post({
    url: '/user/login',
    data: {
      mobile,
      verifyCode
    }
  })
}
