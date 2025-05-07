---
title: 2. Scala Intro
description: Scala快速入门
author: mxtao
categories: ["spark", "spark development tutorial"]
tags: ["spark", "scala"]
date: 2020-03-09
---

# Scala Intro

[Scala](https://scala-lang.org)是一门功能特别丰富的编程语言，我们涉及到的只是其一个较小的子集，此处列出相关文档，可以自行学习

Scala官方文档也提供了中文版，但有的翻译感觉还是有点生硬。此处将仅给出中文版的URL，如果要访问英文版，将URL中`zh-cn`去掉即可。

可以先看一下[A Scala Tutorial for Java Programmers](https://docs.scala-lang.org/tutorials/scala-for-java-programmers.html)，这篇文档没有简体中文，有繁体中文版，但是很多概念跟我们说的名字不一样，要不直接看英文版得了。

官方提供了[Tour of Scala](https://docs.scala-lang.org/zh-cn/tour/tour-of-scala.html)系列文档来介绍语言的核心功能，这里列出这系列文档的子集，因为我们用到的也仅是个子集

+ [基础](https://docs.scala-lang.org/zh-cn/tour/basics.html): 最基本的语言基础，告诉我们表达式怎么写、函数怎么定义、类如何定义等
+ [统一类型](https://docs.scala-lang.org/zh-cn/tour/unified-types.html): 介绍了Scala类型层次结构
+ [类](https://docs.scala-lang.org/zh-cn/tour/classes.html): 定义一个类及其成员
+ [元组](https://docs.scala-lang.org/zh-cn/tour/tuples.html): 需要了解是什么，怎么用
+ [高阶函数](https://docs.scala-lang.org/zh-cn/tour/higher-order-functions.html): 好像有点厉害，只要能理解了函数可以作为参数和返回值即可
+ [单例对象](https://docs.scala-lang.org/zh-cn/tour/singleton-objects.html): 这个概念最好搞明白
+ [泛型类](https://docs.scala-lang.org/zh-cn/tour/generic-classes.html): 泛型使用
+ [类型推断](https://docs.scala-lang.org/zh-cn/tour/type-inference.html): 由此，我们很多地方不需要写类型
+ [包和导入](https://docs.scala-lang.org/zh-cn/tour/packages-and-imports.html): 跟java差不多

以上是我们用到的，搞懂以上概念，目前我们写的大部分代码看懂应该没什么问题，如果有时间还是建议把全系列翻一遍

---

[Scala语法速查](https://docs.scala-lang.org/zh-cn/cheatsheets/index.html)