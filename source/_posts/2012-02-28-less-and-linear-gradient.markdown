---
layout: post
title: "关于lesscss和颜色梯度（linear-gradient ）的一些问题"
date: 2012-02-28 12:53:01 +0800
comments: true
categories: javascript
statement: true
keywords: less, linear-gradient

---


## 一、什么是less？

一种 动态 样式 语言.

LESS 将 CSS 赋予了动态语言的特性，如 变量， 继承，运算， 函数.

LESS 既可以在 客户端 上运行 (支持IE 6+, Webkit, Firefox)，也可一在服务端运行 (借助Node.js).

<!-- more -->

## 二、什么是颜色梯度？

本人没有文化，正确地说 线性梯度（-webkit-）linear-gradient 是gradient属性的一个分支。

————————————————————————

css3 ：linear-gradient 加油站：

[http://dev.opera.com/articles/view/css3-linear-gradients/](http://dev.opera.com/articles/view/css3-linear-gradients/)（opera）

[https://ie.microsoft.com/testdrive/graphics/cssgradientbackgroundmaker/default.html](https://ie.microsoft.com/testdrive/graphics/cssgradientbackgroundmaker/default.html)(ms)

[https://developer.mozilla.org/en/CSS/linear-gradient](https://developer.mozilla.org/en/CSS/linear-gradient)(moz)

[http://www.webkit.org/blog/1424/css3-gradients/](http://www.webkit.org/blog/1424/css3-gradients/)(webkit)   

生成工具：[http://westciv.com/tools/gradients/](http://westciv.com/tools/gradients/)

* * *

## 三、less与 css gradient 相关的function：color function

Color 函数

LESS 提供了一系列的颜色运算函数. 颜色会先被转化成 HSL 色彩空间, 然后在通道级别操作:

```less
lighten(@color, 10%); // return a color which is 10% _lighter_ than @color（减淡）

darken(@color, 10%); // return a color which is 10% _darker_ than @color（加深）

saturate(@color, 10%); // return a color 10% _more_ saturated than @color（+饱和度）

desaturate(@color, 10%); // return a color 10% _less_ saturated than @color（-饱和度）

fadein(@color, 10%); // return a color 10% _less_ transparent than @color（-透明度）

fadeout(@color, 10%); // return a color 10% _more_ transparent than @color（+透明度）

spin(@color, 10); // return a color with a 10 degree larger in hue than @color（……）

spin(@color, -10); // return a color with a 10 degree smaller hue than @color（）
```
[http://verekia.com/less-css/dont-read-less-css-tutorial-highly-addictive/attachment/less-css-8](http://verekia.com/less-css/dont-read-less-css-tutorial-highly-addictive/attachment/less-css-8)

## 四、预览效果：

![preview](https://user-images.githubusercontent.com/1061012/44856110-32641f00-ac9f-11e8-88fa-87842654fbe8.jpg)

## 五、源代码：

```less
.buttonbase(@bcolor:#ffffff,@border-radius:3px,@color:#FFFFFF){
    //background: @bcolor;
    background: -webkit-linear-gradient(@bcolor, darken(@bcolor,5%) 44%, darken(@bcolor,20%)) repeat scroll 0 0 transparent;
    background: -moz-linear-gradient(@bcolor, darken(@bcolor,5%) 44%, darken(@bcolor,20%)) repeat scroll 0 0 transparent;
    background: -ms-linear-gradient(@bcolor, darken(@bcolor,5%) 44%, darken(@bcolor,20%)) repeat scroll 0 0 transparent;
    background: -o-linear-gradient(@bcolor, darken(@bcolor,5%) 44%, darken(@bcolor,20%)) repeat scroll 0 0 transparent;
    border-color: darken(@bcolor,22%) darken(@bcolor,30%) darken(@bcolor,18%);
    border-radius: @border-radius;
    border-style: solid;
    border-width: 1px;
    box-shadow: 0 1px 0 0 lighten(@bcolor,10%) inset, 0 1px 2px rgba(0, 0, 0, 0.2);
    color:@color;
    font-family: arial,helvetica,sans-serif;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    padding: 6px 16px 7px;
    text-align: center;
    text-decoration: none;
    text-shadow: 0 -1px 0 #4865E4;
        &:hover{
            background: -webkit-linear-gradient(lighten(@bcolor,1%), darken(@bcolor,4.5%) 44%, darken(@bcolor,21%)) repeat scroll 0 0 transparent;
            background: -moz-linear-gradient(lighten(@bcolor,1%), darken(@bcolor,4.5%) 44%, darken(@bcolor,21%)) repeat scroll 0 0 transparent;
            background: -o-linear-gradient(lighten(@bcolor,1%), darken(@bcolor,4.5%) 44%, darken(@bcolor,21%)) repeat scroll 0 0 transparent;
            background: -ms-linear-gradient(lighten(@bcolor,1%), darken(@bcolor,4.5%) 44%, darken(@bcolor,21%)) repeat scroll 0 0 transparent;
            border: 1px solid darken(@bcolor,21%);
            box-shadow: 0 1px 0 0 lighten(@bcolor,10%) inset, 0 1px 2px rgba(0, 0, 0, 0.3);

            &:active{
                background: -webkit-linear-gradient(@bcolor, darken(@bcolor,4.8%) 44%, darken(@bcolor,20.5%)) repeat scroll 0 0 transparent;
                background: -moz-linear-gradient(@bcolor, darken(@bcolor,4.8%) 44%, darken(@bcolor,20.5%)) repeat scroll 0 0 transparent;
                background: -ms-linear-gradient(@bcolor, darken(@bcolor,4.8%) 44%, darken(@bcolor,20.5%)) repeat scroll 0 0 transparent;
                background: -o-linear-gradient(@bcolor, darken(@bcolor,4.8%) 44%, darken(@bcolor,20.5%)) repeat scroll 0 0 transparent;
                border-color: darken(@bcolor,23%) darken(@bcolor,28%) darken(@bcolor,19%);
                border-left: 1px solid darken(@bcolor,25%);
                border-right: 1px solid darken(@bcolor,25%);
                border-style: solid;
                border-width: 1px;
                box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1) inset;
            }
        }
    }

#green{
    .buttonbase(#83C260,3px,#FFFFFF);
}

#yellow {
    .buttonbase(#ffc40d,3px,#FFFFFF);
}

#blue {
    .buttonbase(#049cdb,3px,#FFFFFF);
}

#red {
    .buttonbase(#9d261d,3px,#FFFFFF);
}

#orange{
    .buttonbase(#f89406,3px,#FFFFFF);
}

#purple{
    .buttonbase(#7a43b6,3px,#FFFFFF);
}

```
代码阅读版：[http://jsfiddle.net/Jf6Dg/](http://jsfiddle.net/Jf6Dg/)

更加面向对象的版本(分离不需要重载的代码)：[http://jsfiddle.net/Jf6Dg/2/](http://jsfiddle.net/Jf6Dg/2/)

在线生成试一试：   
[http://less.cnodejs.net/](http://less.cnodejs.net/)

## 六、 关于less的语法：

查看这里吧 [http://www.lesscss.net/#docs](http://www.lesscss.net/#docs)

最近一个群的朋友Q我，叫我做参与做组件。                               
想法挺好的。                                        
其实组件根据自己的需求就是做自己的[bootstrap](http://twitter.github.com/bootstrap/)吗！！

感想：关于面向对象和代码重用，web前端可以走的更远……是不是有点写程序的味道。刚才在twitter@了lesscss的作者，希望less下次跟新可以标准化CSS。


2/28