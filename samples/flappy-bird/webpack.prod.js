const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      }
    ],
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../../core/'),
      '@flappy-bird': path.resolve(__dirname, './'),
    },
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../../core/src/client/index.html',
      filename: './index.html',
      metadata: {
        title: 'Flappy Bird',
        description: 'Flappy Bird built in TypeScript',
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: '../../core/src/client/index.css', to: 'assets/index.css', },
        { from: './assets', to: 'assets', }
      ],
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist/flappy-bird/'),
  },
  mode: 'production',
};
