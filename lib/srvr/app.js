const http = require('http')
const Router = require('./router')
const Response = require('./response')

class App {
  constructor() {
    this.router = new Router()
  }

  get(url, cb) {
    this.router.route('GET', url, cb)
  }
  post(url, cb) {
    this.router.route('POST', url, cb)
  }
  put(url, cb) {
    this.router.route('PUT', url, cb)
  }
  delete(url, cb) {
    this.router.route('DELETE', url, cb)
  }

  handle(req, res) {
    res.__proto__ = Response.prototype
    try {
      this.router.handle(req, res)
    } catch (err) {
      console.error(err)
      let { status = 500 } = err
      res.send(status, err.message)
    }
  }

  listen(port) {
    let server = http.createServer((req, res) => {
      this.handle(req, res)
    })
    server.listen(port)
    console.log(`[app] run on port ${port}`)
  }
}

module.exports = App
