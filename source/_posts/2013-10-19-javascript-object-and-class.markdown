---
layout: post
title: "javascript 对象中的复制，继承，引用，浅拷贝，深拷贝，多态，静态方法"
date: 2013-10-19 15:10:43 +0800
comments: true
categories: javascript
statement: true
keywords: javascript, 对象, 引用, 复制, 继承 
---


## 导言

javascript与C,C++,Java等语言，他们之间总让人感觉存在一层纱，javascript易入门，难深入，而其他则相反（个人观点）。

其实不论什么语言，难与易的突破口都在语法基础上，当你越学得深入，你会发现语言之间的相同是如此的美妙。其实个人感觉javascript是相对其他语言是最容易学的一种语言。但部分人确认为，javascript十分难学，什么兼容性都把你搞死了。个人认为应该把javascript的难与易一分为二。javascript的语言是相对其他语言简单的，而且没有过多的语法概念（泛型，多态，模板），让编程者留下很多可以思考和想象的空间。或许多人喜欢javascript就是因为它的灵活性。

<!-- more -->

## 前言

javascript是一门松散的面向对象脚本语言

为什么说是松散的呢？javascript一切皆对象（var），就是说不论数组，函数……都是继承自对象。

javascript给我们所展现对象继承存储其实就像treegrid数据类似，但是正好相反。

就是说javascript对象继承存储和javascript静态方法存储是相反的。

![](http://g.hiphotos.bdimg.com/album/pic/item/9f2f070828381f30f7ee428fab014c086e06f025.jpg)
![1](https://user-images.githubusercontent.com/1061012/44942632-1b314880-ade9-11e8-9309-3b1fab06e63e.jpg)

图：treegrid数据

* * *


![2](https://user-images.githubusercontent.com/1061012/44942633-1bc9df00-ade9-11e8-9649-1bf153d2abfa.png)

![3](https://user-images.githubusercontent.com/1061012/44942634-1c627580-ade9-11e8-84cf-3982b8b78b73.png)

图：javascript对象继承

* * *


![4](https://user-images.githubusercontent.com/1061012/44942635-1c627580-ade9-11e8-8a8c-aec513b87629.png)

图：javascript静态方法

* * *


![5](https://user-images.githubusercontent.com/1061012/44942636-1cfb0c00-ade9-11e8-9938-a850e81c4915.jpg)

图：javascript Object layout

上面所说的其实就是javascript对象构成，或许还会困惑，下面将深入分析。

## 一、javascript对象引用

什么叫做javascript对象引用？简单地说就是非实体对象赋值，即是非String,Number,Array，Null,Undefined等对象（除Object对象）赋值。

    // 引用
    var source  = {
        warm:function(v){
            alert(v)
        }
    };
    var quote = source;
    delete source.warm;
    quote.warm('b');

上面代码会报错，因为source是非实体对象，quote内存地址指向source，当删除source.warm的时候，quote下的warm随之消失。

## 二、javascript对象复制，浅拷贝，深拷贝

对于上述的代码要想不报错的话，就必须对source.warm也赋值给quote.warm，因为source.warm是实体对象（Function）。

对对象进行遍历，子对象一对一赋值就叫做javascript对象复制。既然是遍历，自然有深浅度。所以我们对彻底遍历叫做深拷贝，只遍历子对象第一层叫做浅拷贝。

(1)

```js
    var source  = {
        warm:function(v){
            alert(v)
        }
    };
    function extend(target, source) {
        for (var n in source) {
            if(source.hasOwnProperty(n)){
                target[n] = source[n]
            }
        }
        return target
    }
    var exObj = extend({},source);
    delete source.warm;
    exObj.warm('b');
```

(2)上述代码不会报错，因为source通过遍历已经把其子对象复制到exObj下了。

```js
var source  = {
    warm:function(v){
        alert(v)
    },
    childs:{
        log:function(v){
            alert('log'+v);
        },
        info:function(v){
            alert('info'+v);
        }
    },
    _private:{
        _name:'source',
        _age:12
    }
};
function extend(target, source) {
    for (var n in source) {
        if(source.hasOwnProperty(n)){
            target[n] = source[n]
        }
    }
    return target
}
var exObj = extend({},source);
```



会发生错误，为什么呢？上面同样是复制，当我们执行如下代码：

```js
delete source.childs.log;
delete source.childs;
exObj.childs.log('b');
```


同理，我们执行如下：就是我们一开始所说遍历的深度不彻底，我们通过上述extend方法只遍历了source.childs,而source.childs是非实体对象，所以只是充当exObj.childs对象的引用。

```js
exOBj._private._age++;
source._private._age; // 13

```



我们要实现深拷贝的话，就必须 判断其子对象是否是非实体对象，假如是非实体对象的话，就进行递归遍历操作。我们改变exOBj._private._age的时候，source._private.age也发生改变，道理和上面的一样。

还记得jquery.extend api吗

```js
jQuery.extend( [deep ], target, object1 [, objectN ] )
```


当我们第一个参数传入true的时候，就帮我我们实施深拷贝操作。

## 三、javascript对象继承

学过java或者c++，php等语言的读者就好理解了，刚开始前言的

图：javascript对象继承 和 图：javascript Object layout就说的很详细了。那么他们是怎么实现的呢？

其实javascript中还有一个很重要的概念就是作用域。

编程语言中的继承就是子类继承父类已有的方法，属性，并做相应的拓展，进而形成自己的具有特定属性和方法的类。

开始学面向对象语言的时候，通常都会举一个经典例子，就是动物父类，派生鸟类，鱼类……，而鸟类接着派生出鹰，麻雀……。

而javascript（ecma5）还没有给出官方的方法进行上述操作而已。但是后续（ecma 6）将会支持。正如，一开始说所，javascript是一门松散的面向对象语言，留给变成者很多思考的空间。

javascript中有两个很重要的方法就是call，apply。人们常谈的javascript设计模式常常都离不开call,apply,回调函数等等。

那么如何才能实现（图：javascript对象继承）中类似的对象继承？

接着动物的例子：

what is animal? 它们能够对环境作出反应并移动，捕食其他生物。

```js
function animal(){
    
}
animal.prototype = {
    catchOther:function(){
    
    },
    protectSelf:function(){
    
    }
}
```



鸟类：

```js
function bird(){
    
}
bird = wrapper(bird,animal);
bird.prototype.fly = function(){
    console.log('flying');
}
```



wrapper？？用来继承，如何写才能实现如下呢？

![6](https://user-images.githubusercontent.com/1061012/44942637-1cfb0c00-ade9-11e8-8f70-8375bdbe35cb.png)

new 一个 animal ？？并指向bird.prototype ?

好像可以实现,但是当我们打入

bird.prototype.**proto**.constructor的时候是什么呢？？构造函数是否符合对象的构造函数的定义呢？

我们给出一个简单的方案，至于构造函数应该执行谁的问题留作思考，网上也很多关于这方面的讨论？自己可以搜一下

```js
function wrapper(child, parent) {
    var ins = function() {
        child.apply(this, arguments);
    };
    var subclass = function() {};
    subclass.prototype = parent.prototype;
    ins.prototype = new subclass;
    return ins;
};
```



所谓的静态方法就是不涉及抽象对象函数实现的方法，举个很简单的例子，如jquery中的$.isFunction,$.isArray等等就属于静态方法。同样是上面的例子

四、javascript对象静态方法

```js
var source  = {
    warm:function(v){
        alert(v)
    },
    childs:{
        log:function(v){
            alert('log'+v);
        },
        info:function(v){
            alert('info'+v);
        }
    },
    _private:{
        _name:'source',
        _age:12
    }
};
function extend(target, source) {
    for (var n in source) {
        if(source.hasOwnProperty(n)){
            target[n] = source[n]
        }
    }
    return target
}
var exObj = extend({},source);
```



这里不合理的地方在于当我们对其成员可操作，假如上述是公共方法，团队每个人都可以对其调用，并假如warm方法会对其兄弟属性_private产生改变。如何_private下的是标识变量（flog ~），那么这个标识变量就违反了可操作的唯一性。

## 五、javascript对象多态

所谓的对象多态就是和构造函数或者方法参数传递进行动态识别处理。

依然是$.extend,还记得api有多少调用吗？

java中的多态是不同参数类型都重新定义一遍，好像十分费劲？javascript留给编程者的思考空间就是给你一个arguments，调用当前方法的参数集合，是一个类数组。

一般地：

```js
function(a){
  var args = [].slice(arguments,0);
  if(args[0] == 'xx')doxxx;
  if(typeof args[0] == 'function') doxxx;
}
```

相关阅读：是不是很有意思呢。

1、[javascript权威指南 源代码分析（一）Objects](http://hi.baidu.com/tp100/item/a18184ee589145d5eb34c941 "javascript权威指南 源代码分析（一）Objects")

2、[javascript权威指南 源代码分析（二）Functions](http://hi.baidu.com/tp100/item/4fbb55d18f6741352a35c741 "javascript权威指南 源代码分析（二）Functions")

3、（[JavaScript中**proto**与prototype的关系](http://www.cnblogs.com/snandy/archive/2012/09/01/2664134.html)）

后记：

码字真累，百度空间蛋疼啊，写到一半按了不知道什么键，没有了一大截……

有高亮代码时，不要按ctrl+Z，不然你的人生十分钟会浪费掉的。

2013/10/19

本文来源

菜籽油: [http://hi.baidu.com/tp100/item/4d59a03b4b73fac42f8ec25e](http://hi.baidu.com/tp100/item/4d59a03b4b73fac42f8ec25e "http://hi.baidu.com/tp100/item/4d59a03b4b73fac42f8ec25e")

-EOF-
