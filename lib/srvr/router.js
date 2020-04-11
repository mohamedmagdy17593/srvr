class Router {
  constructor() {
    this.routes = {}
  }

  route(method, url, cb) {
    ;(this.routes[method] || (this.routes[method] = [])).push({
      regExp: new RegExp(`^${url}$`, 'i'),
      cb,
    })
  }

  handle(req, res) {
    let { method, url } = req

    let route = (this.routes[method] || []).find(route =>
      route.regExp.test(url),
    )

    if (route) {
      route.cb(req, res)
    } else {
      let err = new Error(`[${method}]: ${url} (NOT FOUND)`)
      err.status = 404
      throw err
    }
  }
}

exports.Router = Router
