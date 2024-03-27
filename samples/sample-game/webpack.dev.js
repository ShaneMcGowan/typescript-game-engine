const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: { allowTsInNodeModules: true }
      }
    ],
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './node_modules/typescript-game-engine/src/'),
      '@sample-game': path.resolve(__dirname, './'),
    },
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './node_modules/typescript-game-engine/src/engine/index.html',
      filename: './index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './node_modules/typescript-game-engine/src/engine/index.css', to: 'assets/index.css', },
        { from: './assets', to: 'assets', }
      ],
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist/'),
  },
  mode: 'development',
};
