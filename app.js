import express from 'express'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import logger from 'morgan'
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
  res.locals.indexToText = indexToText
  res.locals.Link = handleLinkResolver
  next()
})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
  try {
    const promises = [getDefaultData(), prismicClient.getSingle('home'), prismicClient.getAllByType('collection')]
    const [defaultData, home, collections] = await Promise.all(promises)

    res.render('pages/home', {
      ...defaultData,
      home,
      collections,
    })
  } catch (error) {
    console.log('error fetching data for home page', error)
  }
})

app.get('/about', async (req, res) => {
  // Example using predicates (using predicate it's possible to have pagination)
  // prismicClient.get({ predicates: prismic.predicate.at('document.type', 'collection') }),
  try {
    const defaultData = await getDefaultData()
    const {
      results: [about],
    } = await prismicClient.get({
      predicates: prismic.predicate.any('document.type', ['about']),
    })

    res.render('pages/about', {
      ...defaultData,
      about,
    })
  } catch (error) {
    console.log('error fetching data for about page', error)
  }
})

app.get('/collections', async (req, res) => {
  try {
    const promises = [
      getDefaultData(),
      prismicClient.getSingle('home'),
      prismicClient.getAllByType('collection', { fetchLinks: ['product.image'] }),
    ]
    const [defaultData, home, collections] = await Promise.all(promises)
    res.render('pages/collections', {
      ...defaultData,
      home,
      collections,
    })
  } catch (error) {
    console.log('error fetching data for collection page', error)
  }
})

app.get('/detail/:uid', async (req, res) => {
  const uid = req.params.uid

  try {
    const defaultData = await getDefaultData()
    const product = await prismicClient.getByUID('product', uid, { fetchLinks: 'collection.full_title' })
    res.render('pages/detail', {
      ...defaultData,
      product,
    })
  } catch (error) {
    console.log('error fetching data for detail page', error)
  }
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

// Helpers
const getDefaultData = async () => {
  const promises = [
    prismicClient.getSingle('meta'),
    prismicClient.getSingle('preloader'),
    prismicClient.getSingle('navigation'),
  ]

  const [meta, preloader, navigation] = await Promise.all(promises)
  return { meta, preloader, navigation }
}

const indexToText = (index) => {
  const textIndexes = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
  return textIndexes[index]
}

const handleLinkResolver = (doc) => {
  if (doc.type === 'product') return `/detail/${doc.uid}`
  if (doc.type === 'about') return '/about'
  if (doc.type === 'collections') return '/collections'

  return '/'
}
