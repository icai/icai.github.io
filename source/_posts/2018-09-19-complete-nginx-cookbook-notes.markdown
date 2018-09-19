---
layout: post
title: "Complete NGINX Cookbook notes"
date: 2018-09-19 12:51:43 +0800
comments: true
categories: nginx
statement: true
keywords: nginx, cookbook
---



Complete NGINX Cookbook 首先这本说是可以免费下载的。   

https://www.nginx.com/resources/library/complete-nginx-cookbook/

正题

我们都清楚 O’Reilly Cookbook 类型的书籍的风格，主要行文风格都是提出问题，给出答案并解决问题。

这本说主要分为三部分讲解：

- Part I: Load Balancing and HTTP Caching（负载平衡和HTTP缓存）   
- Part II: Security and Access （安全和访问）   
- Part III: Deployment and Operations （部署和运营）  

最常用到的当然是第一章，负载均衡；十一章，访问控制，如何设置跨域；十三章，https配置等。
相对于开发者而言，我们更多的只需要了解第一部分。第三部分对于开发者没有什么必要，所以就没有记录，有需要的可以自行阅读。


<!-- more -->

- 第一部分：



## 第一章 High-Performance Load Balancing （高性能负载均衡）

1.1 HTTP Load Balancing（http负载均衡）

```
upstream backend {
    server 10.10.12.45:80 weight=1;
    server app.example.com:80 weight=2;
}
server {
    location / {
        proxy_pass http://backend;
    }
}

```
你把当前请求负载到多个server上，同时server可以指定权重（weight）。

更多配置可以访问 https://docs.w3cub.com/nginx/stream/ngx_stream_upstream_module/#upstream 


1.2 TCP Load Balancing （TCP负载均衡）

```
stream {
    upstream mysql_read {
        server read1.example.com:3306 weight=5;
        server read2.example.com:3306;
        server 10.10.12.34:3306 backup;
    }
    server {
        listen 3306;
        proxy_pass mysql_read;
    }
}
```

1.3 Load-Balancing Methods （负载均衡方法）

The following load-balancing methods are available for upstream HTTP, TCP, and UDP pools:

五种方法（指令名称）：

Round robin （ weight=x）
Least connections （least_conn）
Least time （least_time）
Generic hash （hash）
IP hash （ip_hash）

阅读： https://docs.w3cub.com/nginx/stream/ngx_stream_upstream_module/


1.4 Connection Limiting （连接数限制）

```
upstream backend {
    zone backends 64k;
    queue 750 timeout=30s;
    server webserver1.example.com max_conns=25;
    server webserver2.example.com max_conns=15;
}

```


## 第二章 Intelligent Session Persistence  （智能会话持久性）


2.1 Sticky Cookie （粘性Cookie）

You need to bind a downstream client to an upstream server

sticky cookie 指令

```
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    sticky cookie
           affinity
           expires=1h
           domain=.example.com
           httponly
           secure
           path=/;
}

```

2.2 Sticky Learn

You need to bind a downstream client to an upstream server by using an existing cookie.

sticky learn 指令


```
upstream backend {
    server backend1.example.com:8080;
    server backend2.example.com:8081;
    sticky learn
            create=$upstream_cookie_cookiename
            lookup=$cookie_cookiename
            zone=client_sessions:2m;
}
```

2.3 Sticky Routing

提供一个映射修正处理

```
map $cookie_jsessionid $route_cookie {
    ~.+\.(?P<route>\w+)$ $route;
}
map $request_uri $route_uri {
    ~jsessionid=.+\.(?P<route>\w+)$ $route;
}
upstream backend {
    server backend1.example.com route=a;
    server backend2.example.com route=b;
    sticky route $route_cookie $route_uri;
}
```



2.4 Connection Draining

You need to gracefully remove servers for maintenance or other reasons while still serving sessions.

```
curl 'http://localhost/upstream_conf?upstream=backend&id=1&drain=1'
```



## 第五章 Massively Scalable Content Caching （大规模可扩展的内容缓存）


5.1 Caching Zones （缓存区）

You need to cache content and need to define where the cache is stored.



Use the proxy_cache_path directive to define shared memory cache
zones and a location for the content:

```
proxy_cache_path /var/nginx/cache
                keys_zone=CACHE:60m
                levels=1:2
                inactive=3h
                max_size=20g;
proxy_cache CACHE;
```


5.2 Caching Hash Keys

You need to control how your content is cached and looked up.

Use the proxy_cache_key directive, along with variables to define
what constitutes a cache hit or miss:

```
proxy_cache_key "$host$request_uri $cookie_user";
```

5.3 Cache Bypass


Use the proxy_cache_bypass directive with a nonempty or nonzero
value. One way to do this is by setting a variable within location
blocks that you do not want cached to equal 1:

```
proxy_cache_bypass $http_cache_bypass;

```

The configuration tells NGINX to bypass the cache if the HTTP
request header named cache_bypass is set to any value that is not 0.


5.4 Cache Performance (性能)


```
location ~* \.(css|js)$ {
  expires 1y;
  add_header Cache-Control "public";
}
```

5.5 Purging （）

```
map $request_method $purge_method {
    PURGE 1;
    default 0;
}
server {
    ...
    location / {
        ...
        proxy_cache_purge $purge_method;
    }
}

```

---

Part II: Security and Access（安全和访问）

## 第十一章 Controlling Access

11.1 Access Based on IP Address

根据客户端IP设定访问权限

```
location /admin/ {
    deny 10.0.0.1;
    allow 10.0.0.0/20;
    allow 2001:0db8::/32;
    deny all;
}

```

11.2 Allowing Cross-Origin Resource Sharing

跨域资源共享, 这里的OPTIONS 处理可以参考

```
map $request_method $cors_method {
    OPTIONS 11;
    GET 1;
    POST 1;
    default 0;
}
server {
    ...
    location / {
        if ($cors_method ~ '1') {
            add_header 'Access-Control-Allow-Methods' 
            'GET,POST,OPTIONS';
            add_header 'Access-Control-Allow-Origin'
            '*.example.com';
            add_header 'Access-Control-Allow-Headers'
            'DNT,
            Keep-Alive,
            User-Agent,
            If-Modified-Since,
            Cache-Control,
            Content-Type';
        }
        if ($cors_method = '11') {
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}

```


## 第十二章 Limiting Use （限制使用）


12.1 Limiting Connections 
限制连接数

You need to limit the number of connections based on a `predefined key`, such as the client’s IP address.

limit_conn 指令


```
http {
    limit_conn_zone $binary_remote_addr zone=limitbyaddr:10m;
    limit_conn_status 429;
    ...
    server {
        ...
        limit_conn limitbyaddr 40;
        ...
    }
}
```

This configuration creates a shared memory zone named limit 
byaddr. The predefined key used is the client’s IP address in binary
form. The size of the shared memory zone is set to 10 mega‐
bytes. The limit_conn directive takes two parameters: a
limit_conn_zone name, and the number of connections allowed.
The limit_conn_status sets the response when the connections are
limited to a status of 429, indicating too many
requests. The limit_conn and limit_conn_status directives are
valid in the HTTP, server, and location context.


12.2 Limiting Rate

频率

```
http {
    limit_req_zone $binary_remote_addr
        zone=limitbyaddr:10m rate=1r/s;
    limit_req_status 429;
    ...
    server {
        ...
        limit_req zone=limitbyaddr burst=10 nodelay;
        ...
    }
}

```


12.3 Limiting Bandwidth

带宽限制， 自动降速

```
location /download/ {
    limit_rate_after 10m;
    limit_rate 1m;
}
```


## 第十三章 Encrypting


13.1 Client-Side Encryption


You need to encrypt traffic between your NGINX server and the client.

加密传输，SSL modules such as  the `ngx_http_ssl_module` or `ngx_stream_ssl_module`


```
http { # All directives used below are also valid in stream
    server {
        listen 8433 ssl;
        ssl_protocols TLSv1.2;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_certificate /usr/local/nginx/conf/cert.pem;
        ssl_certificate_key /usr/local/nginx/conf/cert.key;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
    }
}

```

更新阅读  
https://docs.w3cub.com/nginx/http/ngx_http_ssl_module/#example   
https://docs.w3cub.com/nginx/stream/ngx_stream_ssl_module/#example


13.2 Upstream Encryption

You need to encrypt traffic between NGINX and the upstream service 
and set specific negotiation rules for compliance regulations 
or if the upstream is outside of your secured network.


```
location / {
    proxy_pass https://upstream.example.com;
    proxy_ssl_verify on;
    proxy_ssl_verify_depth 2;
    proxy_ssl_protocols TLSv1.2;
}
```



## 第十四章 HTTP Basic Authentication

分为两个步骤，创建密码文件， 设定nginx 配置

14.1 Creating a User File

文件格式

```
# comment
name1:password1
name2:password2:comment
name3:password3

```

或者通过以下命令（先安装openssl）

```
openssl passwd MyPassword1234
```

14.2 Using Basic Authentication



```
location / {
    auth_basic "Private site";
    auth_basic_user_file conf.d/passwd;
}

```


## 第十五章 HTTP Authentication Subrequests


15.1 Authentication Subrequests

Use the http_auth_request_module to make a request to the
authentication service to verify identity before serving the request:

```
location /private/ {
    auth_request /auth;
    auth_request_set $auth_status $upstream_status;
}
location = /auth {
    internal;
    proxy_pass http://auth-server;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
}
```


## 第十六章  Secure Links


16.1 Securing a Location

Use the secure link module and the secure_link_secret directive
to restrict access to resources to users who have a secure link:

```
location /resources {
    secure_link_secret mySecret;
    if ($secure_link = "") { return 403; }
    rewrite ^ /secured/$secure_link;
}
location /secured/ {
    internal;
    root /var/www;
}
```

16.2 Generating a Secure Link with a Secret (生成一个安全链接)

You need to generate a secure link from `your application` using a
secret.


The `secure link module` in NGINX accepts the hex digest of an `md5`
hashed string, where the string is a concatenation of the URI path
and the secret. 

```
echo -n 'index.htmlmySecret' | openssl md5 -hex

(stdin)= a53bee08a4bf0bbea978ddf736363a12
```
Python示例

```py
import hashlib
hashlib.md5.(b'index.htmlmySecret').hexdigest()

'a53bee08a4bf0bbea978ddf736363a12
```


Now that we have this hash digest, we can use it in a URL. Our
example will be for www.example.com making a request for the
file `/var/www/secured/index.html` through our /resources location.
Our full URL will be the following:
```
www.example.com/resources/a53bee08a4bf0bbea978ddf736363a12/\
index.html
```


16.3 Securing a Location with an `Expire Date`


```
location /resources {
    root /var/www;
    secure_link $arg_md5,$arg_expires;
    secure_link_md5 "$secure_link_expires$uri$remote_addr
    mySecret";
    if ($secure_link = "") { return 403; }
    if ($secure_link = "0") { return 410; }
}
```

secure_link directive 有两个参数，第一个参数是保存md5哈希的变量；第二个参数是保存链接的到期时间（Unix epoch time format）


16.4 Generating an Expiring Link

创建一个时间戳（Unix epoch time format）

```bash
date -d "2020-12-31 00:00" +%s --utc
# 1609372800
```


Next you’ll need to concatenate your hash string to match the string
configured with the secure_link_md5 directive. In this case, our
string to be used will be 1293771600/resources/
index.html127.0.0.1 mySecret. The md5 hash is a bit different
than just a hex digest. It’s an md5 hash in binary format, base64 enco‐
ded, with plus signs (+) translated to hyphens (-), slashes (/) trans‐
lated to underscores (_), and equal (=) signs removed. The following
is an example on a Unix system:

```bash
 echo -n '1609372800/resources/index.html127.0.0.1 mySecret' \
| openssl md5 -binary \
| openssl base64 \
| tr +/ -_ \
| tr -d =
# TG6ck3OpAttQ1d7jW3JOcw
```

Now that we have our hash, we can use it as an argument along with
the expire date:

/resources/index.html?md5=TG6ck3OpAttQ1d7jW3JOcw&expires=1609372800'


```py

from datetime import datetime, timedelta
from base64 import b64encode
import hashlib
# Set environment vars
resource = b'/resources/index.html'
remote_addr = b'127.0.0.1'
host = b'www.example.com'
mysecret = b'mySecret'
# Generate expire timestamp
now = datetime.utcnow()
expire_dt = now + timedelta(hours=1)
expire_epoch = str.encode(expire_dt.strftime('%s'))
# md5 hash the string
uncoded = expire_epoch + resource + remote_addr + mysecret
md5hashed = hashlib.md5(uncoded).digest()
# Base64 encode and transform the string
b64 = b64encode(md5hashed)
unpadded_b64url = b64.replace(b'+', b'-')\
    .replace(b'/', b'_')\
    .replace(b'=', b'')
# Format and generate the link
linkformat = "{}{}?md5={}?expires={}"
securelink = linkformat.format(
    host.decode(),
    resource.decode(),
    unpadded_b64url.decode(),
    expire_epoch.decode()
)
print(securelink)

```







## 第二十章 Practical Security Tips

20.1 HTTPS Redirects

`Use a rewrite to send all HTTP traffic to HTTPS:`


```
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 301 https://$host$request_uri;
}
```


20.2 Redirecting to HTTPS Where SSL/TLS Is Terminated Before NGINX

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    if ($http_x_forwarded_proto = 'http') {
        return 301 https://$host$request_uri;
    }
}
```

This configuration is very much like HTTPS redirects. However, in
this configuration we’re only redirecting `if the header X-Forwarded-Proto` is equal to HTTP.



20.3 HTTP Strict Transport Security

You need to instruct browsers to `never` send requests over HTTP


Use the HTTP Strict Transport Security (HSTS) enhancement by
setting the Strict-Transport-Security header:

```
add_header Strict-Transport-Security max-age=31536000;

```

This configuration sets the Strict-Transport-Security header to a
max age of a year. This will instruct the browser to always do an
internal redirect when HTTP requests are attempted to this domain,
so that `all requests will be made over HTTPS`.


20.4 Satisfying Any Number of Security Methods

Use the satisfy directive

```
location / {
    satisfy any;
    allow 192.168.1.0/24;
    deny all;
    auth_basic "closed site";
    auth_basic_user_file conf/htpasswd;
}
```




本文： [https://github.com/icai/nginxcooking](https://github.com/icai/nginxcooking)


-EOF-




