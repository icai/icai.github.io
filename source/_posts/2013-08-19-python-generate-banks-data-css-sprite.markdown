---
layout: post
title: "python银行数据渲染css sprite"
date: 2013-08-19 13:44:09 +0800
comments: true
categories: python
statement: true
keywords: python, shell
---

前端处理重复列表类型数据都是十分繁琐的，让我们一劳永日吧。

银行类表，航空公司列表,……

<!-- more -->

{% raw %}
```py
# encoding: utf-8
import os
import urllib2
import ConfigParser
import time
import msvcrt
 
 
def log(tips,exit = False):
    print str(tips)
 
    if exit:
        msvcrt.getch()
 
class BuildBank(object):
    """docstring for BuildBank"""
 
    def __init__(self):
        super(BuildBank, self).__init__()
 
        self.templatePath = raw_input("please input your template Path in 'config.ini' file :")   #"default"
 
        if not os.path.exists(self.templatePath):
            os.makedirs(self.templatePath)
 
        self.getConfig()
 
        if self.isgetPic == True :
            self.getPic(self.remoteUrl)
 
        self.render()
 
    def getConfig(self):
 
        now = str(time.time() )
        fileName = "bank_alipay_"+ now +".html"
        pngName = "bank_alipay_"+ now +".png"
 
 
        cf = ConfigParser.ConfigParser()
        cf.read("config.ini")
        self.allBank = cf.get("main", "allBank")
 
        self.template = cf.get("template",self.templatePath)
        self.bankList = cf.get("banklist",self.templatePath)
         
 
        self.fileName = cf.get("main", "fileName") or fileName
        self.pngName = cf.get("main", "pngName") or pngName
        self.size = cf.getint("main", "size")
 
 
        self.isgetPic =  cf.getboolean("main", "isgetPic")
        self.remoteUrl = cf.get("main","remoteUrl").format(allbank = self.allBank,stamp = int(time.time()))
         
    def getPic(self,url):
 
        _absPngName = os.path.join(self.templatePath,self.pngName)
 
        if os.path.isfile(_absPngName) : return False
        headers={'User-Agent': "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36"}
         
        log("start getting remote pic...")
 
        imgRequest = urllib2.Request(url,headers=headers);
        imgData = urllib2.urlopen(imgRequest).read()
         
        output =open(_absPngName,"wb")
        output.write(imgData)
        output.close()
 
        log ("complate getting remote pic...")
 
    def renderCss(self):
        allbankclass_tmpl = ".bank_{bank}"
        # 所有银行 class 名 集合 模板
        eachbankclass_tmpl = "\t.bank_{bank} {{ background-position: 0 {posy}; }}"
        # 单个银行  class 名 模板
 
 
        _style = ""
        _banklist = self.allBank.lower().split(',')
        _size = self.size
 
        allbankclass = []
        eachbankclass = []
 
        for i in  range(len(_banklist)):
            allbankclass.append( allbankclass_tmpl.format(bank=_banklist[i]) )
            eachbankclass.append( eachbankclass_tmpl.format(bank=_banklist[i],posy=  str(- i * _size) + "px" if i > 0 else str(- i * _size)))
        else :
            _style = '''
            .bank_list li {
                float: left;
                padding: 10px 0;
                width: 180px;
                overflow: hidden;
            }
            .bank_list li .radio{
                float: left;
                margin: 8px 2px 0 2px;
            }
            .bank_list li .bank_label{ float: left; border:1px solid #e2e2e2; }
            .bank_list li .hover,.bank_list li .checked{
                border:1px solid #F60;
            }
            ''' + ",".join(allbankclass) + '''
            { width: 126px;  height: 36px; background-image:url(
            '''+ self.pngName + '''
            ); background-repeat:no-repeat; cursor: pointer; display:block; }
            ''' + "\n".join(eachbankclass)
        return _style
 
    def renderList(self,receivbank):
        body = ""
        for i in receivbank.lower().split(',') :
            body += self.template.format(bank=i)
        return body
 
    def render(self):
 
        style = self.renderCss()
         
        head = '''
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <script src="http://code.jquery.com/jquery-1.7.2.js" ></script>
                <style>
            '''+ style +'''
                </style>
            </head>
            <body>
                <ul class="bank_list" >
            '''
        body = self.renderList(self.bankList)
        foot = '''
                </ul>
                <script>
                $(function(){
                    $('.bank_list .bank_label').hover(function(){
                        $(this).addClass('hover');
                    },function(){
                        $(this).removeClass('hover');
                    })
                    $('input[type="radio"]').change(function(){
                        var $id = $(this).attr('id'),$name = $(this).attr('name');
                        $('label[for="'+ $id +'"]').addClass("checked").parents('li').siblings().find('label').removeClass('checked');
                    })
                })
                </script>    
            </body>
            </html>
            '''
 
        f=open(os.path.join(self.templatePath,self.fileName) ,"w")
        f.write(head)
        f.write(body)
        f.write(foot)
        f.close()
 
        log("complate rendering html...")
        log("press any key to exit...", True)
 
 
 
###############################################################
 
 
def main():
    try:
       BuildBank()
    except:
        log("some except error,check your config.ini and your input,please press any key to exit", true)
      pass
 
if __name__ == '__main__':
    main()

```
{% endraw %}


后续加上PIL动态合成支持。

附上exe版：

http://vdisk.weibo.com/s/dGotZ8td0hi7  

该版本耦合了“银行”,后续版本支持 “重复列表类型数据”（通用）。

相关参考：

[https://gist.github.com/gourneau/939252](https://gist.github.com/gourneau/939252)

[https://github.com/jorgebastida/glue](https://github.com/jorgebastida/glue)

[http://yostudios.github.io/Spritemapper/](http://yostudios.github.io/Spritemapper/)