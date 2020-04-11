class Router {
  constructor() {
    this.routes = {}
  }

  route(method, url, cb) {
    this.routes[method] = (this.routes[method] || []).push({
      regExp: new RegExp(`^${url}$`, 'i'),
      cb,
    })
  }

  handle(method, url) {
    let route = (this.routes[method] || []).find(route =>
      route.regExp.test(url),
    )
    if (route) {
      route.cb()
    } else {
    }
  }
}

exports.Router = Router
