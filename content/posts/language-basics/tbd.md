---
title: language basics tbd
description: 语言基础相关的知识整理计划
author: mxtao
categories: ["language basics"]
tags: ["language basics", "TBD"]
date: 2025-05-07
modified: 2025-05-07 14:10:00
draft: true
comments: false
---

## C#

C# language

泛型、上界约束、协变和逆变、

[What's new in C# 9.0](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-9)

C# `DateTime`

`Convert.ToDateTime(string)`/`DateTime.Parse(string)`是转换成本地时间，可调用`DateTime.ToUniversalTime()`方法转换成UTC时间

## Haskell

Haskell Language

[Real World Haskell 中文版](http://cnhaskell.com/index.html)

[huangz1990/real-world-haskell-cn](https://github.com/huangz1990/real-world-haskell-cn)

## Java

https://advancedweb.hu/a-categorized-list-of-all-java-and-jvm-features-since-jdk-8-to-21/

Java Language

> java version & new feature


### 关于字符集

需要用到`java.util.UUID#nameUUIDFromBytes(byte[] bytes)`来生成UUID

参数处直接调用了`String#getBytes`方法获取字节数据

但是结果中发现不少数据生成了同一个UUID

最终确认到，是有些节点的默认字符集是`US_ASCII`，而不是`UTF-8`

因此这些节点上、涉及到了中文字符的`getBytes`，出现了问题

todo .....


## Rust

[The Rust Programming Language](https://doc.rust-lang.org/book/)

[Rust by Example](https://doc.rust-lang.org/stable/rust-by-example/)

--- 

[Rust 程序设计语言](https://kaisery.github.io/trpl-zh-cn/)

## Scala

[Scala 3](https://dotty.epfl.ch/docs/reference/overview.html)

### 语言功能

支持HKT

泛型约束支持约束上界和下界

支持协变和逆变

一个有趣的项目  https://github.com/typelevel/kind-projector

[SCALA FAQS](https://docs.scala-lang.org/tutorials/FAQ/index.html)

[WHERE DOES SCALA LOOK FOR IMPLICITS?](https://docs.scala-lang.org/tutorials/FAQ/finding-implicits.html)

### SCALA REFELECTION

[REFLECTION OVERVIEW](https://docs.scala-lang.org/overviews/reflection/overview.html)

[ACCESSING AND INVOKING MEMBERS OF RUNTIME TYPES](https://docs.scala-lang.org/overviews/reflection/overview.html#accessing-and-invoking-members-of-runtime-types)

https://stackoverflow.com/questions/34612322/dynamically-parse-a-string-and-return-a-function-in-scala-using-reflection-and-i

https://www.programcreek.com/scala/scala.tools.reflect.ToolBox

https://stackoverflow.com/questions/23874281/scala-how-to-compile-code-from-an-external-file-at-runtime

https://stackoverflow.com/questions/7477589/compile-and-execute-scala-code-at-runtime

https://stackoverflow.com/questions/12122939/generating-a-class-from-string-and-instantiating-it-in-scala-2-10/12123609#12123609

### Scala Utils

F# style operators 

Monoid

Functor

Monad

## SQL

<!-- to be fixed -->

[Spark SQL Reference](http://spark.apache.org/docs/latest/sql-ref.html)

## Markdown

Markdown Language

## YAML

[The Official YAML Web Site](https://yaml.org/)
[YAML Ain’t Markup Language (YAML™) Version 1.2 - 3rd Edition, Patched at 2009-10-01](https://yaml.org/spec/1.2/spec.html)

```yaml
# `#`引导注释行
```
