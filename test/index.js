const fs = require('fs');
const { join } = require('path')
const webpack = require('webpack');
const tape = require('tape');
const rimraf = require('rimraf');

const libify = require.resolve('../');

rimraf.sync(`${__dirname}/fixtures/lib/`);

tape('webpack libify', (t) => {
  webpack({
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
  })
  .run((err, stats) => {
    if (err) {
      t.ifError(err);
    }
    const jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      t.fail(jsonStats.errors);
    }
    if (jsonStats.warnings.length > 0) {
      console.info(jsonStats.warnings);
    }
    t.ok(fs.statSync(`${__dirname}/fixtures/lib/libify/foo.js`).isFile());
    t.end();
  });
});
