---
layout: slides
published: true
title: "Ruby Bus Presentation"
description: wellcome ruby get start course, ruby is very nice language as offcial website said, A PROGRAMMER'S BEST FRIEND. Well, let check it out.
keywords: ruby, slide, guide
date: 2015-07-05T04:22:26+00:00
comments: true
author: Terry Cai
slides: blood
---

{% slide %}

## Ruby Bus

### Terry Cai

##### China, GZ
##### 07/05/2015
{% slide %}

### Ruby

* A PROGRAMMER'S BEST FRIEND

![Ruby Logo](/images/posts/ruby-bus/ruby_logo.png =200x200)

{% slide %}

###Hello world

```ruby
	# Ruby knows what you
	# mean, even if you
	# want to do math on
	# an entire Array
	cities  = %w[ London
	              Oslo
	              Paris
	              Amsterdam
	              Berlin ]
	visited = %w[Berlin Oslo]

	puts "I still need " +
	     "to visit the " +
	     "following cities:",
	     cities - visited
```

{% slide %}

###Read document

https://devdocs.io/ruby/




{%slide%}
###Ruby language

https://devdocs.io/ruby-language/

{%slide%}

##Methods implement

	def one_plus_one
	  1 + 1
	end

{% slide_top %}

###Calling Methods

	one_plus_one()

**parenthesis are optional**
	
	one_plus_one

{% slide_bottom %}
###Receiver

**self**
- self is the default receiver.

```ruby
	my_object.my_method

	#or

	self.my_method
```
{%slide %}

## Thanks!
Questions?

{%slide%}
##つづく
{% endslide %}

