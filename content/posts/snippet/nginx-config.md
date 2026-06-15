---
title: nginx配置参考
description: nginx站点配置参考
author: mxtao
categories: ["snippet"]
tags: ["clash", "mihomo", "nginx"]
date: 2025-12-23
modified: 2026-06-15 10:00:00
---

> 本文内容适用于`nginx-1.26.x`，其他版本可能需要修改适配。

配置文件位于`/etc/nginx`目录，其中核心配置是`/etc/nginx/nginx.conf`，其中的`http`块默认包含`include /etc/nginx/conf.d/*.conf;`和`include /etc/nginx/sites-enabled/*;`指令。

其中站点配置一般存放于`/etc/nginx/sites-available/`目录，当需要启用时，在`/etc/nginx/sites-enabled/`目录中创建配置文件的符号链即可。

站点配置及相关要点可以参考以下内容。

## 常规站点

```conf
# 站点配置: example.com

# HTTP服务
# 访问请求直接重定向到HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name example.com *.example.com;
    return 301 https://$host$request_uri;
}

# HTTPS服务
# 提供静态内容访问(博客、资源等)
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name example.com *.example.com;

    # SSL证书 example.com *.example.com
    # 注: 这组配置放在公共区域是全局生效，放到`server`块中是局部生效
    ssl_certificate     /path/to/cert/example.com/cert.pem; # 该配置项可以是证书也可以是证书链
    ssl_certificate_key /path/to/cert/example.com/key.pem;

    # 站点内容根目录
    root /path/to/site;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 域名分流

```conf
# 站点配置: example.com *.example.com

# 泛域名SSL证书 example.com *.example.com
ssl_certificate     /path/to/cert/example.com/cert.pem;
ssl_certificate_key /path/to/cert/example.com/key.pem;

# [精确匹配] blog.example.com 站点服务
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name blog.example.com;
    root /path/to/blog/root;
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# [精确匹配] resource.example.com 站点服务
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name resource.example.com;
    root /path/to/resource/root;
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# [泛域名匹配] *.example.com 站点服务
# 泛域名匹配优先级比正则匹配高
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

# [正则匹配] cdn-*.example.com 站点服务
# 正则匹配优先级
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ~^cdn-(.+)\.example\.com$;
    root /path/to/resource/root;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> 服务名称匹配优先级：
> 1. 精确匹配：`a.example.com` -> `a.example.com`；
> 2. 前缀通配符匹配：`b.example.com`/`c.example.com` -> `*.example.com`；
> 3. 后缀通配符匹配：`example.com`/`example.net` -> `example.*`；
> 4. 正则匹配：`d1.example.com`/`d2.example.com` -> `~d([0-9]+)\.example\.com$`；
> 5. 默认服务匹配(兜底规则)：`e.api.example.com`/`f.ws.example.com` -> `default_server`/`_`。

## 反向代理

```conf
# 站点配置：proxy.example.com

# 当需要访问其他站点资源时(反向代理其他域名)必须配置域名解析
resolver 8.8.8.8 1.1.1.1 valid=30s;
resolver_timeout 5s;

# 用于支持常规连接和WebSocket连接
map $http_connection $connection_upgrade {
  "~*Upgrade" $http_connection;
  default keep-alive;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    # gRPC反向代理必须启用HTTP2、该指令在不同版本间可能不完全相同
    http2 on;

    server_name proxy.example.com;

    # SSL证书 proxy.example.com
    ssl_certificate     /path/to/cert/example.com/cert.pem;
    ssl_certificate_key /path/to/cert/example.com/key.pem;

    # 常规访问返回403
    location / {
        return 403;
    }

    # 反向代理内部服务(仅接口代理)
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

    # 反向代理内部服务(接口+WebSocket)
    location /ws-path/ {

        # 校验请求参数
        # nginx将X-Token  ->  http_x_token
        if ($http_x_token != "token") {
            return 403;
        }

        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection $connection_upgrade;
        proxy_set_header   Host $host;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_pass         http://127.0.0.1:12345;
    }

    # 反向代理内部服务(gRPC)
    location /<grpc-service-name>/ {
        grpc_pass        grpc://127.0.0.1:12345;
    }

    # [正则匹配+提取]反向代理外部服务(必须有域名解析配置)
    location ~ ^/proxy/([^/]+)/(.*)$ {
        set $target_host    $1;
        set $target_path    $2;

        # https://proxy.example.com/proxy/outside.com/api/load?a=1&b=2&c=3  ->  https://outside.com/api/load?a=1&b=2&c=3
        proxy_pass https://$target_host/$target_path$is_args$args;

        proxy_ssl_server_name on;
        proxy_redirect off;
    }
}

# pxy.example.com 站点服务
# 静态的 pxy.example.com -> dest.example.com 反向代理
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    
    server_name pxy.example.com;
    
    # SSL证书 pxy.example.com
    ssl_certificate     /path/to/cert/example.com/cert.pem;
    ssl_certificate_key /path/to/cert/example.com/key.pem;

    location / {
        proxy_redirect off;
        proxy_ssl_server_name on;
        proxy_pass https://dest.example.com;
    }
}
```
