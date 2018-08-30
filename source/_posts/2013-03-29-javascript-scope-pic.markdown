---
layout: post
title: "javascript作用域迷宫图谱"
date: 2013-03-29 13:51:15 +0800
comments: true
categories: javascript
statement: true
keywords: javascript, scope
---



分子 原子 质子 中子 电子 原子核 离子

宇宙  银河系  太阳系  地月系

例：我的地址是：宇宙银河系太阳系地月系地球中国广东省广州天河区XXX。

假如外星人来我家作客，必须知道我的地址，才能来我家作客。。。

我的私有财产你不能动，除非我允许(民主社会)：

在javascript或其他语言的作用域中同样有类似的，就是说addClass的内部方法或变量你是不能访问的，除非它定义为全局对象（window.xxxx）。。。
<!-- more -->

![scope](https://user-images.githubusercontent.com/1061012/44856346-c3d39100-ac9f-11e8-8f52-a6be11140c98.jpg)

例：

```js
var  outer = function (){
    this.v1 =  this.v1 || 2;
    var fn = this;
    var inner = function(){
        fn.v1++;
        console.log(fn.v1);
    }
    inner();
}
outer(); // 3
outer(); // 4

```

```js
var  outer = function (){
    var v1 =  2;
    return function(){
        v1++；
        console.log(v1);
    }
}
var instance = outer();
instance ()// 3
instance () // 4

```

这里的v1 是 outer::Function的私有变量，你只能通过执行outer()来修改它，但你不能通过outer.v1 ,或者outer().v1来访问。

与此同时，outer()实例化对象会在内存驻扎。

例：

```js
var mynamespsce = {
util:{
    docfire:function(){

    },
    extend:function(){

    }
    },
    ui:{

    },
    array:{

    },
    //...
}
var yournamespace = {};
```

在这里加入你要访问 docfire方法就必须 通过 mynamespace.util.docfire(param),就好像外星人造访你家的例子一样，假如你通过yournamespace.util.docfire(param)访问docfire,由于yournamespace命名空间中没有docfire方法就会提示出错。

同时，docfire 中存在私有变量或者方法,你是不能访问的。