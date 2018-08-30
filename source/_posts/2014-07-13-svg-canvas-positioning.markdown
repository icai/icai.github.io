---
layout: post
title: "svg画布定位"
date: 2014-07-13 19:55:00 +0000
comments: true
categories: javascript
statement: true
keywords: svg canvas, math
---


// 角度(angle)转弧度(radian)


```js

var radian = angle * Math.PI / 180;
var angle = radian* 180/ Math.PI;
alert(radian/ angle == Math.PI / 180);
```
<!-- more -->
----------------

// Math.atan2()是弧度制

```js
var radian = Math.atan2((p1.y-p0.y),(p1.x-p0.x));
```

//------------

//已知角度degree(0,360)，半径(raduis)，求圆上的点(p1)

```js
var radian = angle * Math.PI / 180;
    p1.x = raduis * Math.cos(radian) + p0.x;  
    p1.y = raduis * Math.sin(radian) + p0.y;

function getPointAt(p0, radius, angle) {

    var radian = angle * Math.PI / 180,

        p1 = {};

    p1.x = raduis * Math.cos(radian) + p0.x;  

    p1.y = raduis * Math.sin(radian) + p0.y; 
    return p1; 

}
```

//----------

//两点A,B,求角度degree(0,360),A为Origin(p0).

var radian = Math.atan2((p1.y-p0.y),(p1.x-p0.x));

var angle = radian * 180 / Math.PI;

//---------

//已知两点A(p0),B(p1),求AB连线上距离其中一点的D0 or D1的坐标

// ....

都是高中数学

----


参考：


https://zh.wikipedia.org/wiki/%E6%9E%81%E5%9D%90%E6%A0%87%E7%B3%BB

https://zh.wikipedia.org/wiki/%E7%AC%9B%E5%8D%A1%E5%84%BF%E5%9D%90%E6%A0%87%E7%B3%BB

应用场景：

[https://www.thecn.com/tc129](https://www.thecn.com/tc129) 社交关系图





