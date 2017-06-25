---
layout: post
title: "每日一点点之scrapy"
date: 2017-06-20 23:19:58 +0800
comments: true
categories: information
statement: true
keywords: Scrapy,Python
---


Scrapy 是什么？

Scrapy是一个基于Python的高级爬虫框架，只需要简单的配置就可以实现你大大的需求。

为什么要介绍Scrapy，内容时代了，没有内容再好看的网站，那又有什么用呢？

<!-- more -->

对不对？对对对。


学习scrapy有什么需求吗？

python是基于python语言的，那么自然你要懂一些python的基础啦！

还有简单的xpath语法或类似于jQuery选择器语法，一边用一边学也可以的。


建议在Linux或者Mac下进行学习，Windows下可能会遇到各种入门级的问题。例如安装过程中报错，缺少这个，那个的问题。


只需要准备一样东西，就是官方文档 https://docs.scrapy.org/en/latest/ 

可以一边看，一边实践。



### 安装

```bash
pip install Scrapy

```

官方推荐你安装python虚拟环境进行 Scrapy，不装也没有问题！ 虚拟环境会虚拟IP么？ 不会，不是这一回事

```bash
pip install virtualenv

```

接着来来读一下官方教程：

https://docs.scrapy.org/en/latest/intro/tutorial.html


```bash
scrapy startproject 项目名字

```


A: 假如你想知道parse接着会干什么，parse里面能干什么，我觉得你去了解一下Scrapy的钩子函数，以及整体架构。

B: 假如你对yield语法不是很了解的，可以去理解一下yield语法（python基础）。


入门是很快的。

假如你感兴趣，接着你可能会提出一些问题：

比如，怎么在一个页面抓取多条？怎么去重？等等



为什么会介绍Scrapy？

其实Scrapy不单只是一个爬虫框架，而且是一个很好的Python入门学习项目，假设你怎么会Python。


-EOF-
















