---
title: nginx配置参考
description: nginx站点配置参考
author: mxtao
categories: ["snippet"]
tags: ["clash", "mihomo", "nginx"]
date: 2025-12-23
modified: 2026-01-09 10:00:00
---

nginx配置文件位于`/etc/nginx`目录，其中核心配置是`/etc/nginx/nginx.conf`，一般默认加载`/etc/nginx/sites-enabled/`目录中的站点配置。

站点配置文件内容可参考以下内容。

```conf
# 站点配置: example.com

# 站点证书 example.com *.example.com
ssl_certificate     /path/to/cert/example.com/cert.pem;
ssl_certificate_key /path/to/cert/example.com/key.pem;

# 支持常规连接和WebSocket连接
map $http_connection $connection_upgrade {
  "~*Upgrade" $http_connection;
  default keep-alive;
}

# HTTP服务 重定向到HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name example.com *.example.com;
    return 301 https://$server_name$request_uri;
}

# example.com 站点服务
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name example.com;

    # 默认跳转到博客站(也可以直接跳转)
    location / {
        #add_header Content-Type 'text/plain; charset=utf-8';
        #return 200 'maybe you are lost, please visit: https://blog.example.com ?';
        return 302 https://example.com/blog;
    }
    location /blog {
        return 301 https://blog.example.com;
    }

    # 反向代理内部业务(仅接口代理)
    location /service-name/ {
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        # 配置方式与实际转发效果如下:
        # 带后缀`/`: https://exmaple.com/service-name/abc/def?g=123&h=456  -> http://127.0.0.1:12345/abc/def?g=123&h=456
        # 无后缀`/`: https://exmaple.com/service-name/abc/def?g=123&h=456  -> http://127.0.0.1:12345/service-name/abc/def?g=123&h=456
        proxy_pass         http://127.0.0.1:12345/;
    }
}

# ws.example.com 站点服务
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ws.example.com;
    location / {
        add_header Content-Type 'text/plain; charset=utf-8';
        return 200 'hello, this is ws.example.com';
    }
    # 反向代理内部业务(接口+WebSocket)
    location /ws-path/ {
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection $connection_upgrade;
        proxy_set_header   Host $host;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_pass         http://127.0.0.1:12345;
    }
}

# grpc.example.com 站点服务
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name grpc.example.com;
    location / {
        add_header Content-Type 'text/plain; charset=utf-8';
        return 200 'hello, this is grpc.example.com';
    }
    # 反向代理内部业务(gRPC)
    location /<grpc-service-name>/ {
        grpc_pass        grpc://127.0.0.1:12345;
    }
}

# blog.example.com 站点服务
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name blog.example.com;
    root /path/to/blog/root;
    location / {
        index index.html;
    }
}

# pxy.example.com 站点服务
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name pxy.example.com;
    location / {
        proxy_redirect off;
        proxy_ssl_server_name on;
        proxy_pass https://jmsnet;
    }
}

# *.example.com 站点服务
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name *.example.com;
    error_page 404 = /error;
    location / {
        add_header Content-Type 'text/plain; charset=utf-8';
        return 200 'hello, goodbye';
    }
    location /error {
        add_header Content-Type 'text/plain; charset=utf-8';
        return 404 'maybe you are lost';
    }
}
```
