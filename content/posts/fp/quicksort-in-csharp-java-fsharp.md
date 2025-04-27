---
author: mxtao
date: 2016-11-07
---

# 通过实现“快排”对比OO&FP

## 简介

这里只是在对比了，通过用Java/C#及F#实现一个简易版本的快速排序算法，针对语言特性进行对比

首先描述一下这个简易版本的算法思路：

1. 如果是个空列表，那就直接返回；
2. 如果不是空的，那就选取第一个元素作为pivot；
    1. 从剩余部分选取所有比pivot小的元素，进行排序(递归地)；
    2. 选取所有比pivot大的元素进行递归排序；
    3. 将三部分组合起来，即 [小的,pivot,大的]

关于如下的各种实现，不关注过多算法细节，比如pivot选取，可能遇到的最坏情况，元素数量少时算法的表现等等

这里只关注一点，用不同的语言怎样才能描述这个算法，然后直观的观察代码长度，比较语言特性的优劣，注意，只关注语言特性

## In Java 

```java
public static <T extends Comparable<T>> Iterable<T> quicksort(Iterable<T> values) {
    if(values == null || !values.iterator().hasNext())
        return new ArrayList<T>();

    // 获取迭代器，并选取第一个元素作为主元
    Iterator<T> iterator = values.iterator();
    T pivot = iterator.next();

    // 将剩余元素划分
    List<T> smallers = new ArrayList<T>();
    List<T> biggers = new ArrayList<T>();
    while (iterator.hasNext()) {
        T current = iterator.next();
        if (pivot.compareTo(current) >= 0)
            smallers.add(current);
        if (pivot.compareTo(current) < 0)
            biggers.add(current);
    }

    // 对划分出来的两部分再进行排序
    Iterable<T> sortedSmallers = quicksort(smallers);
    Iterable<T> sortedBiggers = quicksort(biggers);

    // 构建结果集合
    List<T> result = new ArrayList<T>();

    // 向List中按顺序添加已经有序的元素
    sortedSmallers.forEach(result::add); //方法引用，对lambda表达式的进一步简化
    result.add(pivot);
    sortedBiggers.forEach(result::add);

    return result;
}
```

在此处，使用了泛型及约束，用以保证对象之间是可比较的，总体思路是获取迭代器然后进行操作，平白直叙，并且使用方法引用等尽量缩减代码，没什么好说的

## In C#

+ 版本 1

```csharp
public static List<T> QuickSort<T>(List<T> values)
    where T : IComparable // 泛型约束：必须实现IComparable接口
{
    if (values.Count == 0)
        return new List<T>();

    // 取第一个元素作为pivot
    T firstElement = values[0];
    // 分别为小于和大于等于的元素创建列表
    var smallerElements = new List<T>();
    var largerElements = new List<T>();
    for (int i = 1; i < values.Count; i++) // 下标必须从1开始
    {
        var elem = values[i];
        if (elem.CompareTo(firstElement) < 0)
            smallerElements.Add(elem);
        else
            largerElements.Add(elem);
    }

    // 构建结果对象并返回
    var result = new List<T>();
    result.AddRange(QuickSort(smallerElements.ToList()));
    result.Add(firstElement);
    result.AddRange(QuickSort(largerElements.ToList()));
    return result;
}
```

+ 版本2

```csharp
/// <summary>
/// 作为 IEnumerable 接口的扩展方法实现
/// </summary>
public static IEnumerable<T> QuickSort<T>(this IEnumerable<T> values) where T : IComparable
{
    if (values == null || !values.Any())
        return new List<T>();
    // 把列表分成首元素和剩余元素两部分
    var firstElement = values.First();
    var rest = values.Skip(1);
    // 将剩余元素分到两个序列并继续排序
    var smallerElements = rest
        .Where(i => i.CompareTo(firstElement) < 0)
        .QuickSort(); // 注意：此处是在递归调用本方法
    var largerElements = rest
        .Where(i => i.CompareTo(firstElement) >= 0)
        .QuickSort();
    // 返回结果
    return smallerElements
        .Concat(new List<T> { firstElement })
        .Concat(largerElements);
}
```

观察如上两个版本，都跟Java一样，加入了泛型及约束。关于版本1，似乎还不错，相对比Java版本的实现简洁了不少，当然由于Java使用的是`Iterable`接口而不是`List`/`ArrayList` 因此有些操作方法并不存在只能用稍微麻烦点的写法，似乎有些欺负Java，不过可以随手实现个`List<T>`版本，没什么新东西，那就留给大伙了

不过相对于Java的`Iterable`接口，C#的对应物是`IEnumerable`接口，而且尽可能用上C#的语言特性去精简代码，因此版本2看上去似乎就很简练了，而且还稍稍有些函数式的味道的，不过先不要下结论，这还并不是极限

## In F#

```fsharp
let rec quicksort list =
    match list with
    | [] -> [] // 如果是个空列表，那就直接返回
    | firstElem::otherElements -> // 如果不是空列表，那就分成 首元素，剩余元素 两部分
        let smallerElements =
            otherElements
            |> List.filter (fun e -> e < firstElem) //从剩余元素中选取比首元素小的
            |> quicksort    // 然后进行排序
        let largerElements =
            otherElements
            |> List.filter (fun e -> e >= firstElem) //从剩余元素中选取大于等于首元素的
            |> quicksort    // 然后进行排序
        // 将三个部分连接成一个新的列表，并返回
        List.concat [smallerElements; [firstElem]; largerElements]
//test
printfn "%A" (quicksort [1;5;23;18;9;1;3])
```

该算法实现中涉及到的细节暂不深谈，大体包括了pattern matching、partial application、lambda expression、recursive function等知识，此处暂不讨论，只谈谈感觉

可以看到，这个版本的代码实现似乎还算是简洁，但是咱们有一说一，真是没什么惊艳的，总体来说，算是还好吧，也实在没什么可圈可点，可以看作是对于C#版本2的另一种描述，看上去只是语法不同了而已

但是这只是对算法的一种描述方式而已，那么我们换个方式

```fsharp
let rec quicksort = function
    | [] -> []
    | first::rest ->
        let smaller,larger = List.partition ((>=) first) rest
        List.concat [quicksort smaller; [first]; quicksort larger]
```

好了，如上五行代码便是对我们简易的快排的描述，最F#，最函数式的描述，看上去便是一堆符号和单词丢在了一起，就完成了快速排序， 嗯，这一个版本，有没有惊艳到。

相对于上一个，这里只有一处新东西，tuple，后续会讨论

个人认为，F#（或者其它函数式语言）确实是一个很值得学习的东西，毕竟是在用一个不同于面向对象的思想去构建代码，把各种语言元素、所谓“奇技淫巧”组合在一起，做出奇奇怪怪的事情，刷刷三观么。当然在目前的平台上，函数式的思路写法上确实很优雅，但是在目前对算法进行评价的时间复杂度、空间复杂度这方面，函数式语言描述的算法也确实是有劣势的。