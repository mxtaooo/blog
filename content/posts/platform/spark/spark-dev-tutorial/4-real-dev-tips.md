---
title: 4. 实际开发的注意事项
description: 实际开发的注意事项
author: mxtao
categories: ["spark", "spark development tutorial"]
tags: ["spark", "scala"]
date: 2020-03-09
---

# 实际开发的注意事项

+ [ ] 自研平台
  + [ ] 版本
  + [ ] 认证及资源隔离
  + [ ] 项目部署
+ [ ] 华为
  + [ ] 版本
  + [ ] 认证及资源隔离
  + [ ] 项目部署
+ [ ] 阿里云
+ [ ] 浪潮

---

## 公司平台

### 1. 版本问题

NS平台基础JDK是1.7 Scala版本2.10.x Spark版本2.1.x 开发时应注意API版本

Spark API应该还好，就我们目前的使用和开发方式，一般不太会撞上恰好2.1.x没有该API的情况，若要保证正常，可以下载[spark-2.1.3-bin-hadoop2.6](https://archive.apache.org/dist/spark/spark-2.1.3/spark-2.1.3-bin-hadoop2.6.tgz)作为测试环境（感觉意义不大，因为Scala版本还是高于平台）

注意对于Scala 和 Java的使用，需要换成适配版本进行开发和打包

### 2. 认证及资源分离问题

在公司平台上启动任务需要注意指定用户、指定队列

```bash
spark-shell --master yarn --principal xxx --keytab xxx.keytab --queue xxx
```

### 3. 项目部署

oozie被包装得妈都不认识了，得参考任务调度服务的开发文档。

---

## 华为平台

华为平台是堡垒机操作，似乎防火墙只允许有限的几个机器访问运维界面(或者是因为集群在自己的子网中，在集群外根本找不到目标机器)，因此比较强烈依赖命令行操作

操作华为集群要先加载环境（类似这样的命令）

```bash
source bigdata-env
```

有时候环境中的用户身份还不具有操作集群的权限，还需要换个身份

```bash
kinit -kt xxx.keytab xxx # ???
```

### 1. 版本

印象中华为平台的基础JDK是1.8，Scala版本应该也不是2.10.x这么低，版本问题在华为集群上应该并不严重。印象中不知从哪听了一耳朵，有些地方华为的集群已经是Hadoop3.x，有些应用还需适配

### 2. 认证及资源分离

华为集群对于动手启动的Spark Shell没有启用`dynamic executor`，因此启动一般分配有限的几个executor，任务没什么好并行的当然跑的慢了，所以要记得手动指定executor个数，如下所示

> 注意：手动指定的executor个数必须是基于数据总量和具体任务进行考量，还应当看一下集群当前的状况，是不是资源特别紧张。不能武断地直接指定几百个executor跑自己的事情

```bash
spark-shell --master yarn --num-executors 32
```

### 3. 部署

我记得是HUE界面上拖出来的进行部署的，也可以直接使用oozie进行定时/周期任务部署。华为集群上任务部署跟业界普遍做法比较一致，华为对这块没有进行特别深入的定制和包装

---

## 阿里云

尚未交过学费，似乎变动炒鸡大，貌似只有一个点是这个平台

## 浪潮

还没亲眼见过，听说直接就是原生的一套跑着