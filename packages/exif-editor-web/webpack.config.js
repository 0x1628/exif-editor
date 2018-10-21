const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const IS_DEV = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: IS_DEV ? 'development' : 'production',
  entry: {
    app: [
      './app/index.ts',
    ],
    sw: './sw/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, '..'),
    },
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      excludeChunks: ['sw'],
      template: 'index.html',
    }),
  ],
}