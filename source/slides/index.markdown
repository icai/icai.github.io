---
layout: page
title: "slides"
icon: talk
date: 2015-07-04 13:53
comments: true
sharing: true
footer: true
---

<ul>
	{% for item in site.slides %}
	    <li><a href="{{ item.url }}">{{ item.title}}</a></li>
	{% endfor %}
</ul>
