const http = require('http')

class Response extends http.ServerResponse {
  send(...args) {
    let [body, status = 200] = args.reverse()

    this.writeHead(status, {
      'Content-Length': body.length,
      'Content-Type': 'text/html',
    })

    this.end(body)
  }

  render(template, locals) {
    this.app.render(template, locals, html => {
      this.send(html)
    })
  }
}

module.exports = Response
