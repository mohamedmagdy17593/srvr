const http = require('http')
const path = require('path')
const cons = require('consolidate')
const Router = require('./router')
const Response = require('./response')

class App {
  constructor() {
    this.router = new Router()
    this.settings = {}
    this.middlewares = []
  }

  set(key, value) {
    this.settings[key] = value
  }

  use(cb) {
    this.middlewares.push(cb)
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
    res.app = this

    let callStack = [...this.middlewares, this.router.handle.bind(this.router)]
    let i = 0

    function next(err) {
      try {
        if (err) {
          throw err
        }
        callStack[i++](req, res, next)
      } catch (err) {
        console.error(err)
        let { status = 500 } = err
        res.send(status, err.message)
      }
    }

    next()
  }

  render(template, locals, cb) {
    let viewEngine = this.settings['view engine']
    let viewPath = path.join(
      this.settings['views'],
      `${template}.${viewEngine}`,
    )
    cons[viewEngine](viewPath, locals, (err, html) => {
      if (err) {
        throw err
      }
      cb(html)
    })
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
