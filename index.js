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
  const basedir = this.options.context;
  let filepath;
  const alias = (this.options.resolve || {}).alias;
  const getReplacedContent = (content) => {
    if (!alias || !Object.keys(alias).length) return content;
    const getAliasPath = (dirname) => alias[dirname];
    const getMatchRe = (aliasName) => new RegExp('require\\((["\'])' + aliasName + '[\\s\\S]*?\\1\\)', 'g');
    const allAliasRe = getMatchRe('(' + Object.keys(alias).join('|') +')');
    const replaceSrcToLib = (absolutePath) => {
      const relativePathAry = absolutePath.slice(basedir.length).split(path.sep);
      const srcIndex = relativePathAry.indexOf('src');
      relativePathAry[srcIndex] = 'lib';
      return path.join(basedir, relativePathAry.join(path.sep));
    };
    return content.replace(allAliasRe, (matched, $, aliasName) => {
      const FullLibPath = replaceSrcToLib(getAliasPath(aliasName));
      return matched.replace(aliasName, FullLibPath);
    });
  }
  if (!callback) {
    if (this.resourcePath.split(path.sep).indexOf('node_modules') !== -1) {
      return content;
    }

    filepath = get(this.resourcePath, basedir);

    if (filepath === this.resourcePath || filepath === this.resourcePath + '.js') {
      return content;
    }

    mkdirp.sync(path.dirname(filepath));
    fs.writeFileSync(filepath, replacement(this.resourcePath, getReplacedContent(content), this.options));
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
    fs.writeFile(filepath, getReplacedContent(content), (fserr) => callback(fserr, content));
  });

  return;
};
