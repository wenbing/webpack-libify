webpack-libify
===

Show Your Webpack Loader Transformed Source!


## 约定

- 使用到的 src 源码需要转化到 lib 中
- src 中 require 的 id 不需要进行改变: abc.css -> abc.css.js, abc.jsx -> abc.jsx.js
- 所有 lib 中的模块 node 可运行