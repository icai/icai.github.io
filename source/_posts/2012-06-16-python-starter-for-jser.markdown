---
layout: post
title: "python概念转换dictionary、tuple、和 list"
date: 2012-06-16 13:29:31 +0800
comments: true
categories: python
statement: true
keywords: python, dictionary, tuple, list
---


1.**Dictionar **-->Object json

```py
d = {"server":"mpilgrim", "database":"master"}
```

Dictionary 的 key 是大小写敏感的.

```py
d["server"]

del d["server"] #删除单个

d.clear()  #清空
```
<!-- more -->

2.**List**-->String Array

----------------------------

```py

li = ["a", "b", "mpilgrim", "z", "example"]
li[0] #start
li[-1] #end
li[-3] == li[5 - 3] == li[2]
li[1:3]

```
==>['b', 'mpilgrim']

```py

li[1:-1]
```

==>['b', 'mpilgrim', 'z']

```py

li[:3]  # ==>li[0:3]
li[3:] #==>li[3:len(li)]
li[:] # ==>li[0:len(li)]
```

-----------------

```py
li.append("new")   #then   remove('new') ==> unchange
```

//==>['a', 'b', 'mpilgrim', 'z', 'example', 'new']

```py
li.insert(2, "new")
```

//==>['a', 'b', '**new**', 'mpilgrim', 'z', 'example', 'new']

```py
li.extend(["two", "elements"])

# ==> 

li.append("two")
li.append("elements")
```

![](http://g.hiphotos.baidu.com/space/pic/item/242dd42a2834349b85f2952fc9ea15ce37d3bea0.jpg)

--------------

搜索 list  index -->indexOf
```py
li.index("example")
# //==>+number
```

```py
li.index("c") #//==>  error

"c" in li  #//==>False

```
-------------

```py
li +=['cc','bb']

li =li+ li

li = li*2
```

--------------------------------

**Tuple**是不可变的 list

![](http://e.hiphotos.baidu.com/space/pic/item/e4dde71190ef76c61bb701819d16fdfaaf516737.jpg)

[深入 Python :Dive Into Python 中文版](http://woodpecker.org.cn/diveintopython/index.html)