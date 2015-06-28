---
layout: post
title: "octopress configuration"
date: 2015-06-20 23:16:31 +0800
comments: true
categories: octopress jekyll
tags: [octopress]
statement: true
---

#前言
假如想省钱，只是写写博客而已。免去服务器麻烦。推荐你用octopress，可以肯定的，没有wordpress 那么多功能。octopress 是基于 jekyll 的 静态化博客，可以在github pages 和 gitcafe 等上运行。下面我们来部署一下 我们的`A blogging framework for hackers.` 博客。


<!--more-->


---------
先看一下技术栈：

octopress -> jekyll -> ruby


Markdown (or Textile), Liquid, HTML & CSS go in. Static sites come out ready for deployment.

Liquid 一个 ruby模板引擎，Markdown是……。

所以 安装octopress之前必不可少的是安装Ta的生态环境。



#安装Octopress


###安装rvm

打开[rvm](https://rvm.io/)首页，打开终端，使用以下命令安装吧。

```
$ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3

$ \curl -sSL https://get.rvm.io | bash -s stable

```

[rvm wiki](https://en.wikipedia.org/wiki/Ruby_Version_Manager)

###安装Ruby



```
$ rvm -h
$ rvm list
$ rvm install 2.2.1
$ rvm use 2.2.1
```
某些时候会提示，请使用 --bash-login. 使用就OK了。

安装完成后可以用ruby --version进行验证


###安装Octopress
安装Ruby完成后就按照官方指南安装Octpress

```
#clone octopress
$ git clone git://github.com/imathis/octopress.git octopress
$ cd octopress

#安装依赖
$ gem install bundler
$ bundle install



#安装octopress默认主题
$ rake install
```
---------

bundle 命令 是 Gemfile 文件用的，和 nodejs 项目的 package.json 类似，都是一键安装依赖包文件。






#部署
接下来需要把Blog部署到github上去，第一步要做的是去[github](https://github.com/new)创建一个`username.github.io`的repo，比如我的就叫`msching.github.io`。

然后运行以下命令，并依照提示完成github和Octopress的关联

```
$ rake setup_github_pages
```
---------

#创建博客

###生成博客
```
$ rake generate
$ rake deploy
```

rake 命令 是 Rakefile 文件用的，你在带有Rakefile 目录下执行 rake 命令，
当然你可以 `rake -T` 查看当前所有的rake Task， 或者 rake -h 获取帮助




把生成后的代码上传到github

```
$ git add .
$ git commit -m 'create blog'
$ git push origin source
```
完成后等待一段时间后就能访问`http://username.github.io`看到自己的博客了


###修改配置
配置文件路径为`~/octopress/_config.yml`

参考： [官方](https://github.com/octopress/octopress)


编辑完成后

```
$ rake generate

$ git add .
$ git commit -m "settings" 
$ git push origin source

$ rake deploy
```

###安装第三方主题
Octopress有许多第三方主题可以选择，首先在[这里](http://opthemes.com/)上寻找喜欢的主题，点击进入对应主题的git，一般在readme上都会有安装流程

```
#这里以安装allenhsu定制的greyshade主题为例，原作者是shashankmehta
$ git clone git@github.com:allenhsu/greyshade.git .themes/greyshade

#Substitue 'color' with your highlight color
$ echo "\$greyshade: color;" >> sass/custom/_colors.scss 

$ rake "install[greyshade]"
$ rake generate

$ git add .
$ git commit -m "theme" 
$ git push origin source

$ rake deploy
```



###支持中文标签
目前版本的Octopress会在`/source/blog/categories`下创建一个`index.markdown`来作为分类的首页，但这个首页在标签有中文时会出现无法跳转的情况，原因是因为在出现中文标签时Octopress会把文件的路径中的中文转换成拼音，而在Category跳转时是直接写了中文路径，结果自然是404。解决方法是自己实现一个分类首页并处理中文。

首先按照[这里](https://kaworu.ch/blog/2013/09/23/categories-page-with-octopress/)的方法实现`index.html`

将`plugins/category_list_tag.rb`中的

```
category_url = File.join(category_dir, category.gsub(/_|\P{Word}/, '-').gsub(/-{2,}/, '-').downcase)
```

替换成

```
category_url = File.join(category_dir, category.to_url.downcase)
```
这样你的博客就可以支持中文标签的跳转了。

---------

#写博客

经过上面几部后，博客已经成功搭建，现在就可以开始写博文了。

###创建博文
```
#如果用的是终端
$ rake new_post['title']

#如果用的是ZSH
$ rake "new_post[title]"
#或者
$ rake new_post\['title'\]
```
生成的文件在`~/source/_posts`目录下


###编辑博文

```
#...markdown写博文

$ rake preview #localhost:4000

$ rake generate

$ git add .
$ git commit -m "comment" 
$ git push origin source

$ rake deploy
```

---------
#参考资料

* http://octopress.org/
* https://msching.github.io/blog/2014/04/11/starting/
* https://help.github.com/articles/using-jekyll-plugins-with-github-pages/
* https://github.com/xiaocong/xiaocong.github.io
* https://github.com/shashankmehta/greyshade
* https://github.com/imathis/octopress
* https://github.com/msching/msching.github.io

* http://blog.devtang.com/blog/2012/02/10/setup-blog-based-on-github/
* https://msching.github.io/blog/2014/04/11/starting/
* http://robdodson.me/some-octopress-rake-tips/
* http://jekyllcn.com/docs/templates/

* http://rails-practice.com/content/