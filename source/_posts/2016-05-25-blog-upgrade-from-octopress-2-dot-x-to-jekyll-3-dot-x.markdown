---
layout: post
title: "Blog Upgrade from Octopress 2.x to Jekyll 3.x"
date: 2016-05-25 08:06:09 +0800
comments: true
categories: jekyll
statement: true
tags: [octopress,jekyll]
keywords: octopress, upgrade, jekyll
---

Good news, my blog had Upgrade from Octopress 2.x to Jekyll 3.x. It is not difficult to do this, if you follow me step by step.

As you know, Octopress 2.x is based on Jekyll 2.x. so "Upgrade from Octopress 2.x to Jekyll 3.x" mean that upgrading Jekyll 2.x to Jekyll 3.x.

<!--more-->

**Firstly**, Check out and have a look the offcial upgrade turtuial [https://jekyllrb.com/docs/upgrading/2-to-3/](https://jekyllrb.com/docs/upgrading/2-to-3/)


**Secondly**, upgrade the `Gemfile` file, `gem 'pygments.rb'`, `gem 'jekyll','~> 3.1.6'`, `gem 'jekyll-sitemap'`,`gem 'jekyll-paginate', '~> 1.1'`, etc. and than remove the `Gemfile.lock` file and run command `bundle install`. If in the gem install process, you catch out the error or some dependencies dependency confliction, upgrading it to the newest version could be ok.


**And Then**, Add `gems: [jekyll-paginate]`  in your `_config.yml` file and remove `Octopress-hooks` plugin. if you use the `octopress_filters.rb`, you need to change the following Code：

```
  Jekyll::Hooks.register :page, :pre_render do |page|
    OctopressFilters::pre_filter(page)
  end

  Jekyll::Hooks.register :page, :post_render do |page|
    OctopressFilters::post_render(page)
  end

  Jekyll::Hooks.register :post, :pre_render do |post|
    OctopressFilters::pre_filter(post)
  end

  Jekyll::Hooks.register :post, :post_render do |post|
    OctopressFilters::post_render(post)
  end
```

And the `sitemap_generator.rb` should be upgrade to the newest version.

The above problem is that I encountered during the upgrade process, only for reference. I suggest that when you upgrade the jekyll like me, you should use the the command `jekyll build --trace` instead of `rake preview` that you can catch out the error easily.













