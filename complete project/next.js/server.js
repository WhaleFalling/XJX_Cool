const express = require('express')
const next = require('next')
var path = require('path');
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const testData=require("./src/testData"); 

app.prepare()
.then(() => {
  const server = express()
  // 注册静态目录
  server.use(express.static(path.join(__dirname, 'public')));

  server.get('/a', (req, res) => {
    return app.render(req, res, '/b', req.query)
  })

  server.get('/b', (req, res) => {
    return app.render(req, res, '/a', req.query)
  })
  server.use("/list",testData);

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
