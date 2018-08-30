---
layout: post
title: "Qunit 入门必读"
date: 2013-03-30 12:39:38 +0800
comments: true
categories: javascript
statement: true
keywords: Qunit, starter
---


0.测试如此简单：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>QUnit basic example</title>
  <link rel="stylesheet" href="/resources/qunit.css">
</head>
<body>
  <h1 id="qunit-header">QUnit</h1>
  <h2 id="qunit-banner"></h2>
  <div id="qunit-testrunner-toolbar"></div>
  <h2 id="qunit-userAgent"></h2>
  <ol id="qunit-tests"></ol>
  <div id="qunit-fixture"></div>

  <script src="/resources/qunit.js"></script>
  <script>
    test( "a basic test example", function() {
      var value = "hello";
      equal( value, "hello", "We expect value to be hello" );
    });
  </script>
</body>
</html>
```

<!-- more -->

1.逻辑比较：

```js
test( "a basic test example", function() {
  var value = "hello";
  equal( value, "hello", "We expect value to be hello" );
});
```

2.告诉它有多少条断言：

```js
test( "a basic test example", function() {
  expect(1)// 一个断言
  var value = "hello";
  equal( value, "hello", "We expect value to be hello" );
});
```

3.单向比较：

```js
//ok ：ok::function 传入的第一个参数为真，则通过。
ok( true, "true succeeds" );
```

4.双向比较：

```js
test("equal", 3, function() {
  var actual = 5 - 4;
  equal(actual, 1,     "passes because 1 == 1");
  equal(actual, true,  "passes because 1 == true");
  equal(actual, false, "fails because 1 != false");
});
```

2） notEqual： notEqual::function传入的第一第二个参数不相等(==)，则通过。

```js
test("notEqual", 3, function() {
  var actual = 5 - 4;
  notEqual(actual, 0,     "passes because 1 != 0");
  notEqual(actual, false, "passes because 1 != false");
  notEqual(actual, true,  "fails because 1 == true");
});
```

3）strictEqual ： strictEqual::function传入的第一第二个参数绝对相等(===)，则通过。

```js
test("strictEqual", 3, function() {
  var actual = 5 - 4;
  strictEqual(actual, 1,     "passes because 1 === 1");
  strictEqual(actual, true,  "fails because 1 !== true");
  strictEqual(actual, false, "fails because 1 !== false");
});
```

4) notStrictEqual ： notStrictEqual::function传入的第一第二个参数绝对不相等(!==)，则通过。

```js
test("notStrictEqual", 3, function() {
  var actual = 5 - 4;
  notStrictEqual(actual, 1,     "fails because 1 === 1");
  notStrictEqual(actual, true,  "passes because 1 !== true");
  notStrictEqual(actual, false, "passes because 1 !== false");
});
```

5） deepEqual    deepEqual::function传入的第一第二个参数完全相等(基本类型，===)，则通过。

```js
test("deepEqual", 7, function() {
  var actual = {a: 1};

  equal(    actual, {a: 1},   "fails because objects are different");
  deepEqual(actual, {a: 1},   "passes because objects are equivalent");
  deepEqual(actual, {a: "1"}, "fails because '1' !== 1");

  var a = $("body > *");
  var b = $("body").children();

  equal(    a,       b,       "fails because jQuery objects are different");
  deepEqual(a,       b,       "fails because jQuery objects are not equivalent");
  equal(    a.get(), b.get(), "fails because element arrays are different");
  deepEqual(a.get(), b.get(), "passes because element arrays are equivalent");
});
```

6) notDeepEqual notDeepEqual::function传入的第一第二个参数不完全相等(基本类型，===)，则通过。

```js
test("notDeepEqual", 3, function() {
  var actual = {a: 1};

  notEqual(    actual, {a: 1},   "passes because objects are different");
  notDeepEqual(actual, {a: 1},   "fails because objects are equivalent");
  notDeepEqual(actual, {a: "1"}, "passes because '1' !== 1");
});
```

5.预期断言：

throws()     throws::function传入的第一个参数（回调函数）抛出错误，则通过。

```js
test( "throws", function() {
  function CustomError( message ) {
    this.message = message;
  }
  CustomError.prototype.toString = function() {
    return this.message;
  };
  throws(
    function() {
      throw "error"
    },
    "throws with just a message, no expected"
  );
  throws(
    function() {
      throw new CustomError();
    },
    CustomError,
    "raised error is an instance of CustomError"
  );
  throws(
    function() {
      throw new CustomError("some error description");
    },
    /description/,
    "raised error message contains 'description'"
  );
});
```

6.异步测试：

```js
test("stop & start", function() {
  expect(1);
  var actual = false;
  stop();// 中断测试
  setTimeout(function() {
    ok(actual, "this test actually runs, and fails");
    start();// 完成测试
  }, 1000);
});

asyncTest("asyncTest & start", function() {
  expect(1);
  var actual = false;
  setTimeout(function() {
    ok(actual, "this test actually runs, and fails");
    start();//完成测试
  }, 1000);
});
```

7.模块组合：

1）简单模块组合：

```js
module("core");
test("a test in the core module", function() {
  ok(true, "this test had better pass");
});
test("another test in the core module", function() {
  ok(true, "this test had also better pass");
});
```

2) 带回调函数（setup，teardown）模块组合：

```
module("module2", {
  setup: function() {
    ok(true, "once extra assert per test");
    this.prop = "foo";
  },
  teardown: function() {
    ok(true, "and one extra assert after each test");
  }
});
test("test with setup and teardown", function() {
  expect(3);
  same(this.prop, "foo", "this.prop === 'foo' in all tests");
});
```

8.全局回调：

```
// 测试开始
QUnit.begin = function() {
  console.log("Running Test Suite");
};
// 测试结束
QUnit.done = function(failures, total) {
  console.info("Suite: %d failures / %d tests", failures, total);
};
// 在每个模块前运行
QUnit.moduleStart = function(name) {
  console.group("Module: " + name);
};
// 在每个模块后运行
QUnit.moduleDone = function(name, failures, total) {
  console.info("Module: %d failures / %d tests", failures, total);
  console.groupEnd();
};
// 每个单元测试前运行.
QUnit.testStart = function(name) {
  console.group("Test: " + name);
};
// 每个单元测试后运行
QUnit.testDone = function(name, failures, total) {
  console.info("Test: %d failures / %d tests", failures, total);
  console.groupEnd();
};
// 在每一个断言后运行
QUnit.log = function(result, message) {
  console[ result ? "log" : "error" ](message);
};
```

9.界面转逻辑：

 1）Dom 测试容器：

     #qunit-fixture

 2）模拟事件:

[https://github.com/jquery/jquery-ui/tree/master/tests](https://github.com/jquery/jquery-ui/tree/master/tests)

10.实用测试插件：

1) [https://github.com/jquery/jquery-ui/blob/master/tests/jquery.simulate.js](https://github.com/jquery/jquery-ui/blob/master/tests/jquery.simulate.js)

2) [http://qunitjs.com/plugins/](http://qunitjs.com/plugins/)



参考阅读：

1） [http://qunitjs.com/cookbook/](http://qunitjs.com/cookbook/)

2）[http://api.qunitjs.com/](http://api.qunitjs.com/)

3）[http://benalman.com/talks/unit-testing-qunit.html](http://benalman.com/talks/unit-testing-qunit.html) （main）