/* eslint strict:0 */
'use strict';

const fs = require('fs');
const path = require('path');
const jsTokens = require('js-tokens');

const mkdirp = require('mkdirp');

function get(file, basedir) {
  /* eslint no-param-reassign:0, prefer-template:0 */
  const ext = path.extname(file);
  let libfile = basedir + file.slice(basedir.length).replace('/src/', '/lib/');
  // support .ts and .tsx, .ts,.tsx => .js
  if (ext === '.ts' || ext === '.tsx') {
    return libfile.replace(/.tsx?$/, '.js')
  }
  if (ext === '' || (ext !== '.js' && ext !== '.json')) {
    libfile = libfile + '.js';
  }
  return libfile;
}

function replacement(resourcePath, content, options) {
  if (content.indexOf('__webpack_public_path__') === -1) {
    return content;
  }
  jsTokens.lastIndex = 0;
  const parts = content.match(jsTokens);
  const webpackConfig = path.relative(
    path.dirname(resourcePath),
    path.join(options.context, 'webpack.config')
  );
  const publicPath = 'require(' + JSON.stringify(webpackConfig) + ')[0].output.publicPath';
  const out = parts.map(val => (val === '__webpack_public_path__' ? publicPath : val)).join('');
  return out;
}

module.exports = function libify(content) {
  /* eslint consistent-return:0 */
  this.cacheable();
  const callback = this.async();
  const basedir = this.options.context;
  let filepath;

  if (!callback) {
    if (this.resourcePath.split(path.sep).indexOf('node_modules') !== -1) {
      return content;
    }

    filepath = get(this.resourcePath, basedir);

    if (filepath === this.resourcePath || filepath === this.resourcePath + '.js') {
      return content;
    }

    mkdirp.sync(path.dirname(filepath));
    fs.writeFileSync(filepath, replacement(this.resourcePath, content, this.options));
    return content;
  }

  // async mode
  if (this.resourcePath.split(path.sep).indexOf('node_modules') !== -1) {
    process.nextTick(() => callback(null, content));
    return;
  }

  filepath = get(this.resourcePath, basedir);

  if (filepath === this.resourcePath || filepath === this.resourcePath + '.js') {
    process.nextTick(() => callback(null, content));
    return;
  }

  mkdirp(path.dirname(filepath), (err) => {
    if (err) {
      callback(err);
      return;
    }
    content = replacement(this.resourcePath, content, this.options);
    fs.writeFile(filepath, content, (fserr) => callback(fserr, content));
  });

  return;
};
