const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.base');

const CLIENT_DIRECTORY = 'editor';

const WEBPACK_CONFIG_BASE_DEVELOPMENT = (corePath) => {
  const metadata = {}

  return {
    ...config.WEBPACK_CONFIG_BASE(corePath, CLIENT_DIRECTORY, metadata),
    mode: 'development'
  }
};

module.exports = { WEBPACK_CONFIG_BASE_DEVELOPMENT }
