const env = `${process.env.NODE_ENV}`
const config = require(`./${env}.js`).default

config.isProduction = () => env === 'production'

config.QQMapKey = 'MSXBZ-HE7K2-XBHUD-CMMD4-GBEVF-ODBT6'

export default config
