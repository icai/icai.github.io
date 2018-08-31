---
layout: post
title: "jquery one 工作原理"
date: 2013-03-27 11:57:00 +0800
comments: true
categories: javascript
statement: true
keywords: jquery, javascript,one, 原理
---

先看一下源码实现

<!-- more -->

```js
//Attach a handler to an event for the elements. The handler is executed at most once per element.  
on: function(types, selector, data, fn, /*INTERNAL*/ one) { //...    
    if (one === 1) {
        origFn = fn;
        fn = function(event) {
            // Can use an empty set, since event contains the info            
            jQuery().off(event);
            return origFn.apply(this, arguments);
        }; // Use same guid so caller can remove using origFn        
        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
    } // ....      
}, one: function(types, selector, data, fn) {
    return this.on(types, selector, data, fn, 1);
},
```

```js
$("body").one("click", ".main_container", function() {
    alert("This displays once for the first .foo clicked in the body.");
});
```

相当于

```js
$("body").on("click", ".main_container", function(event) {
    jQuery().off(event);
    alert("This displays once for the first .foo clicked in the body.");
});

```


-EOF-
