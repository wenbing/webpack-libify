const { join } = require('path')
const libify = require.resolve('../');

const get = (moduleName) => join(__dirname, `fixtures/src/${moduleName}`)
module.exports = {
  context: __dirname,
  entry: './fixtures/src/libify/foo.js',
  output: {
    filename: 'foo.js',
    path: `${__dirname}/fixtures/dist/libify`,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
    postLoaders: [
      {
        loader: libify,
      },
    ],
  },
  resolve: {
    alias: {
      common: get('common'),
      plugin: get('plugin'),
      com: get('com'),
    },
  },
}
