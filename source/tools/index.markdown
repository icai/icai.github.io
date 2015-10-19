---
layout: page
title: 前端工具箱
icon: magic
comments: flase
sharing: true
footer: true
---

{% assign groups = site.tools | group_by: "category" | sort: "title" %}

<div class="items f2enav">
	{% for group in groups %}
	{%if group.name != "" %}
	<div class="item clearfix">	
		<h2>{{ group.name }}</h2>	
		<ul class="toollist" >
		{% for item in group.items %}
		    <li><a href="{{ item.url }}" >{%if item.icon %}<i class="fa fa-{{item.icon}}"></i>{% endif %} {{ item.title}}</a></li>
		{% endfor %}
		</ul>
	</div>
	{% endif %}
	{%endfor%}
</div>
