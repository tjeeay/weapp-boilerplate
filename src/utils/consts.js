
const PREFIX = 'D1M_'

export const storageKeys = {
  ACCESS_TOKEN: `${PREFIX}_token`,
  OPEN_ID: `${PREFIX}_openId`,
  MOBILE: `${PREFIX}_mobile`
}

export const authScopes = {
  userInfo: 'scope.userInfo',
  userLocation: 'scope.userLocation',
  address: 'scope.address',
  invoiceTitle: 'scope.invoiceTitle',
  werun: 'scope.werun',
  record: 'scope.record',
  writePhotosAlbum: 'scope.writePhotosAlbum',
  camera: 'scope.camera'
}
