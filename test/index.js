const fs = require('fs');
const { join } = require('path')
const webpack = require('webpack');
const tape = require('tape');
const rimraf = require('rimraf');

const libify = require.resolve('../');

rimraf.sync(`${__dirname}/fixtures/lib/`);
const config = require('./webpack.config')
tape('webpack libify', (t) => {
  webpack(config)
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
