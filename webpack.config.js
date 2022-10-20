import path from 'path';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { fileURLToPath } from 'url';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirApp = path.join(__dirname, 'app');
const dirStyles = path.join(__dirname, 'styles');
const dirNode = 'node_modules';

const config = {
  entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],

  resolve: {
    modules: [dirApp, dirNode],
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: '',
          noErrorOnMissing: true,
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },

      {
        test: /\.(jpe?g|png|gif|svg|fnt|webp)$/,
        loader: 'file-loader',
        options: {
          name(file) {
            return '[hash].[ext]';
          },
        },
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.(gsls|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 7 }],
            ],
          },
        },
      }),
      new TerserPlugin(),
    ],
  },
};

export default config;
