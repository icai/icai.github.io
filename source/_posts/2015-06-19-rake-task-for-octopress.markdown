---
layout: post
title: rake task for octopress
date: 2015-06-19 23:35:19 +0800
comments: true
categories: octopress jekyll
tags: [rake,task, octopress, jekyll]
---


$ rake -T


```
	rake clean # 清理缓存: .pygments-cache, .gist-cache, .sass-cache
	rake copydot[source,dest] # copy dot files for deployment
	rake deploy # Default deploy task
	rake gen_deploy # 生成并部署网站
	rake generate # 生成 jekyll 网站
	rake install[theme] # 初始化octopress，复制默认主题到Jekyll's generator路径下
	rake integrate # 把所有隐藏的posts移回到posts目录，以准备生成网站
	rake isolate[filename] # Move all other posts than the one currently being worked on to a temporary stash location (stash) so regenerating the site happens much more quickly
	rake list # list tasks
	rake new_page[filename] # Create a new page in source/(filename)/index.markdown
	rake new_post[title] # Begin a new post in source/_posts
	rake preview # preview the site in a web browser
	rake push # ※ deploy public directory to github pages
	rake rsync # Deploy website via rsync
	rake set_root_dir[dir] # Update configurations to support publishing to root or sub directory
	rake setup_github_pages[repo] # Set up _deploy folder and deploy branch for Github Pages deployment
	rake update_source[theme] # Move source to source.old, install source theme updates, replace source/_includes/navigation.html with source.old's navigation
	rake update_style[theme] # Move sass to sass.old, install sass theme updates, replace sass/custom with sass.old/custom
	rake watch # Watch the site and regenerate when it changes
```	
<!--more-->

test include_code plugin:

{% include_code Example 2 github.js %}

