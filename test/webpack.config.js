const { join } = require('path')
const libify = require.resolve('../');

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
      common: join(__dirname, 'fixtures/src/common')
    },
  },
}
