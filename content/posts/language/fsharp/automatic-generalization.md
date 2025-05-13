---
title: F# Automatic Generalization - F# 自动泛化
description: F# Automatic Generalization related issue
categories: ["language"]
tags: ["f#", "generic"]
author: mxtao
date: 2020-05-04
modified: 2020-07-15 20:50:00
---

自动泛化不是预期行为？

```fsharp
let add x y = x + y
// 约束成了`int`，为何不是一个对于`(+)`的静态解析类型


// ------ `inline` 方法才会启动 静态解析类型参数

//  x: ^a -> y: ^b ->  ^c
//    when ( ^a or  ^b) : (static member ( + ) :  ^a *  ^b ->  ^c)
let inline add x y = x + y

let inline add (x: ^a) (y: ^a): ^a when ^a : (static member (+): ^a -> ^a -> ^a) = x + y 
// 这是预期行为

```

```fsharp
/// -----------------------------------
// -- 出现了自动泛化失效现象
type Writer<'a> = 'a * string

// let (>=>=)<'a, 'b, 'c> (m1: 'a -> Writer<'b>) (m2: 'b -> Writer<'c>): ('a -> Writer<'c>) = fun x -> 

//     let (Writer (y, s1)) = Writer t
//     let (Writer (z, s2)) = m2 y
//     Writer (z, s1 + s2)

let (>=>) m1 m2 = fun x ->
    let (y, s1) = m1 x
    let (z, s2) = m2 y
    (z, s1 + s2)

let return_ x = (x, "")

let toUpper (x: string) =  Writer (x.ToUpper(), "toUpper")
let toWords (x: string) = Writer ([x], "toList")

// let a = toUpper >=> toWords

let t1 x = (x |> string, 1.2)
let t2 x = (String.length x, 1.3)

let b = t1 >=> t2

```

一个大乌龙，`inline`标记的函数才会有预期的自动泛化行为
