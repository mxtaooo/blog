---
title: F#-Notes-2 Imperative Programming
description: F# Imperative Programming - F# 命令式编程
categories: ["language"]
tags: ["f#"]
author: mxtao
date: 2017-10-16
---

# F#-Notes-2 Imperative Programming

F#不仅可以用于纯函数式编程，也可用于命令式编程。其实对于某些问题，命令式编程是一个十分行之有效的做法。

## `unit` Type

对于某些方法，它不需要传入参数，也不会返回任何值，传入的参数和和返回值类型都是`unit`，有点类似C#中的`void`和CLR中的`System.Void`。对于函数式编程来说，如果一个函数没有接受值也没有返回值，那么它什么也没做；但是对于命令式编程，我们需要意识到副作用的存在，所以这类函数依旧有其作用的。`unit`是字面量`()`的类型，因此如果一个函数不接受值，不返回值，那么只需要在参数处和返回值处放上这它就好了。如下所示

```fsharp
let aFunction () = ()
// val: aFunction: unit -> unit
aFunction ()
```

也可以显式忽略某个函数的值

```fsharp
aFunc() |> ignore
```

## The `mutable` Keyword

```fsharp
let mutable word = "Hello"
word <- "World" // type should be same
```

## Defining Mutable Records

```fsharp
type MutableRecord = {first: string; mutable second: string}
let tem = {first= ""; second=""}
tem.second <- ""
```

## The Reference Type

F# 4.0 之前不能直接将`mutable`的值捕获到闭包里面

+ `!` 取值
+ `:=` 赋值

```fsharp
let totalArray () =
    // define an array literal
    let array = [| 1; 2; 3 |]
    // define a counter
    let total = ref 0
    // loop over the array
    for x in array do
        // keep a running total
        total := !total + x
    // print the total
    printfn "total: %i" !total

totalArray()
```

## Array

```fsharp
// define an array literal
let rhymeArray =
    [|  "Went to market";
        "Stayed home";
        "Had roast beef";
        "Had none" |]

// unpack the array into identifiers
let firstPiggy = rhymeArray.[0]
let secondPiggy = rhymeArray.[1]
let thirdPiggy = rhymeArray.[2]
let fourthPiggy = rhymeArray.[3]

// update elements of the array
rhymeArray.[0] <- "Wee,"
rhymeArray.[1] <- "wee,"
rhymeArray.[2] <- "wee,"
rhymeArray.[3] <- "all the way home"

```

```fsharp
// 交错数组
// define a jagged array literal
let jagged = [| [| "one" |] ; [| "two" ; "three" |] |]
// unpack elements from the arrays
let singleDim = jagged.[0]
let itemOne = singleDim.[0]
let itemTwo = jagged.[1].[0]

// print some of the unpacked elements
printfn "%s %s" itemOne itemTwo
```

```fsharp
// 数组初始化
// an array of characters
let chars = [| '1' .. '9' |]

// an array of tuples of number, square
let squares =
    [| for x in 1 .. 9 -> x, x*x |]
// print out both arrays
printfn "%A" chars
printfn "%A" squares

// 数组切片
// 切片语法也可用于List
let arr = [|1; 3; 5; 7; 11; 13|]
let middle = arr.[1..4] // [|3; 5; 7; 11|]

let start = arr.[..3] // [|1; 3; 5; 7|]
let tail = arr.[1..] // [|3; 5; 7; 11; 13|]

let ocean = Array2D.create 100 100 0
// Create a ship:
for i in 3..6 do
    ocean.[i, 5] <- 1
// Pull out an area hit by a 'shell':
let hitArea = ocean.[2..5, 2..5]

// We can see a rectangular area by 'radar':
let radarArea = ocean.[3..4, *]
```

## Control Flow

```fsharp
if x = 1 then
    printfn "eq"
else
    printfn "ne"

// an array for words
let words = [| "Red"; "Lorry"; "Yellow"; "Lorry" |]

// use a for loop to print each element
for word in words do
    printfn "%s" word

for index = 0 to Array.length words - 1 do
    printfn "%s" words.[index]

for index = Array.length words downto 0 do
    printfn "%s" words.[index]

let mutable tem = 10
while (tem > 0) do
    tem <- tem - 1

// Count upwards:
for i in 0..10 do
    printfn "%i green bottles" i

// Count downwards:
for i in 10..-1..0 do
    printfn "%i green bottles" i

// Count upwards in tens
for i in 0..10..100 do
    printfn "%i green bottles" i
```

## Calling Static Methods and Properties from .NET Libraries

```fsharp
// calling static method
ClassName.MethodName(arg1, arg2, arg3)

// or in a curried way
let methodName arg1 arg2 arg3 =
    ClassName.MethodName(arg1, arg2, arg3)

let temMethod arg1 =
    methodName arg1

// named paramaters
open System.IO

// open a file using named arguments
let file = File.Open(path = "test.txt",
    mode = FileMode.Append,
    access = FileAccess.Write,
    share = FileShare.None)

// close it!
file.Close()
```

## Using Objects and Instance Members from .NET Libraries

```fsharp
open System.IO
// file name to test
let filename = "test.txt"
// bind file to an option type, depending on whether
// the file exist or not
let file =
    if File.Exists(filename) then
        Some(new FileInfo(filename, Attributes = FileAttributes.ReadOnly))
    else
        None
```

```fsharp
open System
// how to wrap a method that take a delegate with an F# function
// the <_> means don't care the type of the Predicate's argument
let findIndex f arr = Array.FindIndex(arr, new Predicate<_>(f))
// define an array literal
let rhyme = [| "The"; "cat"; "sat"; "on"; "the"; "mat" |]
// print index of the first word ending in 'at'
printfn "First word ending in 'at' in the array: %i"
    (rhyme |> findIndex (fun w -> w.EndsWith("at")))
```

## Using Indexers from .NET Libraries

```fsharp
open System.Collections.Generic
// create a ResizeArray
let stringList =
    let temp = new ResizeArray<string>()
    temp.AddRange([| "one"; "two"; "three" |]);
    temp
// unpack items from the resize array
let itemOne = stringList.Item(0)
let itemTwo = stringList.[1]
// print the unpacked items
printfn "%s %s" itemOne itemTwo
```

## Working with Events from .NET Libraries

```fsharp
open System.Timers
let timedMessages() =
    // define the timer
    let timer = new Timer(Interval = 3000.0,
        Enabled = true)
    // a counter to hold the current message
    let mutable messageNo = 0

    // the messages to be shown
    let messages = [ "bet"; "this"; "gets";
            "really"; "annoying";
            "very"; "quickly" ]
    // add an event to the timer
    timer.Elapsed.Add(fun _ ->
        // print a message
        printfn "%s" messages.[messageNo]
        messageNo <- messageNo + 1
        if messageNo = messages.Length then
            timer.Enabled <- false)

timedMessages()
```

```fsharp
open System.Timers
let timedMessagesViaDelegate() =
    // define the timer
    let timer = new Timer(Interval = 3000.0,
        Enabled = true)
    // a counter to hold the current message number
    let mutable messageNo = 0
    // the messages to be shown
    let messages = [ "bet"; "this"; "gets";
        "really"; "annoying";
        "very"; "quickly" ]
    // function to print a message
    let printMessage = fun _ _ ->
        // print a message
        printfn "%s" messages.[messageNo]
        messageNo <- (messageNo + 1) % messages.Length
    // wrap the function in a delegate
    let del = new ElapsedEventHandler(printMessage)
    // add the delegate to the timer
    timer.Elapsed.AddHandler(del) |> ignore
    // return the time and the delegate so we can
    // remove one from the other later
    (timer, del)

// Run this first:
let timer, del = timedMessagesViaDelegate()

// Run this later:
timer.Elapsed.RemoveHandler(del)
```

# Pattern Matching with .NET Types

```fsharp
// a list of objects
let simpleList = [ box 1; box 2.0; box "three" ]
// a function that pattern matches over the
// type of the object it is passed
let recognizeType (item : obj) =
    match item with
    | :? System.Int32 -> printfn "An integer"
    | :? System.Double -> printfn "A double"
    | :? System.String -> printfn "A string"
    | _ -> printfn "Unknown type"

// iterate over the list of objects
List.iter recognizeType simpleList
```

```fsharp
// list of objects
let anotherList = [ box "one"; box 2; box 3.0 ]
// pattern match and print value
let recognizeAndPrintType (item : obj) =
    match item with
    | :? System.Int32 as x -> printfn "An integer: %i" x
    | :? System.Double as x -> printfn "A double: %f" x
    | :? System.String as x -> printfn "A string: %s" x
    | x -> printfn "An object: %A" x

// iterate over the list pattern matching each item
List.iter recognizeAndPrintType anotherList
```

```fsharp
try
    // look at current time and raise an exception
    // based on whether the second is a multiple of 3
    if System.DateTime.Now.Second % 3 = 0 then
        raise (new System.Exception())
    else
        raise (new System.ApplicationException())
with
    | :? System.ApplicationException ->
        // this will handle "ApplicationException" case
        printfn "A second that was not a multiple of 3"
    | _ ->
        // this will handle all other exceptions
        printfn "A second that was a multiple of 3"
```

## The `|>` Operator

```fsharp
// the definition of |>
let (|>) x f = f x
```

```fsharp
// grab a list of all methods in memory
let methods = System.AppDomain.CurrentDomain.GetAssemblies()
    |> List.ofArray
    |> List.map ( fun assm -> assm.GetTypes() )
    |> Array.concat
    |> List.ofArray
    |> List.map ( fun t -> t.GetMethods() )
    |> Array.concat

// print the list
printfn "%A" methods
```
