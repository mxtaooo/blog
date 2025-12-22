---
title: nftables网络配置
author: mxtao
categories: ["snippet"]
tags: ["nftables"]
date: 2025-12-10
modified: 2025-12-22 16:00:00
---

Debian某些版本默认的网络/防火墙规则管理组件，此处简要记录配置操作。

规则配置文件一般位于`/etc/nftables.conf`，样例如下：

```conf
#!/usr/sbin/nft -f

# 清空现有规则
flush ruleset

table inet filter {
    chain input {
        type filter hook input priority filter;
        # 允许本机连接
        iifname lo accept
        # 允许已建立和关联的入站连接
        ct state established,related accept
        # 允许ICMP协议请求入站，频率上限每秒一次
        ip protocol icmp limit rate 1/second accept
        # 允许指定端口入站
        tcp dport {22,80,443} accept
        # 允许指定协议入站
        tcp dport {ssh,http,https} accept
        # 丢弃其他入站
        drop
    }
    chain forward {
        type filter hook forward priority filter;
        # 丢弃转发流量
        drop
    }
    chain output {
        type filter hook output priority filter;
        # 放行出站连接
        accept
    }
}
```

相关操作命令

```bash
# 校验配置文件
sudo nft -c -f /etc/nftables.conf

# 加载配置文件
sudo nft -f /etc/nftables.conf

# 检查规则生效情况
sudo nft list ruleset

# 服务启动&配置自启
sudo systemctl start nftables
sudo systemctl enable nftables
```
