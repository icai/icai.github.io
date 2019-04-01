---
layout: post
title: "javascript混淆与解混淆的那些事儿"
date: 2019-04-01 13:48:43 +0800
comments: true
categories: javascript
tags: [javascript,confusion]
statement: true
keywords: confusion, crack
---


像软件加密与解密一样，javascript的混淆与解混淆同属于同一个范畴。道高一尺，魔高一丈。没有永恒的黑，也没有永恒的白。一切都是资本市场驱动行为，现在都流行你能为人解决什么问题，这个概念。那么市场究竟能容纳多少个能解决这种问题的利益者。JS没有秘密。


其实本人不赞成javascript进行hash混淆处理，一拖慢运行时速度，二体积大。JS代码前端可获取，天生赋予“开源”属性，都可以在chrome devTools下查看。JS非压缩性混淆完全违法前端优化准则。

<!-- more -->

目前网络上可以搜索的JS混淆工具不外乎以下几种：

[eval混淆][3]，也是最早JS出现的混淆加密，据说第一天就被破解，修改一下代码，alert一下就可以破解了。这种方法从出生的那天就失去了意义。其实JS加密（混淆）是相对于可读性而言的，其实真正有意义的就是压缩型混淆uglify这一类，即可减少体重，也可减少可读性。

但是，也不能排除部分商业源代码使用hash类型混淆源代码，比如 miniui 使用的[JSA加密][1], fundebug使用的[javascript-obfuscator][2]。

下面通过代码来说明 JSA加密 和 javascript-obfuscator 的区别：


要混淆的代码：

```js
function logG(message) {
  console.log('\x1b[32m%s\x1b[0m', message); 
}
function logR(message) {
  console.log('\x1b[41m%s\x1b[0m', message); 
}
logG('logR');
logR('logG');

```


通过[JSA加密][1]混淆后生成的代码

```
function o00($){console.log("\x1b[32m%s\x1b[0m",$)}function o01($){console.log("\x1b[41m%s\x1b[0m",$)}o00("logR");o01("logG")

```
然后再[beautifier][4]一下：

```js
function o00($) {
  console.log("\x1b[32m%s\x1b[0m", $)
}

function o01($) {
  console.log("\x1b[41m%s\x1b[0m", $)
}
o00("logR");
o01("logG")

```

可以发现，其实没有做什么什么修改，只是做了一些变量替换。想还原也比较简单的。这里就不拿它来做代表，也没有什么人用。



通过[javascript-obfuscator][2]混淆后生成的代码

```js
var _0xd6ac=['[41m%s[0m','logG','log'];(function(_0x203a66,_0x6dd4f4){var _0x3c5c81=function(_0x4f427c){while(--_0x4f427c){_0x203a66['push'](_0x203a66['shift']());}};_0x3c5c81(++_0x6dd4f4);}(_0xd6ac,0x6e));var _0x5b26=function(_0x2d8f05,_0x4b81bb){_0x2d8f05=_0x2d8f05-0x0;var _0x4d74cb=_0xd6ac[_0x2d8f05];return _0x4d74cb;};function logG(_0x4f1daa){console[_0x5b26('0x0')]('[32m%s[0m',_0x4f1daa);}function logR(_0x38b325){console[_0x5b26('0x0')](_0x5b26('0x1'),_0x38b325);}logG('logR');logR(_0x5b26('0x2'));

```

再[beautifier][4]一下：

```js
var _0xd6ac = ['[41m%s[0m', 'logG', 'log'];
(function(_0x203a66, _0x6dd4f4) {
  var _0x3c5c81 = function(_0x4f427c) {
    while (--_0x4f427c) {
      _0x203a66['push'](_0x203a66['shift']());
    }
  };
  _0x3c5c81(++_0x6dd4f4);
}(_0xd6ac, 0x6e));
var _0x5b26 = function(_0x2d8f05, _0x4b81bb) {
  _0x2d8f05 = _0x2d8f05 - 0x0;
  var _0x4d74cb = _0xd6ac[_0x2d8f05];
  return _0x4d74cb;
};

function logG(_0x4f1daa) {
  console[_0x5b26('0x0')]('[32m%s[0m', _0x4f1daa);
}

function logR(_0x38b325) {
  console[_0x5b26('0x0')](_0x5b26('0x1'), _0x38b325);
}
logG('logR');
logR(_0x5b26('0x2'));
```


这个复杂得多，但是分析一下你会发现，其实多了一个字典，所有方法变量，都有可能存在字典中，调用时先调用字典还原方法名变量再执行。
其实入口都是变量的规则。

字典函数：

```js
var _0xd6ac = ['[41m%s[0m', 'logG', 'log'];
(function(_0x203a66, _0x6dd4f4) {
  var _0x3c5c81 = function(_0x4f427c) {
    while (--_0x4f427c) {
      _0x203a66['push'](_0x203a66['shift']());
    }
  };
  _0x3c5c81(++_0x6dd4f4);
}(_0xd6ac, 0x6e));
var _0x5b26 = function(_0x2d8f05, _0x4b81bb) {
  _0x2d8f05 = _0x2d8f05 - 0x0;
  var _0x4d74cb = _0xd6ac[_0x2d8f05];
  return _0x4d74cb;
};

```

通过以上发现，我们可以把JS混淆归结为三类，分别是 eval类型，hash类型，压缩类型。而压缩类型，是目前前端性能优化的常用工具，以[uglify][5]为代表。


常用的前端压缩优化工具：

JavaScript:
* [babel-minify](https://github.com/babel/minify)
* [terser](https://github.com/terser-js/terser)
* [uglify-js](https://github.com/mishoo/UglifyJS2)
* [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony)
* [Google Closure Compiler](https://www.npmjs.com/package/google-closure-compiler)
* [YUI Compressor](http://yui.github.io/yuicompressor/)

CSS:
* [PostCSS](https://github.com/postcss/postcss)
* [clean-css](https://github.com/jakubpawlowicz/clean-css)
* [CSSO](https://github.com/css/csso)
* [YUI Compressor](http://yui.github.io/yuicompressor/)

HTML:
* [html-minifier](https://www.npmjs.com/package/html-minifier)

从工具流(workflow) 来看，不论是 webpack 还是 gulp ，目前javascript最流行工具还是uglify。


相应的解混淆工具：

- eval对应的解混淆工具, 随便百度都可以搜索到，如[jspacker][3]

- JSA对应的解混淆工具[unjsa][6]

- [javascript-obfuscator][2]对应的解混淆工具[crack.js][7]

- 压缩类型uglify对应的工具[UnuglifyJS][8]，在线版[jsnice][9]

解混淆策略其实是依据生成代码规律编写，不外乎观察特征分析，再观察特征分析，不断调整。都是手办眼见功夫。

都没有什么难度可言，有的就是耐性。比如[javascript-obfuscator][2]对应的解混淆工具可以
分解为N因子问题：


如何查询function的作用域？
预执行变量替换可能存在类型？
...


如：

```js
var _0xd6ac = ['[41m%s[0m', 'logG', 'log'];
(function(_0x203a66, _0x6dd4f4) {
  var _0x3c5c81 = function(_0x4f427c) {
    while (--_0x4f427c) {
      _0x203a66['push'](_0x203a66['shift']());
    }
  };
  _0x3c5c81(++_0x6dd4f4);
}(_0xd6ac, 0x6e));
var _0x5b26 = function(_0x2d8f05, _0x4b81bb) {
  _0x2d8f05 = _0x2d8f05 - 0x0;
  var _0x4d74cb = _0xd6ac[_0x2d8f05];
  return _0x4d74cb;
};

function logG(_0x4f1daa) {
  console[_0x5b26('0x0')]('[32m%s[0m', _0x4f1daa);
}

function logR(_0x38b325) {
  console[_0x5b26('0x0')](_0x5b26('0x1'), _0x38b325);
}
logG('logR');
logR(_0x5b26('0x2'));
```

要还原成

```js
function logG(message) {
  console.log('\x1b[32m%s\x1b[0m', message); 
}
function logR(message) {
  console.log('\x1b[41m%s\x1b[0m', message); 
}
logG('logR');
logR('logG');

```
第一步你总得知道字典函数，然后执行字典函数 `_0x5b26('0x0')` 还原成 `log`.

那么就好办了，写代码的事。
如 https://github.com/jscck/crack.js/blob/master/crack.js

还原后，如何重构代码，那么你还得知道代码生成之前是通过什么工具打包的webpack? 还是？

如webpack 的各种封装头和尾
https://webpack.js.org/configuration/output/#expose-a-variable

```js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports['MyLibrary'] = factory();
  else
    root['MyLibrary'] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_;
});
```

假如再深入一点，可能会涉及到JS语法解释器, AST抽象语法树

目前涉及到 JS语法解释器, AST抽象语法树的功能如下：

[prepack][10], [esprima][11], [babel][12]

或者可以阅读《编程语言实现模式》，涉及到 [antlr4][13]。


当然也可以通过esprima等工具来做解混淆，只是工作量大一点，值不值的问题。

对于未来，JS商业源码加密的方向可能[webassembly][14]，先在服务端编译成wasm，源码就能真正的闭源。


有人的地方就有路，有混淆的地方就有解混淆，目前机器学习编程响应的解混淆工具也做的相当出色，比如


[<img src="https://www.sri.inf.ethz.ch/assets/images/sri-logo.svg" alt="Secure, Reliable, and Intelligent Systems Lab" width="136" >](16)

Machine Learning for Programming 产品
[nice2predict](17)，[jsnice](9) ...
查看 https://www.sri.inf.ethz.ch/research/plml



## 拓展参考

### AST抽象语法树

为什么额外说一下AST抽象语法树，因为你可以 input-> ast -> output Anything。

比如你jsx转换小程序模版语法，这样你就可以用react语法来写小程序，如Taro。
mpvue, wepy, postcss …… 这些都是通过AST进行构建转换的工具，es6 -> es5, babel 都是使用AST。

AST抽象语法树大致流程：

Input 生成 AST tree 

然后通过AST类型断言进行相应的转换

http://esprima.org/demo/parse.html



### 反编译工具全集

小程序

https://github.com/qwerty472123/wxappUnpacker

`推荐.Net、C# 逆向反编译四大工具利器`

https://www.cnblogs.com/ldc218/p/8945892.html


2018年支持java8的Java反编译工具汇总
https://blog.csdn.net/yannqi/article/details/80847354










[1]: https://sourceforge.net/projects/jsintegration/files/tools/_%20JSA-20071021/

[2]: https://obfuscator.io/

[3]: http://blog.w3cub.com/tools/jspacker/

[4]: https://beautifier.io/

[5]: https://www.npmjs.com/package/uglify-js

[6]: https://github.com/jscck/unjsa

[7]: https://github.com/jscck/crack.js

[8]: https://github.com/eth-sri/UnuglifyJS

[9]: http://www.jsnice.org/

[10]: https://prepack.io/

[11]: http://esprima.org/

[12]: https://babeljs.io/

[13]: https://github.com/antlr/antlr4

[14]: https://webassembly.org/

[15]: https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md

[16]: https://www.sri.inf.ethz.ch/research/plml

[17]: http://www.nice2predict.org/

[18]: https://www.sri.inf.ethz.ch/





































