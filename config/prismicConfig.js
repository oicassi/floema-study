import dotenv from 'dotenv'
import fetch from 'node-fetch'
import * as prismic from '@prismicio/client'
dotenv.config()

const repoName = process.env.PRISMIC_REPO
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

const routes = [
  {
    type: 'page',
    path: '/about'
  }
]

export const client = prismic.createClient(repoName, {
  fetch,
  accessToken,
  routes
})
