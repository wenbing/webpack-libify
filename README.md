webpack-libify
===

Show Your Webpack Loader Transformed Source!


## 约定

- 使用到的 src 源码需要转化到 lib 中
- src 中 require 的 id 不需要进行改变: abc.css -> abc.css.js, abc.jsx -> abc.jsx.js
- 所有 lib 中的模块 node 可运行

## 用法

```js
// in your webpack.config.js
const libify = require.resolve('webpack-libify');

module.postLoaders: [ { loader: libify } ]
```

## __webpack_public_path__

基于 `require('js-tokens')` 技术，
使用类 `require("../webpack.config")[0].output.publicPath` 替换掉 __webpack_public_path__


