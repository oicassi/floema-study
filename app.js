import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

app.get('/collections', (req, res) => {
  res.render('pages/collection')
})

app.get('/detail/:id', (req, res) => {
  res.render('pages/detail')
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
