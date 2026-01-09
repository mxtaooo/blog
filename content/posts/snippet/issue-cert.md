---
title: 证书颁发脚本
description: 使用`openssl`基于现有CA颁发终端证书的bash脚本
author: mxtao
categories: ["snippet"]
tags: ["bash", "openssl"]
date: 2025-08-21
modified: 2026-01-09 10:00:00
---

> 脚本应当在`Bash`环境中执行，且必须部署`faketime`、`openssl`命令行工具

> 脚本参数
> 1. `CERT_HOST` 颁发证书的目标地址/名称，支持多个值，空格分隔即可 `localhost 127.0.0.1 ::1`
> 2. `STRATEGY` 本机证书校验及颁发策略，对主机自身的地址及名称的处理原则，不涉及`CERT_HOST`变量(变量中指定的地址及名称保证进行校验及颁发)。策略支持以下类型：
>    + `BASIC`: 验证当前证书对`localhost`/`127.0.0.1`颁发即可,若验证不通过,颁发`localhost`/`127.0.0.1`的证书(构建镜像时默认使用该配置)
>    + `NORMAL`: 验证当前证书对`localhost`/`127.0.0.1`颁发即可,若验证不通过,颁发`<hostname>`/`<hostip>`/`localhost`/`127.0.0.1`的证书(启动时建议使用该配置)
>    + `STRICT`: 验证当前证书对`<hostname>`/`<hostip>`/`localhost`/`127.0.0.1`颁发,若验证不通过,颁发`<hostname>`/`<hostip>`/`localhost`/`127.0.0.1`的证书

> 2025-12-15: 已颁发证书校验部分更新为`openssl verify`命令，支持泛域名，支持各种IPv6格式，修复基于文本匹配的校验不严谨问题

```bash
#!/bin/bash

## 不容忍错误(任何命令出错都退出脚本)
set -e

########################## [打印日志] ##########################
## 日志记录的模块名称
MODULE_NAME=cert-util
## ANSI字符颜色转义
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
## 重置所有字符格式
RESET='\033[0m'

## 日志记录方法组
function log() {
    level=$1
    format=$2
    message=${@:3}
    time=$(date "+%F %T")
    echo -e "$format[$time][$MODULE_NAME] $level - $message$RESET"
}
function success()  { log "SUCCESS" $GREEN $*; }
function info()     { log "INFO   " $RESET $*; }
function warn()     { log "WARN   " $YELLOW $*; }
function error()    { log "ERROR  " $RED $*; }
#################################################################

if [[ -z "$STRATEGY" ]]; then
    warn "未设置证书颁发策略类型,指定为默认值[NORMAL]"
    STRATEGY=NORMAL
fi

case "$STRATEGY" in
"BASIC")
    info "证书颁发策略类型为[$STRATEGY],仅验证/颁发localhost/127.0.0.1"
    ;;
"NORMAL")
    info "证书颁发策略类型为[$STRATEGY],将验证localhost/127.0.0.1,颁发hostname/hostip/localhost/127.0.0.1"
    ;;
"STRICT")
    info "证书颁发策略类型为[$STRATEGY],将验证/颁发本机hostname/hostip/localhost/127.0.0.1"
    ;;
*)
    error "不支持的证书颁发策略类型[$STRATEGY],退出脚本"
    exit 1
    ;;
esac

## 脚本所在目录
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

## 是否需要颁发证书
ISSUE_CERT=FALSE

## TODO: 在此处指定CA证书
CA_CERT_ROOT="$SCRIPT_DIR/ca-cert"
## 证书颁发机构(此处推荐使用Server CA, 信任链大致为: 根证书(Root CA) -> 服务器中间证书(Server CA) -> 服务器证书(待颁发))
CA_CRT="$CA_CERT_ROOT/???.crt"
CA_KEY="$CA_CERT_ROOT/???.key"
CA_KEY_PASS="$CA_CERT_ROOT/???.key.pass"

## 待颁发的证书
SERVER_CERT_ROOT="$SCRIPT_DIR/server-cert"
SERVER_CERT_CSR_CONF="$SERVER_CERT_ROOT/server.conf" # 证书颁发请求配置
SERVER_CERT_CSR="$SERVER_CERT_ROOT/server.csr"  # 证书颁发请求
SERVER_CERT_CRT="$SERVER_CERT_ROOT/server.crt"  # 证书(通常是PEM格式)
SERVER_CERT_KEY="$SERVER_CERT_ROOT/server.key"  # 证书私钥
SERVER_CERT_CHAIN="$SERVER_CERT_ROOT/fullchain.crt"  # 证书链(通常是PEM格式)
SERVER_CERT_P12="$SERVER_CERT_ROOT/server.p12"  # 证书(PKCS12格式)
SERVER_CERT_P12_PASS="$SERVER_CERT_ROOT/server.p12.pass"  # 证书密钥(仅适用于PKCS12格式)

SERVER_CERT_COMMON_NAME={$COMMON_NAME:-localhost}

## 校验现有证书有效性(是否对给定的名称/地址有效;是否处于有效期)
if [[ -f "$SERVER_CERT_CRT" ]]; then
    if [[ -n "$CERT_HOST" ]]; then
        info "已设置环境变量[CERT_HOST]=[$CERT_HOST],将逐个验证是否已颁发证书"
        for host in $CERT_HOST;
        do
            if [[ $host =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ || $host == *:* ]]; then
                # 简单的IPv4正则，将4组最长3位的数字视为IPv4地址
                # 包含冒号视为IPv6地址
                if openssl verify -verify_ip "$host" "$SERVER_CERT_CRT" > /dev/null 2>&1; then
                    success "[√]已颁发地址证书[$host]"
                else
                    error "[×]未颁发地址证书[$host]"
                    ISSUE_CERT=TRUE
                fi
            else
                # 其余的视为名称/域名
                if openssl verify -verify_hostname "$host" "$SERVER_CERT_CRT" > /dev/null 2>&1; then
                    success "[√]已颁发名称证书[$host]"
                else
                    error "[×]未颁发名称证书[$host]"
                    ISSUE_CERT=TRUE
                fi
            fi
        done
    else
        info "未设置环境变量[CERT_HOST],跳过证书颁发目标验证"
    fi
    ## 创建&启动容器时通常是随机主机名及地址，构建时基本不可能完整颁发主机证书，只能颁发出localhost/127.0.0.1
    info "验证本机名称/IP是否已颁发证书"
    if [[ "$STRATEGY" = "STRICT" ]]; then
        info "当前策略类型为[$STRATEGY],将验证本机hostname/hostip/localhost/127.0.0.1"
        LOCALHOST="$(hostname -f) localhost $(hostname -I) 127.0.0.1"
    else
        info "当前策略类型为[$STRATEGY],仅验证localhost/127.0.0.1"
        LOCALHOST="localhost 127.0.0.1"
    fi
    for host in $LOCALHOST;
    do
        if [[ $host =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ || $host == *:* ]]; then
            # 简单的IPv4正则，将4组最长3位的数字视为IPv4地址
            # 包含冒号视为IPv6地址
            if openssl verify -verify_ip "$host" "$SERVER_CERT_CRT" > /dev/null 2>&1; then
                success "[√]已颁发地址证书[$host]"
            else
                error "[×]未颁发地址证书[$host]"
                ISSUE_CERT=TRUE
            fi
        else
            # 其余的视为名称/域名
            if openssl verify -verify_hostname "$host" "$SERVER_CERT_CRT" > /dev/null 2>&1; then
                success "[√]已颁发名称证书[$host]"
            else
                error "[×]未颁发名称证书[$host]"
                ISSUE_CERT=TRUE
            fi
        fi
    done
    info "证书有效期范围[$(date -d "$(openssl x509 -in "$SERVER_CERT_CRT" -noout -startdate | cut -d= -f2)" +'%F %T'), $(date -d "$(openssl x509 -in "$SERVER_CERT_CRT" -noout -enddate | cut -d= -f2)" +'%F %T')]"
    START=$(date -d "$(openssl x509 -in "$SERVER_CERT_CRT" -noout -startdate | cut -d= -f2)" +%s)
    END=$(date -d "$(openssl x509 -in "$SERVER_CERT_CRT" -noout -enddate | cut -d= -f2)" +%s)
    NOW=$(date -u +%s)
    if [[ "$START" -le "$(date -u +%s)" && "$(date -d '+1 month' -u +%s)" -le "$END" ]]; then
        success "当前时间(及一个月内)都处于证书有效时间范围"
    else
        error "当前时间及一个月内将不在证书有效时间范围"
        ISSUE_CERT=TRUE
    fi
else
    warn "证书文件[$SERVER_CERT_CRT]不存在,将颁发证书"
    ISSUE_CERT=TRUE
fi

if [[ $ISSUE_CERT = "FALSE" ]]; then
    success "默认证书可用,无需重新颁发"
    exit 0
fi

if [[ -d "$SERVER_CERT_ROOT" ]]; then
    SERVER_CERT_ROOT_BAK="${SERVER_CERT_ROOT%/}-bak-$(date +%Y%m%d%H%M%S)"
    warn "重新颁发证书,现有证书[$SERVER_CERT_ROOT]将备份为[$SERVER_CERT_ROOT_BAK]"
    mv "$SERVER_CERT_ROOT" "$SERVER_CERT_ROOT_BAK"
fi

info "证书相关文件将保存到[$SERVER_CERT_ROOT]目录"
mkdir -p "$SERVER_CERT_ROOT"

## 明确指定证书有效期需要ca相关配置,比较麻烦,因此下面用faketime做了简易版实现
## 证书有效期：本月第一天凌晨开始，十年内有效
# CERT_START=$(date +"%Y%m01000000Z")
# CERT_END=$(date -d "$(date +%Y-%m-01) +10 years" +"%Y%m%d235959Z")

## 快捷颁发证书(仅对CN(Common Name)颁发证书,无法颁发SAN(Subject Alt Name,多个IP及域名),目前浏览器优先验证SAN,CN作为fallback)
# SUBJECT="/C=CN/ST=Shandong/L=Qingdao/O=Shandong R&D Center/CN=host.domain"
# openssl req -new -nodes -newkey rsa:2048 -keyout "$SERVER_CERT_KEY" -out "$SERVER_CERT_CSR" -subj "$SUBJECT"
# openssl x509 -req -in "$SERVER_CERT_CSR" -out "$SERVER_CERT_CRT" -outform PEM -CA "$CA_CRT" -CAkey "$CA_KEY" -passin "file:$CA_KEY_PASS" -CAcreateserial -days 3650 -sha256
## 生成配置文件,用于生成CSR(证书颁发请求文件)
## 注: 文件内容没有缩进是特意的，避免程序读取出现问题，也避免用sed消除行前空白(最后的EOF前不允许有空白，否则后续命令也被视为文本内容)
cat <<EOF > "$SERVER_CERT_CSR_CONF"
[req]
default_bits = 2048
default_md = sha256
encrypt_key = no
prompt = no
distinguished_name = dn
req_extensions = v3_req

[dn]
C = CN
ST = Shandong
L = Qingdao
O = Shandong R&D Center
OU = Qingdao R&D Center
CN = $SERVER_CERT_COMMON_NAME

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
# DNS.1 = localhost
# IP.1 = 127.0.0.1
# IP.2 = ::1
EOF

if [[ -n "$CERT_HOST" ]]; then
    info "已设置变量[CERT_HOST]=[$CERT_HOST],将颁发证书(配置为CSR中的SAN)"
else
    CERT_HOST=""
    warn "未设置变量[CERT_HOST],将仅为默认名称/IP颁发证书"
fi
if [[ "$STRATEGY" = "BASIC" ]]; then
    info "当前策略类型为[$STRATEGY],仅为默认本机名称/IP(localhost/127.0.0.1/::1)颁发证书"
    HOSTS="localhost 127.0.0.1 ::1 $CERT_HOST"
else
    info "当前策略类型为[$STRATEGY],将为本机名称/IP(<hostname>/<host-ip>/localhost/127.0.0.1/::1)颁发证书"
    HOSTS="$(hostname -f) localhost $(hostname -I) 127.0.0.1 ::1 $CERT_HOST"
fi

HOSTS=$(echo "$HOSTS" | xargs | tr " " "\n" | sort -u | tr "\n" " ")
info "待颁发证书的名称/IP(去重+排序): $HOSTS"
NAMES=""
IPS=""
info "基于简易规则快速判断目标类型(IPv4/IPv6/Name)"
for host in $HOSTS;
do
    if [[ $host =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
        # 简单的IPv4正则，将4组最长3位的数字视为IPv4地址
        info " >> IPv4: $host"
        IPS="$host $IPS"
    elif [[ $host == *:* ]]; then
        # 包含冒号视为IPv6地址
        info " >> IPv6: $host"
        IPS="$host $IPS"
    else
        # 其余的视为名称/域名
        info " >> Name: $host"
        NAMES="$host $NAMES"
    fi
done

info "将为以下名称颁发证书(配置为CSR中的SAN): $NAMES"
i=1
for name in $NAMES;
do
    info "DNS.$i = $name >> $SERVER_CERT_CSR_CONF"
    echo "DNS.$i = $name" >> "$SERVER_CERT_CSR_CONF"
    i=$((i+1))
done

info "将为以下IP颁发证书(配置为CSR中的SAN): $IPS"
i=1
for ip in $IPS;
do
    info "IP.$i = $ip >> $SERVER_CERT_CSR_CONF"
    echo "IP.$i = $ip" >> "$SERVER_CERT_CSR_CONF"
    i=$((i+1))
done

info "生成CSR(证书颁发请求)"
openssl req -new -config "$SERVER_CERT_CSR_CONF" -keyout "$SERVER_CERT_KEY" -out "$SERVER_CERT_CSR"

if command -v faketime > /dev/null 2>&1; then
    if [[ "$(date +%d)" = "01" ]]; then
        CERT_START="$(date -d '-1 month' +%Y-%m-01) 00:00:00"
        warn "当前日期是[$(date +%Y-%m-%d)],为避免时区问题导致证书无效,生效开始时间设为上个月[$(date -d '-1 month' +%Y-%m-%d)]"
    else
        CERT_START="$(date +%Y-%m-01) 00:00:00"
    fi
    info "颁发证书，自[$CERT_START(UTC)]起生效，有效期十年(用faketime控制有效期,启用X509v3扩展以支持SAN)"
    TZ=UTC faketime "$CERT_START" openssl x509 -req -in "$SERVER_CERT_CSR" -extfile "$SERVER_CERT_CSR_CONF" -extensions "v3_req" -out "$SERVER_CERT_CRT" -outform PEM -CA "$CA_CRT" -CAkey "$CA_KEY" -passin "file:$CA_KEY_PASS" -CAcreateserial -days 3650 -sha256
else
    info "颁发证书，立即生效，有效期十年(启用X509v3扩展以支持SAN)"
    openssl x509 -req -in "$SERVER_CERT_CSR" -extfile "$SERVER_CERT_CSR_CONF" -extensions "v3_req" -out "$SERVER_CERT_CRT" -outform PEM -CA "$CA_CRT" -CAkey "$CA_KEY" -passin "file:$CA_KEY_PASS" -CAcreateserial -days 3650 -sha256
fi

success "证书颁发完成,证书信息如下:"
openssl x509 -in "$SERVER_CERT_CRT" -noout -text

info "生成证书链"
cat "$SERVER_CERT_CRT" "$CA_CRT" > "$SERVER_CERT_CHAIN"

info "生成证书密钥(PKCS12)"
cat /proc/sys/kernel/random/uuid > $SERVER_CERT_P12_PASS
info "生成证书(PKCS12)"
openssl pkcs12 -export -in "$SERVER_CERT_CHAIN" -inkey "$SERVER_CERT_KEY" -out "$SERVER_CERT_P12" -name "$SERVER_CERT_COMMON_NAME" -password "file:$SERVER_CERT_P12_PASS"

success "证书(PEM): $SERVER_CERT_CRT"
success "私钥: $SERVER_CERT_KEY"
success "证书链(PEM): $SERVER_CERT_CHAIN"
```
