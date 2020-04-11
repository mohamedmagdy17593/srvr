const App = require('./app')

test('handle GET', () => {
  let app = new App()

  let cb = jest.fn()
  app.get('/', cb)

  let req = { method: 'GET', url: '/' }
  let res = {}
  app.handle(req, res)

  expect(cb).toBeCalledTimes(1)
  expect(cb).toBeCalledWith(req, res)
})

test('res has send method', () => {
  let app = new App()

  let cb = jest.fn()
  app.get('/', cb)

  let req = { method: 'GET', url: '/' }
  let res = {}
  app.handle(req, res)

  let [, appRes] = cb.mock.calls[0]
  expect(appRes.send).toBeInstanceOf(Function)
})

test('errors is caught', () => {
  let app = new App()

  let cb = jest.fn(() => {
    throw Error('Ouch')
  })
  app.get('/', cb)

  let req = { method: 'GET', url: '/' }
  let res = { send: jest.fn() }
  app.handle(req, res)

  expect(res.send).toBeCalledWith(500, 'Ouch')
})

describe('Views', () => {
  let app, viewsPath

  beforeEach(() => {
    app = new App()

    viewsPath = __dirname + '/views'
    app.set('views', viewsPath)
    app.set('view engine', 'pug')
  })

  test('has settings', () => {
    expect(app.settings).toHaveProperty('views', viewsPath)
    expect(app.settings).toHaveProperty('view engine', 'pug')
  })

  test('render html', () => {
    let cb = jest.fn()
    app.render('index', { value: 'hi' }, cb)

    expect(cb).toHaveBeenCalledWith(`<h1>hi</h1>`)
  })

  test('response render', () => {
    app.get('/', (_req, res) => {
      res.render('index', { value: 'hi' })
    })

    let req = { method: 'GET', url: '/' }
    let res = { send: jest.fn() }
    app.handle(req, res)

    expect(res.send).toBeCalledWith(`<h1>hi</h1>`)
  })
})

test('Middlewares', () => {
  let app = new App()

  let middleware = jest.fn()
  app.use(middleware)

  app.get('/', () => {})

  let req = { method: 'GET', url: '/' }
  let res = {}
  app.handle(req, res)

  expect(middleware).toBeCalledWith(req, res, expect.anything())
})
