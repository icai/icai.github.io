---
layout: post
title: "《编写可维护的JavaScript》读书笔记（节选)"
date: 2013-03-19 13:17:09 +0800
comments: true
categories: javascript
statement: true
keywords: maintainable, javascript, 笔记
---


1.Basic Formatting:


粗略浏览了一些，其实就是一些习惯问题，例如：

缩进空格，代码换行，常量赋值……

列举各大框架的缩进习惯，2 space ,4 space or 1 tab……

<!-- more -->

错误：

return{}

代码换行：

var LiteralValues = 'one characters two characters\three .. f ....five\six';

还有一些小题大做的：

new Array();new Object();

3.Statements and Expressions：

if的大括号尽量写，

不建议：

function() {}()

建议：

(function(){})()

(function(){}())

……

假如非入门的，建议 直接跳到 part 3 Automation

补充资料：


[http://bonsaiden.github.com/JavaScript-Garden/zh/](http://bonsaiden.github.com/JavaScript-Garden/zh/)

[http://shichuan.github.com/javascript-patterns/](http://shichuan.github.com/javascript-patterns/)


-EOF-