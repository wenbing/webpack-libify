const { join } = require('path')
const libify = require.resolve('../');

const get = (moduleName) => join(__dirname, `fixtures/src/${moduleName}`);

const alias = [
  'common',
  'plugin',
  'com',
  'src',
];

const aliasPrefix = '@@';

const getAlias = () => alias.reduce((acc, current) => {
  acc[aliasPrefix + current] = get(current);
  return acc;
}, {});

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
    alias: getAlias(),
  },
}
