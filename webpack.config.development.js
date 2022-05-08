import path from 'path'
import { merge } from 'webpack-merge'
import config from './webpack.config.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    devMiddleware: {
      writeToDisk: true
    }
  },
  output: {
    path: path.resolve(__dirname, 'public')
  }
})
