const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV !== 'production'

const buildVersion = `${Date.now()}`

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    app: [
      './app/index.tsx',
    ],
    sw: './sw/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          projectReferences: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, '..'),
    },
  },
  devtool: isDev ? 'inline-source-map' : false,
  plugins: [
    new HtmlWebpackPlugin({
      excludeChunks: ['sw'],
      template: 'index.html',
    }),
    isDev ? new webpack.HotModuleReplacementPlugin() : null,
    new webpack.DefinePlugin({
      BUILD_VERSION: isDev ? 1 : buildVersion,
      PATH: isDev ? '"/"' : '"/exif-editor/"',
    }),
  ].filter(Boolean),
  devServer: {
    hotOnly: true,
    host: '0.0.0.0',
  },
}
