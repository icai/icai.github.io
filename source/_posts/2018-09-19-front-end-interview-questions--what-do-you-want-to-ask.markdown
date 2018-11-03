---
layout: post
title: "前端面试题之他们想问什么？"
date: 2018-09-19 22:55:43 +0800
comments: true
categories: interview
statement: true
keywords: interview, frontend
---


最近在找工作遇到很多奇葩的面试问题？怎么说呢，就是比较书面性的，比较学术性的问题？
今天大家分享一下吧，我们来分析一下究竟这些问题究竟在问什么？跟最终像表达的是什么？
对于面试题，真是千秋各异，有些公司喜欢问原理，有些公司不管原理什么的，直接那个API怎么怎么用！

<!-- more -->

回归正题吧!


## 1、浏览器输入url后都干了些什么?

你只会答：建立请求，接收数据，dom渲染等。那么百度一下别人是怎么写？
其实也差不多只是分解的很细，按我的理解说一下吧

1） 如何建立请求？引申出来的HTTP协议的理解了？
那么HTTP协议如何工作？


一个基本HTTP系统有什么组件构成？

<img width="418" alt="default" src="https://user-images.githubusercontent.com/1061012/45764276-f4866500-bc64-11e8-9825-49c9ac0efa2d.png">


过程是怎么样的？

[client/request] --[Proxy] -- [Proxy] -- [Proxy]-- [Server/response]

其中Proxies中可以进行如下操作：


- caching (the cache can be public or private, like the browser cache)   
- filtering (like an antivirus scan, parental controls, …)   
- load balancing (to allow multiple servers to serve the different requests)   
- authentication (to control access to different resources)   
- logging (allowing the storage of historical information)   


HTTP大致的流程：

1、Open a TCP connection (建立TCP链接)

2、Send an HTTP message （发送HTTP消息）

3、Read the response sent by the server （读取服务器响应信息）

4、Close or reuse the connection for further requests.（关闭或者重用链接）


[https://docs.w3cub.com/http/overview/](https://docs.w3cub.com/http/overview/)


2）如何渲染页面的？

任何浏览器都应该有的7大组件

<img  src="https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/layers.png" alt="How Web Browswers Work 2" width="432" height="296">

涉及到的要点：DOM Tree, Html Parser, Css Parser, Layout, Painting, Css Box Modal(盒子模型), Positioning 等等，很长不一一说，可以阅读下面链接。

[https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)



## 2、 eventloop的理解？

你只会答：你指的是setTimeout，作用域，执行机制之类的吗？

其实想问的是浏览器单线程是如何工作的？ setTimeout在当前作用域最后调用只是一个子集


<img src="https://mdn.mozillademos.org/files/4617/default.svg" alt="Stack, heap, queue" style="height: 270px; width: 294px;">


alert 和 synchronous XHR 会堵塞浏览器

eventLoop 大致的执行顺序

```js
while (eventLoop.waitForTask()) {
  const taskQueue = eventLoop.selectTaskQueue()
  if (taskQueue.hasNextTask()) {
    taskQueue.processNextTask()
  }

  const microtaskQueue = eventLoop.microTaskQueue
  while (microtaskQueue.hasNextMicrotask()) {
    microtaskQueue.processNextMicrotask()
  }

  if (shouldRender()) {
    applyScrollResizeAndCSS()
    runAnimationFrames()
    render()
  }
}

```

[https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)

[https://blog.risingstack.com/writing-a-javascript-framework-execution-timing-beyond-settimeout/](https://blog.risingstack.com/writing-a-javascript-framework-execution-timing-beyond-settimeout/)



## 3、Vue 或 react Diff算法原理的有了解过吗？

过程：

跟上一次 vircual dom diff 后生成语法树, 然后patch回去 native dom.

状态机 -> virtual dom(template) diff -> 生成 patch -> native dom.

Vue virtual DOM patching 算法是基于 https://github.com/snabbdom/snabbdom


diff 算法大致 O(n3) -> O(n) 引入两个前提条件：elements Types 和 collection key

React: 

https://reactjs.org/docs/reconciliation.html




## 4、 Vue data Vuex 或者 React state Redux 是如何工作的？

Vuex

![](http://wx2.sinaimg.cn/large/50e0073dgy1fwg0bx3mo8j20jh0fbwef.jpg)

Redux

![](http://wx1.sinaimg.cn/large/50e0073dgy1fwuwvl12isg21400u0kjm.gif)

Dva 
![](http://wx1.sinaimg.cn/mw690/50e0073dgy1fwg0c6xkgej218u0e4ju8.jpg)

Redux-saga

![](http://wx1.sinaimg.cn/mw690/50e0073dgy1fwg0hxxv3bj20u30f2q4e.jpg)


-完-
















