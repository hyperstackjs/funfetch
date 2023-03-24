const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.all('/', (req, res) => {
  res.json({
    message: 'OK',
  })
})

app.get('/400-with-message', (req, res) => {
  res.status(400).json({ message: 'Oops!' })
})

app.post('/post-content', (req, res) => {
  res.json({ data: req.body, headers: req.headers })
})

app.get('/querystring', (req, res) => {
  res.json(req.query)
})

app.get('/delay', (req, res) => {
  setTimeout(() => res.json(req.query), req.query.delay)
})

app.delete('/querystring', (req, res) => {
  res.json(req.query)
})

app.get('/404', (req, res) => {
  res.sendStatus(404)
})

app.get('/404-with-valid-json', (req, res) => {
  res.set('Content-Type', 'application/json').status(400).send({ foo: 'baz' })
})

app.get('/404-with-invalid-json', (req, res) => {
  res.set('Content-Type', 'application/json').status(404).send('foobaz')
})

app.get('/404-with-stripe-error', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Some error happened',
      stack: {},
      code: 23,
      param: 'hello_world',
    },
  })
})

app.post('/users/:userId', (req, res) => {
  res.json({ body: req.body, params: req.params })
})
app.get('/users/:userId', (req, res) => {
  res.send({ userId: req.params.userId })
})
module.exports = app
