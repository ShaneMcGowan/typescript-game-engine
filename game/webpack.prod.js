const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.base');

const WEBPACK_CONFIG_BASE_PRODUCTION = (corePath) => {
  const metadata = {
    title: 'Sample Game',
    description: 'Sample Game built in TypeScript',
  }

  return {
    ...config.WEBPACK_CONFIG_BASE(corePath, metadata),
    mode: 'production'
  }
};

module.exports = { WEBPACK_CONFIG_BASE_PRODUCTION }
