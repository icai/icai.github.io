---
layout: post
title: javascript类库中和编程语言中getter和setter
date: 2013-08-17 23:16:31 +0800
comments: true
statement: true
category: javascript
tags: [getter,setter,javascript,java]
---




1.backbonejs中的getter和setter


所说的backbonejs中的getter和setter就是内部自定义get和set方法，set方法嵌入了`Pub/Sub模型`,
例如 `book.on("change:title change:author", ...);`当`book.set('title':'othertitle');`触发`change`对用的`function`,
解开二重锁 （不等于自身和并且非正在执行change function)。

<!--more-->

```javascript
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    }
```

2.YUI中的getter和setter

```javascript
	get : function(name) {
        return this._getAttr(name);
    },

	set : function(name, val, opts) {
        return this._setAttr(name, val, opts);
    },
	//……
```


get: `http://yuilibrary.com/yui/docs/api/files/attribute_js_AttributeCore.js.html#l343`

Y.augment : `http://yuilibrary.com/yui/docs/api/files/oop_js_oop.js.html#l67`




3.javascript中的getter和setter

```javascript
    // 对象构造实现，javascript类库中最常用的方法
    
    function Field(val){
	    var value = val;
	       
	    this.getValue = function(){
	    	return value;
	    };
	       
	    this.setValue = function(val){
	    	value = val;
	    };
    } 
    
    // 模拟“hidden value property” 
    
    function Field(val){
    	var value = val;
       
	    this.__defineGetter__("value", function(){
	    	return value;
	    });
	       
	    this.__defineSetter__("value", function(val){
	    	value = val;
	    });
    }
    
    // es6 是实现
    function Field(val){
    	this.value = val;
    }
     
    Field.prototype = {
	    get value(){
	    	return this._value;
	    },
	    set value(val){
	    	this._value = val;
	    }
    };
```







4.java中的getter和setter

```javascript
    public class TestGetterSetter { //TestGetterSetter.class
    	
    	private String name ;
    
    	public void setName(String name){
    		if(this.name != name){
    			System.out.println("name is changeing!");
    			this.name = name ;
    			// trigger change  event
    		}
    
    }
    
    public String getName(String name){
	    if (this.name == null ){
	    setName("Guest");
	    }
	    return this.name ;
    }
    
    	public String getName() {
    		return name;
    	}
    }


    public class TestMain { //TestMain.class
    	TestGetterSetter tb ;
    
    	public static void main(String[] args) {
    		
    		new TestMain().todo();
    		// TODO Auto-generated method stub
    
    	}
    	public TestMain(){ // init
    		
    		 super();
    		 System.out.println("init TestMain !!");
    	}
    	public void todo(){
    		 tb  =  new TestGetterSetter();
    		 tb.setName("caicai");
    		 System.out.println(tb.getName());
    	}
    
    }
```

总结：

用function封装存储规则，在set，get中嵌入pub/sub模式实现 事件触发。


参考文献：

1.http://ejohn.org/blog/javascript-getters-and-setters/

2.javascript权威指南 6.6 属性getter和setter

-EOF-

