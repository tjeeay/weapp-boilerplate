export default class Logger {
  constructor (options) {
    
  }

  trace (msg) {
    this.log('trace', msg)
  }

  debug (msg) {
    this.log('debug', msg)
  }

  info (msg) {
    this.log('info', msg)
  }

  warn (msg) {
    this.log('warn', msg)
  }

  error (msg) {
    this.log('error', msg)
  }

  log (level, msg) {

  }

  clear () {
    
  }
}
