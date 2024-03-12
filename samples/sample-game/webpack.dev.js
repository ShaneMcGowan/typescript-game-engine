const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => {
  return {
    entry: './index.ts',
    devtool: 'inline-source-map',
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
        '@sample-game': path.resolve(__dirname, './'),
      },
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: '../../core/engine/index.html',
        filename: './index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: '../../core/engine/index.css', to: 'assets/index.css', },
          { from: './assets', to: 'assets', }
        ],
      })
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../../dist/sample-game/'),
    },
    mode: 'development',
  };
};
