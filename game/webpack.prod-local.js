const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.prod');

const CORE_PATH = '../core';

module.exports = () => {
  return config.WEBPACK_CONFIG_BASE_PRODUCTION(CORE_PATH);
};
