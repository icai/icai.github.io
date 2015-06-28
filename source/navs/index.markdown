---
layout: page
title: "前端网址导航"
date: 2015-06-22 02:18
icon: bars
comments: true
sharing: true
footer: true
---

{% assign groups = site.data.feenav | group_by: "category" | sort: "title" %}
<div class="items f2enav">
	{% for group in groups %}
	<div class="item clearfix">	
		<h2>{{ group.name }}</h2>	
		<ul>
			{% for item in group.items %}
			<li class="post alignleft">
			<a href="{{ item.link }}" title="{{ item.desc }}" target="_blank" >{% if site.titlecase %}{{ item.title | titlecase }}{% else %}{{ item.title }}{% endif %}</a>
			</li>
			{%endfor%}
		</ul>
	</div>
	{%endfor%}
</div>