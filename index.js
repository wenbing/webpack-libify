/* eslint strict:0 */
'use strict';

const fs = require('fs');
const path = require('path');
const jsTokens = require('js-tokens');

const mkdirp = require('mkdirp');

function get(file) {
  /* eslint no-param-reassign:0, prefer-template:0 */
  const ext = path.extname(file);
  file = file.replace('/src/', '/lib/');
  if (ext === '' || (ext !== '.js' && ext !== '.json')) {
    file = file + '.js';
  }
  return file;
}

function replacement(resourcePath, content, options) {
  if (content.indexOf('__webpack_public_path__') === -1) {
    return content;
  }
  jsTokens.lastIndex = 0;
  const parts = content.match(jsTokens);
  const out = [];
  const webpackConfig = path.relative(
    path.dirname(resourcePath),
    path.join(options.context, 'webpack.config')
  );
  const publicPath = 'require(' + JSON.stringify(webpackConfig) + ')[0].output.publicPath';
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '__webpack_public_path__') {
      out.push(publicPath);
    } else {
      out.push(parts[i]);
    }
  }
  return out.join('');
}

module.exports = function libify(content) {
  /* eslint consistent-return:0 */
  this.cacheable();
  const callback = this.async();
  let filepath;

  if (!callback) {
    if (this.resourcePath.split(path.sep).indexOf('node_modules') !== -1) {
      return content;
    }

    filepath = get(this.resourcePath);

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

  filepath = get(this.resourcePath);

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
