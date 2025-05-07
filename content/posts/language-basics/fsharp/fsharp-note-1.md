---
title: F#-Notes-1 Functional Programming
description: F# Functional Programming - F# 函数式编程
categories: ["programming language"]
tags: ["programming language", "f#"]
author: mxtao
date: 2017-07-23
---

# F#-Notes-1 Functional Programming

在目前工作中，和看得见的之后吧。于我而言F#可能终归是一门用的少的语言，只能拿来当作兴趣的那种，而且身边也确实还没碰见对这门语言有兴趣的人，对它的学习和使用也总是会被打断。N久之后，虽然还记得一些思路上的东西，或者语言特性上的可能性，但是语法上的写法反而就这么忘记了，因此在此备忘一下。

此外还有十分重要的一点原因，实在是因为[F# for fun and profit](https://fsharpforfunandprofit.com/)的离线版读到一半之后实在读不下去了（大约2000页，读到1200页左右），在[Understanding Parser Combinators](https://fsharpforfunandprofit.com/parser/)一章最终决定放弃这本书。有一说一，这本书确实很好，也很适合有C#、Java、Python基础的去读。但是对我而言，战线拉得过长了。在这一章节，回想以前的内容，只能有一些大致的印象了，而不是特别有把握地回想起某某某怎样怎样。

也可能是过于急于求成了，想要马上看到效果，欲速则不达。我这本F#的入门书其实看了可能有将近一年了吧？什么时候开始的已经忘记了，可能真的一年多了，到现在忘记了，很正常，毕竟平时并没有在使用。但是再次打开那个将近2000页的PDF也没有时间和勇气了，因此要按照“常规”的方式进行好了。

其实坦白来讲，似乎只需要一个[F# Cheatsheet](http://dungpa.github.io/fsharp-cheatsheet/)就够了，但是担心还是会有什么漏掉的，毕竟自己的F#目前就是个半瓶子水。还是重新来一遍吧。

内容参照《Beginning F# 4.0》进行整理，但是大致看一下这本书的目录，讲道理似乎不怎么样……嗯，同很多谈F#的编程书差不多，过于强调面向对象及命令式编程，而有些忽视F#基因中的味道，甚至对于更高级的内容避而不谈，这对于“关注语言特性”的我来说简直是个噩耗。不过也没有办法，目前这个工作强度，也确实没有大块时间去认真品味它，因此只能从皮毛入手了。算了不要在意这些细节，随缘好了。

也会迟疑，连个`let a = 0`这种水平的东西也要记下来，是不是真的有必要？ 毕竟这东西也太小白了不是。似乎我们对于自己已经会了的东西总是觉得很傻逼，可能是“会者不难、难者不会”，等到忘了还是得回来找，因此还是记下来吧，容易的简单写写就好了。

## Literals

数值这边跟.NET基类库大致一一对应，包括字符串、字符、布尔、有/无符号（长/短）整型，单/双精度浮点型等等。此外F#还自行扩展出了`Microsoft.FSharp.Math.BigInt` `Microsoft.FSharp.Math.BigNum`（在F#中用`bigint` `bignum`）

## Anonymous Functions

匿名函数（相对于具名函数而言），就是木有名字的函数了，也叫 lambda function(λ function)，或简称为lambda。

```fsharp
fun x y -> x + y
```

## Identifiers and `let`/`use` Bindings

面对`let a = 10`这种表达式，很明显，这就是声明变量并初始化嘛。并不是，这是将值绑定到一个标识符，好吧场面上没什么区别的样子？要注意，`a`一旦被绑定，就不可变(因为它没有使用`mutable`显式声明可变)。此外在F#中，所有都是“值(Value)”，数值或者函数值，因此也可以将一个函数绑定到标识符上。

关于绑定函数，可以选择绑定lambda到一个标识符的写法，也可以选择“直接声明函数”式的写法。

一般绑定使用了`let`关键字，但是也有一个`use`关键字，它类似C#中的`using`，用于绑定需要尽快释放的资源。一旦脱离了`use`绑定的标识符的作用域，资源将会被自动释放。

F#中作用域(Scope)是通过缩进控制的，这很类似Python了，不过一般不太需要游标卡尺（吧……）。此外一些基本的东西在此处就可用了，比如内部的作用域可以捕获外部作用域的标识符等等，这很直观了。

```fsharp
let a = 10  // variable
let add = fun x y -> x + y   // anonymous function
let raisePowerTwo x = x ** 2.0  // function
open System.IO
// function to read first line from a file
let readFirstLine filename =
// open file using a "use" binding
    use file = File.OpenText filename
    file.ReadLine()
// call function and print the result
printfn "First line was: %s" (readFirstLine "mytext.txt")
```

## Recursion

递归的话，需要使用`rec`关键字来显示声明此函数是递归的。

```fsharp
// assume x > 0
let rec fib x =
    match x with
    | 1 -> 1
    | 2 -> 1
    | x -> fib (x-1) + fib (x-2)
```

## Operators

F#中操作符分“前缀操作符”和“中缀操作符”，好吧其实就是一元和二元了。操作符本质也是函数的体现，给操作符加上括号之后，就成为了一个函数，就能用应用函数的风格去使用。当然，也可以自定义操作符了，甚至重定义系统中存在的操作符。

```fsharp
1 + 1
(+) 1 1
let add = (+)
let ( +** ) x y = (x + y) * (x + y)
```

## Function Application and Partial Application

应用一个函数的时候，可以一次性给出全部参数，也可以先给出部分参数，最终求值的时候凑齐全部参数，非常灵活。（只针对F#中定义的函数，对于其它非F#语言写的库，如果原生方式使用，必须一次性给出全部参数，而且必须用括号包起来，类似元组。当然，可以用F#包装一下原生方法，使之成为F#的函数）

```fsharp
let add x y = x + y
let result0 = add 4 5
let result1 = add 1 2 | add 3 | add 4

let add1 = add 1
let result2 = add1 2
```

## Pattern Matching

模式匹配是超级超级强大的，思想上转变比较难的话，可以认为这是个牛逼版的`switch`语句。

关于它的花式运用直接看代码就好了，非常直观。

此外关注`function`关键字。

```fsharp
let rec luc x =
    match x with
    | x when x <= 0 -> failwith "value must be greater than 0"
    | 1 -> 1
    | 2 -> 3
    | x -> luc (x - 1) + luc (x - 2)

let booleanToString x =
    match x with false -> "False" | _ -> "True"

let stringToBoolean x =
    match x with
    | "True" | "true" -> true
    | "False" | "false" -> false
    | _ -> failwith "unexpected input"

let myOr b1 b2 =
    match b1, b2 with
    | true, _ -> true
    | _, true -> true
    | _ -> false

// function keyword
let boolToInt = function true -> 1 | false -> 0

let rec concatStringList =
    function
    | head :: tail -> head + concatStringList tail
    | [] -> ""
```

## Control Flow

就是烂大街的`if-else`，一般来说更推荐上文模式匹配的写法。

```fsharp
let result =
    if System.DateTime.Now.Second % 2 = 0 then
        "heads"
    else
        "tails"

let result =
    match System.DateTime.Now.Second % 2 = 0 with
    | true -> "heads"
    | false -> "tails"
```

## Type

F#是一门静态类型的强类型语言，它的的类型推断能力十分强大的，一般来说，如果不是为了特意限制，是不必加上类型限定符的。当然加上之后也无所谓了，下面的例子只是展示用法，并无太大实际意义，尤其是`let`绑定处的类型声明。

```fsharp
let doNothingToAnInt (x: int) = x
let intList = [1; 2; 3]
let (stringList: list<string>) = ["one"; "two"; "three"]
```

## Defining Type

定义类型，在面向对象语言中似乎是语言学习的一个重点所在了，而在F#中，这只是非常小的一个方面了。而且下面要介绍的几个方面也是很小的一部分了。

F#中，类型定义大致分三类，元组/记录类型，联合体类型，类类型（后面讨论，面向对象部分），这里只谈前两个。

+ Tuple and Record Types

    元组和记录型类型定义，没有太多不一样的地方了，看代码就好了

    ```fsharp
    type Name = string
    type Fullname = string * string

    type Organization = { chief: string; indians: string list }
    let wayneManor =
        { chief = "Batman";
            indians = ["Robin"; "Alfred"] }
    ```

+ Union Types

    联合类型，某种程度上来说，类似C中的`union`吧，这个类型在F#中非常常见，与模式匹配互相组合能发挥巨大的作用。

    ```fsharp
    type Volume =
        | Liter of float
        | UsPint of float
        | ImperialPint of float

    let vol1 = Liter 2.5
    let vol2 = UsPint 2.5
    let vol3 = ImperialPint (2.5)

    type Shape =
        | Square of side:float
        | Rectangle of width:float * height:float
        | Circle of radius:float

    let S s =
        match s with
        | Square s -> s * 4.0
        | Rectangle (w, h) -> (w + h) * 2.0
        | Circle r -> System.Math.PI * r * 2.0

    let sq = Square 1.2
    let sq2 = Square(side=1.2)
    let rect3 = Rectangle(height=3.4, width=1.2)
    ```

+ Generic (Type Definitions with Type Parameters)

    类型参数化，或者说，泛型，是一个很普遍的技术了，在保证类型安全的前提下提升了代码复用。语法如下：

    ```fsharp
    type 'a BinaryTree =
        | BinaryNode of 'a BinaryTree * 'a BinaryTree
        | BinaryValue of 'a
    let tree1 =
        BinaryNode(
            BinaryNode ( BinaryValue 1, BinaryValue 2),
            BinaryNode ( BinaryValue 3, BinaryValue 4) )
    type Tree<'a> =
        | Node of Tree<'a> list
        | Value of 'a
    let tree2 =
        Node( [ Node( [Value "one"; Value "two"] ) ;
            Node( [Value "three"; Value "four"] ) ] )
    ```

+ Recursive Type Definitions

    在F#中，对于类型、标识符的声明和使用顺序有严格规定，使用之前，前方必须有其声明。但是对于就是要互相使用的，就要使用特殊的语法进行处理。

    ```fsharp
    // represents an XML attribute
    type XmlAttribute =
        { AttribName: string;
            AttribValue: string; }

    // represents an XML element
    type XmlElement =
        { ElementName: string;
            Attributes: list<XmlAttribute>;
            InnerXml: XmlTree }
    // represents an XML tree
    and XmlTree =
        | Element of XmlElement
        | ElementList of list<XmlTree>  // or: ElementList of XmlTree list
        | Text of string
        | Comment of string
        | Empty
    ```

## Active Patterns

主动匹配，允许我们对于输入的数据进行分类并分类命名，然后结合模式匹配表达式进行分别处理。

主动匹配分为完全主动匹配和部分主动匹配，他们可以在多处定义，然后在某个模式匹配表达式中同时使用上。

+ Complete Active Patterns

    完全主动匹配就是对于输入的输入进行完全的分类，每个类型都显式给出一个名字，它跟部分主动匹配最大的不同就是：保证给出一个值。如下例

    ```fsharp
    open System

    // definition of the active pattern
    let (|MyBoolean|MyInt|MyFloat|MyString|) input =
        let success, res = Boolean.TryParse input
        if success then MyBoolean(res)
        else
            let success, res = Int32.TryParse input
            if success then MyInt(res)
            else
                let success, res = Double.TryParse input
                if success then MyFloat(res)
                else MyString(input)

    let printInputWithType input =
        match input with
        | MyBoolean b -> printfn "Boolean: %b" b
        | MyInt i -> printfn "Int: %i" i
        | MyFloat f -> printfn "Float: %f" f
        | MyString s -> printfn "String: %s" s
    ```

+ Partially Active Patterns

    部分主动匹配可以用于测试某个输入是不是某个类型的值，如果是那么给出`Some(Value)`若不是，那么`None`

    ```fsharp
    let (|Integer|_|) str =
        if str="" then Some(1)
        else None
    let (|Float|_|) str =
        if str="." then Some(1.0)
        else None

    let tem str =
        match str with
        | Integer i -> printf "%d" i
        | Float f -> printf "%f" f
        | _ -> printf "XXXXXX"
    ```

## Units of Measure

测量单位是特意加入到F#的类型系统中的有趣特性。关于它的使用看语法就能明白了。

```fsharp
// define some units of measure
[<Measure>]type liter
[<Measure>]type pint

// define some volumes
let vol1 = 2.5<liter>
let vol2 = 2.5<pint>

// define the ratio of pints to liters
let ratio = 1.0<liter> / 1.76056338<pint>

// a function to convert pints to liters
let convertPintToLiter pints =
    pints * ratio

// perform the conversion and add the values
let newVol = vol1 + (convertPintToLiter vol2)

// stripping off unit of measure (<= F# 3.1)
printfn "The volume is %f" (float vol1)

// using a format placeholder with a unit-of-measure value (>= F# 4.0)
printfn "The volume is %f" vol1
```

## Exceptions and Exception Handling

F#中的异常和异常处理跟C#还是有些不一样的地方的，可以使用`exception`关键字自定义异常，然后使用`raise`关键字触发引发一个异常，也可以使用`failwith`函数替代`raise`关键字。`failwith`函数一般用于引发一个普通的，带有文字描述的异常信息的异常，然后丢到上层去。

捕获异常不同类型，有些类似模式匹配了

此外，F#也支持`try-finally`结构，用于保证某些代码必定会执行（`finally`语句块无法和`with`语句块共存，或者说，没有提供`try-with-finally`语法，一般用`try-finally`嵌套`try-with`）

```fsharp
// define an exception type
exception WrongSecond of int

// list of prime numbers
let primes =
    [ 2; 3; 5; 7; 11; 13; 17; 19; 23; 29; 31; 37; 41; 43; 47; 53; 59 ]

// function to test if current second is prime
let testSecond() =
    try
        let currentSecond = System.DateTime.Now.Second in
        // test if current second is in the list of primes
        if List.exists (fun x -> x = currentSecond) primes then
            // use the failwith function to raise an exception
            failwith "A prime second"
        else
            // raise the WrongSecond exception
            raise (WrongSecond currentSecond)
    with
        // catch the wrong second exception
        WrongSecond x ->
            printf "The current was %i, which is not prime" x

// call the function
testSecond()

// try-finally
// function to write to a file
let writeToFile() =
    // open a file
    let file = System.IO.File.CreateText("test.txt")
    try
        // write to it
        file.WriteLine("Hello F# users")
    finally
        // close the file, this will happen even if
        // an exception occurs writing to the file
        file.Dispose()

// call the function
writeToFile()
```

## Lazy Evaluation

标记为`lazy`的运算一旦被求值，就会将值缓存起来，下次被调用直接使用缓存的值。如果当中存在任何副作用（输出等），也只会体现一次。

```fsharp
let lazySideEffect =
    lazy(
        let temp = 2 + 2
        printfn "%i" temp
        temp)

printfn "Force value the first time: "
let actualValue1 = Lazy.force lazySideEffect
printfn "Force value the second time: "
let actualValue2 = Lazy.force lazySideEffect
```

---

```fsharp
let fibs =
    Seq.unfold
        (fun (x0, x1) ->
            Some(x0, (x1, x0+x1)))
        (1,1)

Seq.take 20 fibs
```