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
    console.log('error fetching data for about page', error)
  }
})

app.get('/collections', async (req, res) => {
  // Example using predicates (using predicate it's possible to have pagination)
  // prismicClient.get({ predicates: prismic.predicate.at('document.type', 'collection') }),
  try {
    const promises = [
      prismicClient.getSingle('meta'),
      prismicClient.getAllByType('collection', { fetchLinks: ['product.title'] }),
    ]
    const [meta, collections] = await Promise.all(promises)
    console.log('meta:', meta)
    console.log('--------')
    console.log('collections:', collections)
    console.log('--------')
    console.log('products:', collections[3].data.products[0].products_product.data)
    res.render('pages/collections', {
      meta,
      collections,
    })
  } catch (error) {
    console.log('error fetching data for collection page', error)
  }
})

app.get('/detail/:uid', async (req, res) => {
  const uid = req.params.uid

  try {
    const promises = [
      prismicClient.getSingle('meta'),
      prismicClient.getByUID('product', uid, { fetchLinks: 'collection.title' }),
    ]
    const [meta, product] = await Promise.all(promises)

    res.render('pages/detail', {
      meta,
      product,
    })
  } catch (error) {
    console.log('error fetching data for detail page', error)
  }
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
