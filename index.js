/* eslint strict:0 */
'use strict';

const fs = require('fs');
const path = require('path');

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

module.exports = function libify(content) {
  /* eslint consistent-return:0 */
  this.cacheable();
  const callback = this.async();
  let filepath;

  if (!callback) {
    if (this.resourcePath.split(path.sep).indexOf('node_modules')) {
      return content;
    }

    filepath = get(this.resourcePath);
    if (filepath === this.resourcePath || filepath === this.resourcePath + '.js') {
      return content;
    }

    mkdirp.sync(path.dirname(filepath));
    fs.writeFileSync(filepath, content);
    return content;
  }

  // async mode
  if (this.resourcePath.split(path.sep).indexOf('node_modules') !== -1) {
    process.nextTick(() => callback(null, content));
    return;
  }

  filepath = get(this.resourcePath);
  if (filepath === this.resourcePath) {
    process.nextTick(() => callback(null, content));
    return;
  }

  mkdirp(path.dirname(filepath), (err) => {
    if (err) {
      callback(err);
      return;
    }
    fs.writeFile(filepath, content, (fserr) => callback(fserr, content));
  });

  return;
};
