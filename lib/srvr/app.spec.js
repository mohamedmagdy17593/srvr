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
