const srvr = require('./lib/srvr')
const path = require('path')

const app = srvr()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

function logger(req, res, next) {
  console.log(req.url)
  next()
}
app.use(logger)

app.get('/', (_req, res) => {
  res.send('hello root')
})

app.get('/view', (_req, res) => {
  res.render('index', { name: 'Mohamed' })
})

app.listen(1234)
