---
layout: post
title: "How to properly uninstall Service Worker？"
date: 2018-06-01 15:10:43 +0000
comments: true
categories: javascript
statement: true
keywords: Service Worker, cache
---

如何正确地卸载Service Worker？

以下链接， Google Developers Service Worker工作原理：
https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates

但是假如某一天你网站不需要 Service Worker，如何正确地卸载呢？

以下以 create-react-app 为例子:

<!-- more -->

* 千万不要直接从服务器干掉 service-worker.js （sw.js），或者去掉 sw-precache-webpack-plugin 插件直接build。

1. 假如你服务器是增量更新的，
![image](https://user-images.githubusercontent.com/1061012/40846563-8b73ce96-65ec-11e8-8781-e374c38c77ba.png)

那么你的服务器文件service-worker.js永远都在，假如用户之前访问了你的网站，并且用户不清缓存的话，cache就永远都在了，你怎么更新，用户还是访问旧的版本。

2. 你说把你服务器的 service-worker.js 干掉，那么假如用户之前访问过呢？本地有一份service-worker.js，那么按照service-worker工作原理，本地一直生效，不管你网站怎么更新，用户看到的依旧是旧的内容。

service-worker.js

```js

'use strict';

var precacheConfig = [
["/index.html","a16310808c31e9e89b8d72aa2ddb058c"],
["/plugin.dll.0cf858ac.js","7268282b6a4415b541c4658c1478febc"],
["/vendor.dll.830d2c27.js","097dfeec5dda4f277752cb36b5d548ee"]
];
var cacheName = 'sw-precache-v3-sw-precache-webpack-plugin-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, /\.\w{8}\./);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '/index.html';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted(["^(?!\\/__).*"], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});

```

index.js 入口文件

https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/template/src/index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
//----vs-----
serviceWorker.register({
    onUpdate: async (registration) => {
        await registration.update();
        message.info("网站更新完成, 请刷新页面: " + moment().format('YYYY-MM-DD HH:mm:ss'), 0.5, () => {
            window.location.reload();
        });
    },
    onSuccess: () => {}
});



```

假如你引入了serviceWorker文件, 并发布了，


https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/template/src/serviceWorker.js


### 正确做法是：
`serviceWorker.register();` 改成 `serviceWorker.unregister();` 
但是同时千万要记住 要保留  sw-precache-webpack-plugin 去做webpack 构建（目的是为了生成新的service-worker.js，触发更新)。按照人的**既定思维**，既然不要了，那么当然要移除。

假如移除了  sw-precache-webpack-plugin,  你怎么 生成新版本的 service-worker.js，还有，没有新版本 service-worker.js 又怎么会更新你的代码了，这里似乎出现**双重陷阱**，但是当你理解了service-worker.js 生命周期原理后，一切都可以理解。

 
### 最后总结：
在入口加入:

serviceWorker.unregister();

service-worker.js 文件 依旧需要更新。

假如真的不想引入 sw-precache-webpack-plugin 做webpack构建的话，请把服务器上面的
service-worker.js  `precacheConfig` 清空
```js
var precacheConfig = [
];
```


https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#opting-out-of-caching

If you would prefer not to enable service workers prior to your initial production deployment, then remove the call to registerServiceWorker() from src/index.js.

If you had previously enabled service workers in your production deployment and have decided that you would like to disable them for all your existing users, you can swap out the call to registerServiceWorker() in src/index.js first by modifying the service worker import:
```
import { unregister } from './registerServiceWorker';
```

and then call unregister() instead. After the user visits a page that has unregister(), the service worker will be uninstalled. Note that depending on how /service-worker.js is served, it may take up to 24 hours for the cache to be invalidated.


create-react-app 提示的测试服务器
![image](https://user-images.githubusercontent.com/1061012/40872668-b5ae9a72-6684-11e8-9d37-ba7d3fed427e.png)
对service-worker.js会有HTTP缓存，部署简单nginx 服务器进行测试 

```conf
    server {
       listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

       location / {
           root   D:\yourproject\build;
           index  index.html index.htm;
           # proxy_no_cache 1;
           add_header Cache-Control "no-cache";
           try_files $uri $uri/ /index.html;
       }

       location /service\-worker\.js {
            expires -1;
            add_header Pragma "no-cache";
       }
    }

```

```
serviceWorker.register({
    onUpdate: async (registration) => {
        await registration.update(); // 这里很重要
        message.info("网站更新完成, 请刷新页面: " + moment().format('YYYY-MM-DD HH:mm:ss'), 0.5, () => {
            window.location.reload();
        });
    },
    onSuccess: () => {}
});

```


### 延伸阅读：


https://lavas.baidu.com/guide/v2/advanced/service-worker#%E6%B3%A8%E5%86%8C-service-worker-%E6%89%A9%E5%B1%95
注册 Service Worker (扩展)

提示：这部分内容由 Lavas 内部处理，并不需要开发者进行参与，仅仅作为解答开发者疑问的扩展阅读存在。

Service Worker 编写完成后，还需要进行注册才能真正生效。常规的注册代码能够在各类 Service Worker 教程或文章中找到，但在实际项目中有一个不得不考虑的问题，使得我们必须对注册代码进行一些改动，那就是 Service Worker 更新 的问题。

https://github.com/lavas-project/sw-register-webpack-plugin

离线指南
https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network


假如熟悉Service Worker 缓存机制的话，那么为什么要卸载呢 ？


本文 ： https://github.com/icai/icai.github.io/issues/1


-EOF-


