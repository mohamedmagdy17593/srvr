const srvr = require('./lib/srvr')

const app = srvr()

app.get('/', (req, res) => {
  res.send('hello root')
})

app.listen(3000)
