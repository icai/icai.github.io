---
layout: post
title: "《html5数据推送应用开发》读书摘要"
date: 2017-08-06 09:18:14 +0000
comments: true
categories: javascript
statement: true
keywords: sse,data push
---

书很薄，在图书馆瞄了一下，知识点不多。
基本上第二章基本讲完，其他讲解都是一些擦边的，兼容性，安全性，……
可以总结为如下：

<!-- more -->

《Data Push Apps with HTML5 SSE》 读书摘要

## 摘要

- EventSource方法 new EventSource("url");
- MIME类型text/event-stream
- 数据传输格式"data:" + new Date().toISOString() + "\n\n";


## SSE示例

```
    <!doctype html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Basic SSE Example</title>
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    </head>
    <body>
    <pre id="x">Initializing...</pre>
    <script>
        var es = new EventSource("basic_sse.php");
        es.addEventListener("message", function(e){
            $("#x").append("\n" + e.data);
        },false);
    </script>
    </body>
    </html>
```

```javascript
var http = require("http"),
    fs = require("fs");
var port = parseInt(process.argv[2] || 1234);
http.createServer(function(request, response) {
    console.log("Client connected:" + request.url);
    if (request.url != "/sse") {
        fs.readFile("basic_sse.html", function(err, file) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            var s = file.toString(); //file is a buffer
            s = s.replace("basic_sse.php", "sse");
            response.end(s);
        });
        return;
    }
    //Below is to handle SSE request. It never returns.
    response.writeHead(200, { "Content-Type": "text/event-stream" });
    var timer = setInterval(function() {
        var content = "data:" + new Date().toISOString() + "\n\n";
        var b = response.write(content);
        if (!b) console.log("Data got queued in memory (content=" + content + ")");
        else console.log("Flushed! (content=" + content + ")");
    }, 1000);
    request.connection.on("close", function() {
        response.end();
        clearInterval(timer);
        console.log("Client closed connection. Aborting.");
    });
}).listen(port);
console.log("Server running at http://localhost:" + port);
```

## 兼容性


startEventSource()

- Basically all Firefox and Chromea   
- Desktop Safari 5.0+   
- iOS Safari 4.0+   
- Android 4.4+ (earlier where Chrome is default browser)   
- Chrome for Android (all versions)   
- Firefox for Android (all versions)   
- Opera since 11.0   
- Opera Mobile since 11.1   
- BlackBerry since 7.0   


startXHR()

- IE10+   
- Firefox 3.6 (and earlier)   
- Safari 3.x   
- Android 4.1 to 4.3 (unless Chrome is default browser)   
- Android 3.x   


startIframe()

- IE8  
- IE9  


~~startLongpoll()
- IE6   
- IE7
- Android 2.x
- Anything else not in the preceding list that has Ajax support
~~

~~(none)
- Any browser with JavaScript disabled
~~

~~a Technically since Firefox 6 and Chrome 6, but they have been auto-updating since Firefox 4, and Chrome since it came out
of beta, so you can reasonably expect no one is still using versions that do not support SSE.
~~

书本代码，书本代码，书本代码。

## 参考资料

- [书本代码](https://github.com/DarrenCook/ssebook)
- [eventsource浏览器支持](https://caniuse.com/#feat=eventsource)
- [https://www.w3.org/TR/eventsource/](https://www.w3.org/TR/eventsource/)
- [HTML Living Standard: Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [a polyfill for http://www.w3.org/TR/eventsource/](https://github.com/Yaffle/EventSource)


## 其他参考

- [HTTP server push with WebSocket and SSE](https://www.ibm.com/developerworks/library/wa-http-server-push-with-websocket-sse/)
- [Ajax长轮询与服务器推的长连接的区别是？](https://www.zhihu.com/question/27498235) 
- [商业化示例](http://goeasy.io/cn/demos)



-EOF-


    






