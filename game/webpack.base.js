const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const WEBPACK_CONFIG_BASE = (corePath, clientDirectory, metadata) => {
  return {
    entry: './index.ts',
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
        '@core': path.resolve(__dirname, `${corePath}/src/`),
        '@game': path.resolve(__dirname, './'),
      },
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${corePath}/src/${clientDirectory}/index.html`,
        filename: './index.html',
        metadata: {
          ...metadata
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: `${corePath}/src/${clientDirectory}/index.css`, to: 'assets/index.css', },
          { from: './assets', to: 'assets', }
        ],
      })
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, './dist/'),
    },
    mode: 'development',
  }
};

module.exports = { WEBPACK_CONFIG_BASE }
