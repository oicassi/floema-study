import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import * as prismicHelpers from '@prismicio/helpers'
import * as prismic from '@prismicio/client'
import { prismicClient } from './config/prismicConfig.js'

const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use((req, res, next) => {
  res.locals.ctx = {
    prismicHelpers,
  }
  next()
})

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', async (req, res) => {
  try {
    const {
      results: [meta, about],
    } = await prismicClient.get({
      predicates: prismic.predicate.any('document.type', ['meta', 'about']),
    })

    res.render('pages/about', {
      meta,
      about,
    })
  } catch (error) {
    console.log('error navigating to about', error)
  }
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
