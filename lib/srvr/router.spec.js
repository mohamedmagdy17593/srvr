const { Router } = require('./router')

test('store routes', () => {
  let router = new Router()

  let cb = () => {}
  router.route('GET', '/', cb)
  router.route('POST', '/url', cb)

  expect(router.routes).toEqual({
    GET: [{ regExp: /^\/$/i, cb: cb }],
    POST: [{ regExp: /^\/url$/i, cb: cb }],
  })
})

test('handle GET', () => {
  let router = new Router()

  let cb = jest.fn()
  router.route('GET', '/', cb)

  let req = { method: 'GET', url: '/' }
  let res = {}
  router.handle(req, res)

  expect(cb).toBeCalledTimes(1)
  expect(cb).toBeCalledWith(req, res)
})

test('handle POST', () => {
  let router = new Router()

  let getCb = jest.fn()
  let postCb = jest.fn()
  router.route('GET', '/', getCb)
  router.route('POST', '/', postCb)

  let req = { method: 'POST', url: '/' }
  let res = {}
  router.handle(req, res)

  expect(postCb).toBeCalledTimes(1)
  expect(postCb).toBeCalledWith(req, res)

  expect(getCb).not.toBeCalled()
})

test('handle route that is not exist', () => {
  let router = new Router()

  let req = { method: 'GET', url: '/' }
  let res = {}
  expect(() => router.handle(req, res)).toThrow(/NOT FOUND/i)
})
