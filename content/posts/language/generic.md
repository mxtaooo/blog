---
title: 泛型
description: 泛型编程相关内容，涉及基本语法、泛型可变性(协变逆变和不变)、泛型约束(上界和下界)、高阶泛型
author: mxtao
categories: ["language"]
tags: ["generic", "C#", "F#", "Java", "Scala", "Python", "TBD"]
date: 2025-05-16
modified: 2025-05-16 17:30:00
draft: true
---

# 泛型

泛型(Generic)是非常重要的语言功能，广泛应用于各种项目、工具、框架。\
本文主要关注泛型的应用，由浅入深介绍和讨论能力和限制，给出相关示例来演示应用。

> 演示代码语言/平台采用最新LTS或主流支持版本，详细情况如下：
> + [C# 12](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12) on [.NET 8 (LTS)](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8/overview)
> + [F# 8](https://learn.microsoft.com/en-us/dotnet/fsharp/whats-new/fsharp-8) on [.NET 8 (LTS)](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8/overview)
> + [Java 21](https://docs.oracle.com/en/java/javase/21/language/index.html) on [JDK 21 (LTS)](https://docs.oracle.com/en/java/javase/21/)
> + [Scala 3.3.x (LTS)](https://docs.scala-lang.org/scala3/reference/index.html) on JDK 21 (LTS)
> + [Scala 2.13.x](https://docs.scala-lang.org/overviews/index.html) on JDK 21 (LTS)
> + [Python 3.13.x](https://www.python.org/doc/)

> .NET版本支持策略参考官方文档: [.NET Support Policy](https://dotnet.microsoft.com/en-us/platform/support/policy); [C#](https://learn.microsoft.com/en-us/dotnet/csharp/)和[F#](https://learn.microsoft.com/en-us/dotnet/fsharp/)随.NET一同发布/更新

> Scala与JDK兼容情况可参考官方介绍: [JDK Compatibility](https://docs.scala-lang.org/overviews/jdk-compatibility/overview.html)\
> Scala 2.x 维护计划在[Scala 2 maintenance plans](https://www.scala-lang.org/blog/2024/12/16/scala-2-maintenance.html)及[Scala development guarantees](https://www.scala-lang.org/development/)中有介绍，简言之2.13将持续维护，2.12将在sbt 1广泛应用期间持续维护 \
> Scala 2.13相对与2.12的变化可参考: [Migrating a Project to Scala 2.13's Collections](https://docs.scala-lang.org/overviews/core/collections-migration-213.html), [Scala 2.13.0 is now available!](https://www.scala-lang.org/news/2.13.0/), [Releases / Scala 2.13.0](https://github.com/scala/scala/releases/tag/v2.13.0) \
> Scala 3相对于2的变化可参考: [Scala 3 Migration Guide](https://docs.scala-lang.org/scala3/guides/migration/compatibility-intro.html)

> Python的版本支持情况可参考官方介绍: [Status of Python versions](https://devguide.python.org/versions/)

## 基本语法

本节简要介绍泛型在各语言中的基本使用。

### C#

> 官方文档: \
> + [Generics in .NET](https://learn.microsoft.com/en-us/dotnet/standard/generics/)
> + [C# specifications / Types / Constructed types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/types#84-constructed-types)
> + [Generic classes and methods](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics)
> + ......

#### 泛型接口、泛型类和泛型方法

> 如下代码演示了泛型接口、泛型类、泛型方法(实例方法及静态方法)的定义和调用。\
> + [Generic Classes (C# Programming Guide)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generic-classes)
> + [Generic Interfaces (C# Programming Guide)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generic-interfaces)
> + [Generic methods (C# programming guide)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generic-methods)

```csharp
// ==========[定义泛型]==========

// 定义泛型接口
interface IWritable<T>
{
    void Write(T value);
}
interface IReadable<T>
{
    T Read();
    // 接口自带默认实现
    string ReadString() => Read().ToString();
}

// 定义泛型类(并实现泛型接口)
class Response<T> : IReadable<T>, IWritable<T>
{
    public int Code { get; set; }
    public string Message { get; set; }
    // Data属性是个泛型属性
    public T Data { get; set; }

    // 构造器方法
    public Response() { }
    public Response(int code, string message, T data) : this()
    {
        this.Code = code;
        this.Message = message;
        this.Data = data;
    }
    // 解构方法
    public void Deconstruct(out int code, out string message, out T data)
    {
        code = Code;
        message = Message;
        data = Data;
    }

    // 实现泛型接口中定义的方法
    public T Read() => Data;
    public void Write(T value) => Data = value;

    // 定义泛型实例方法
    public bool TryRefreshData<U>(U data)
    {
        if (data is T t)
        {
            this.Data = t;
            return true;
        }
        return false;
    }

    // 尽量避免在泛型类中定义静态方法，调用相对比较麻烦
    // 定义泛型静态方法
    public static Response<U> Success<U>(U data)
        => new(0, "success", data);
    // 定义静态方法
    public static Response<string> Failed(string message)
        => new(1, message, "failed");
}

// 定义工具类
// C#中，泛型静态方法最好放在单独的工具类中，可以直接以
class ResponseHelper
{
    // 定义泛型静态方法
    public static Response<T> Success<T>(T data)
        => new(0, "success", data);
    public static Response<string> Failed(string message)
        => new(1, message, "failed");
}

// 定义(静态)扩展类
static class ResponseExtension
{
    // 定义泛型扩展方法
    public static Response<T> Copy<T>(this Response<T> response)
        => new(response.Code, response.Message, response.Data);
    // 定义泛型扩展方法
    public static bool IsSuccess<T>(this Response<T> response)
        => response.Code == 0;
}

// ==========[使用泛型]==========
// 初始化对象(调用构造器)
var response = new Response<string>(0, "success", "data");
// 初始化对象(属性初始化)
var response = new Response<string>
{
    Code = 0,
    Message = "success",
    Data = "data"
};
// 初始化对象(new表达式)
Response<string> response = new(0, "success", "data");
// 解构对象
var (code, _, data) = response;

// 泛型方法调用时，编译器可以从参数中推断类型，因此一般无需声明类型

// 调用泛型实例方法
response.TryRefreshData(123);
// 调用泛型实例方法(声明类型)
response.TryRefreshData<short>(123);

// 调用静态泛型方法
// 调用泛型类中的静态方法时，必须要声明泛型类的具体类型(泛型静态方法的类型一般无需声明)
var response = Response<string>.Success<short>(123);
// 调用普通工具类中的静态方法(泛型静态方法的类型一般无需声明)
var response = ResponseHelper.Success<short>(123);

// 调用泛型扩展方法(与实例方法调用语法一致)
var success = response.IsSuccess();
var copy = response.Copy();
```

> 泛型接口、泛型类、泛型方法算是面向对象编程中对泛型最基本的应用。\
> 此外泛型抽象类并未因泛型而新增特殊之处，其本身的功能及限制只是因为它是“抽象类”而非“泛型”，因此代码中并未演示。

#### 泛型委托和泛型事件

委托和事件C#独有的语言功能，两者皆支持泛型，此处演示相关应用。
相关详细概念请参考官方文档。

> + [Generic Delegates (C# Programming Guide)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generic-delegates)
> + [Delegates (C# Programming Guide)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/)
> + [Events (C# Programming Guide)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/)

```csharp
// 定义泛型委托
delegate T BiOp<T>(T a, T b);

// 使用泛型委托
BiOp<int> add = (a, b) => a + b;
var c = add(1, 2);
```

```csharp
class Singleton<T>
{
    // 定义事件
    public event EventHandler<T> ValueChanged;

    private T _value;
    public T Value 
    { 
        get => _value;
        set
        {
            if (!EqualityComparer<T>.Default.Equals(Value, value))
            {
                _value = value;
                OnValueChanged(value);
            }
        }
    }

    protected virtual void OnValueChanged(T value)
    {
        // 触发事件
        ValueChanged?.Invoke(this, value);
    }
}

// 初始化对象
var singleton = new Singleton<int>();
// 订阅事件(多个事件处理程序)
singleton.ValueChanged += (_, i) => Console.WriteLine($"int = {i}");
// 赋值&触发事件
singleton.Value = 1;
// 重复赋值&不触发事件
singleton.Value = 1;
```

> 事件本质上是特殊类型的委托。对两者的深入探讨请参考官网文档。、
> + [Introduction to delegates](https://learn.microsoft.com/en-us/dotnet/csharp/delegates-overview)
> + [Introduction to events](https://learn.microsoft.com/en-us/dotnet/csharp/events-overview)
> + [Distinguishing Delegates and Events](https://learn.microsoft.com/en-us/dotnet/csharp/distinguish-delegates-events)

#### 泛型数组

> + [Generics and Arrays (C# Programming Guide)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generics-and-arrays)

泛型数组本身没什么特殊，此处需要特别注明的是**一维数组自动实现`IList<T>`接口**，这有助于实现一个泛型方法对数组或其他集合进行遍历。\
但要注意自动实现的`IList<T>`接口仅支持数据读取，不能用于从数组中增删元素(会抛出异常)。

```csharp
// 直接以集合初始化语法定义并初始化数组和List
int[] array = [1, 2, 3, 4, 5];
List<int> list = [1, 2, 3, 4, 5];

// 以一致的方式访问(读取)数组和List
ProcessItems(array);
ProcessItems(list);

static void ProcessItems<T>(IList<T> list)
{
    // 数组对象调用IsReadOnly返回True,List对象会返回False
    Console.WriteLine("IsReadOnly returns {0} for this collection.", list.IsReadOnly);

    // 对数组对象调用Insert/RemoveAt方法会导致抛出异常
    //list.RemoveAt(4);

    foreach (T item in list)
    {
        Console.Write(item?.ToString() + " ");
    }
    Console.WriteLine();
}
```

### F#

**TBD**

### Java




## 泛型约束

泛型约束声明了类型参数预期的能力，声明约束后可以安全地调用支持的操作。

### C#

> + [Constraints on type parameters (C# Programming Guide)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters)

C#具备种类丰富的泛型约束，下方列表中对各种类型进行简要介绍。

| 泛型约束 | 简介 |
| :- | :- |
| `where T : struct` | `T`必须是**不可为NULL的[值类型(Value Type)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-types)**(可以是`record struct`类型)。<br/>由于所有值类型必定存在可用的无参构造器，因此这也隐含声明`new()`约束。<br/>`struct`约束不能与`new()`及`unmanaged`约束组合使用。 |
| `where T : class` | `T`必须是[**引用类型(Reference Type)**](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/reference-types)。<br/>`T`可以是类、记录类(record class)、接口、委托、数组。<br/>在允许为NULL上下文(nullable context)中，`T`必须是不可为NULL的引用类型。 |
| `where T : class?` | `T`必须是**引用类型(Reference Type)**，可以是允许为NULL的引用类型，也可以是不允许为NULL的引用类型。<br/>`T`可以是类、记录类(record class)、接口、委托、数组。 |
| `where T : notnull` | `T`必须是**不可为NULL的类型**。<br/>`T`可以是不可为NULL的引用类型、不可为NULL的值类型。 |
| `where T : unmanaged` | `T`必须是**不可为NULL的[非托管类型(Unmanaged Type)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/unmanaged-types)**。<br/>`unmanaged`约束隐含声明`struct`，不能与`struct`及`new()`约束组合使用。<br/>注：非托管类型包括内置值类型及布尔类型、枚举类型、指针类型、成员都是非托管类型的元组(tuple)和结构(struct)类型。但该约束依然不允许指针和可为NULL的非托管类型。 |
| `where T : new()` | `T`必须**有公开的无参构造器**。<br/>当与其他约束组合使用时，`new()`约束必须放在最后。<br/>`new()`约束不能与`struct`及`unmanaged`约束组合使用。 |
| `where T : <class name>` | `T`必须**是给定的类或继承自给定的类**。<br/>在允许为NULL上下文(nullable context)中，`T`必须是不可为NULL的引用类型。 |
| `where T : <class name>?` | `T`必须**是给定的类或继承自给定的类**。<br/>在允许为NULL上下文(nullable context)中，`T`可以是允许为NULL的引用类型，也可以是不允许为NULL的引用类型。 |
| `where T : <interface name>` | `T`必须**是给定的接口或实现了给定的接口**。<br/>可以声明多个接口约束；约束中给定的接口也可以是泛型接口。<br/>在允许为NULL上下文(nullable context)中，`T`必须是实现给定接口的不允许为NULL的类型。 |
| `where T : <interface name>?` | `T`必须**是给定的接口或实现了给定的接口**。<br/>可以声明多个接口约束；约束中给定的接口也可以是泛型接口。<br/>在允许为NULL上下文(nullable context)中，`T`必须是实现给定接口的可为NULL引用类型、不可为NULL的引用类型、值类型。`T`不可以是允许为NULL的值类型。 |
| `where T : U` | `T`必须是**类型参数`U`给定的类型或继承自给定类型**。<br/>在允许为NULL上下文(nullable context)中，若`U`是不允许为NULL的引用类型，则`T`也必须是不可为NULL的引用类型；若`U`是允许为NULL的引用类型，则不限制`T`是否可为NULL。 |
| `where T : default` | `T`必须**未声明`struct`或`class`约束**。<br/>该约束仅在显式实现接口方法或重写方法时可用，用于声明期望实现/重写的是`T`未被约束的方法。 |
| `where T : allows ref struct` | 该反约束**允许`T`是[`ref struct`类型](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/ref-struct)**。<br/>`T`可能是`ref struct`实例，泛型类型和方法必须遵循[引用安全规则(ref safety rules)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/structs#16415-safe-context-constraint)。<br/>*C# 13.0+可用* |

某些约束是互斥的，某些约束必须遵循特定的顺序。
+ `struct`/`class`/`class?`/`notnull`/`unmanaged`约束至多允许一个，且必须是第一个约束；
+ 基类约束(`where T : Base`/`where T : Base?`)至多允许一个，使用`where T : Base?`支持可为NULL的基类，基类约束不能与`struct`/`class`/`class?`/`notnull`/`unmanaged`约束组合使用；
+ 不允许同时声明单个接口的可NULL和不可NULL形式(`where T : I1, I1?` ×; `where T : I1, I2?` √)；
+ `new()`约束不能与`struct`/`unmanaged`约束组合使用；若存在`new()`约束，其必须位于约束的最后(反约束可以放在它后面)；
+ `default`约束只能用于方法重写和显式实现接口方法场景，且不能与`struct`/`class`约束组合使用；
+ 反约束`allows ref struct`不能与`class`/`class?`约束组合使用，且必须跟在所有约束的后面。

部分约束有如下注意事项。\
+ **使用`class`约束时避免使用比较操作符`==`/`!=`**。这组操作符只比较引用是否相等，不进行值比较。该行为不会因具体类型是否重载比较操作符而变化，因为编译时仅能得知类型是引用类型，必须调用对所有引用类型都合法有效的实现。若要在泛型代码中进行值比较，请使用`where T : IComparable<T>`或`where T : IEquatable<T>`约束并为实际类型实现相关接口。
+ 若类型参数没有任何约束(例如`SampleClass<T>{}`中的`T`)称为未绑定类型(unbounded type parameter)，应当遵循如下规则：
  + 不能使用比较操作符`==`/`!=`，因为不能保证实际类型支持该操作符；
  + 可以显式转换为任何接口类型，也可以转换成`System.Object`类型(或者由`System.Object`转换成`T`)；
  + 可以与`null`进行比较(`T`是值类型时会返回`false`)
+ `notnull`约束用以声明类型参数将约束为不可为NULL的值类型/引用类型，**违反`notnull`约束时，编译器只会生成警告，不会报告错误**。**`notnull`约束仅在可空代码上下文中生效**，若在忽略可空性的代码上下文使用，违反约束时编译器不会生成任何警告或错误。

以下对部分约束进行详细解释及代码演示。

#### 泛型约束常规应用

```csharp
// 单个类型参数的泛型约束
struct Container<T> where T : struct
{
    public T Value { get; set; }
}

// 多个类型参数的泛型约束(各自约束互不干涉)
class Container<K, V>
    where K : struct
    where V : class, new()
{
    // ...
}

// 类型参数作为约束
class SampleClass<T, U, V> where T : V { }
class List<T>
{
    public void Add<U>(List<U> items) where U : T {/*...*/}
}
```

#### `default`约束

> 参考文档: [dotnet/csharplang/proposals/csharp-9.0/unconstrained-type-parameter-annotations](https://github.com/dotnet/csharplang/blob/main/proposals/csharp-9.0/unconstrained-type-parameter-annotations.md)

`default`约束是用于在重写/实现方法时消除nullable泛型重载的歧义。以下以代码演示其功能。

##### 关于`?`标注

C# 8.0中，`?`仅能用于显式约束了值类型或引用类型的类型参数；在C# 9.0中，`?`可以用于任意类型参数，无论是否存在约束。\
但要注意，`?`标注仅能用于设置了`#nullable enable`的代码上下文中。

若是类型参数`T`是个引用类型，`T?`表示该引用类型的可NULL实例。
```csharp
var s1 = new string[0].FirstOrDefault();  // string? s1
var s2 = new string?[0].FirstOrDefault(); // string? s2
```

若是类型参数`T`是个值类型，`T?`表示该值类型的实例。
```csharp
var i1 = new int[0].FirstOrDefault();  // int i1
var i2 = new int?[0].FirstOrDefault(); // int? i2
```

若是类型参数`T`是其他标注过的类型`U?`，`T?`依然表示标注过的类型`U?`，而不是`U??`。
```csharp
var u1 = new U[0].FirstOrDefault();  // U? u1
var u2 = new U?[0].FirstOrDefault(); // U? u2
```

若是类型参数`T`是其他类型`U`，`T?`表示标注过的类型`U?`，即使在`#nullable disable`上下文中。
```csharp
#nullable disable
var u3 = new U[0].FirstOrDefault();  // U? u3
```

实际上`T?`仅是个标注，并非一定是在构造新类型。\
`FirstOrDefault`方法的声明是`public static TSource? FirstOrDefault<TSource>(this IEnumerable<TSource> source);`，返回值部分只是声明可能为NULL，并不是将返回值变成真正的可空类型`TSource?`。\
对于值类型`TSource`(如`int`)，`TSource?`和`TSource`在IL中都是`int`，方法泛型返回值不能为`int`标注`?`(`int?`实际是`Nullable<int>`，是个新结构)。\
对于返回值，`T?`等同于`[MaybeNull] T`，对于参数值，`T?`等同于`[AllowNull] T`。当重写方法或实现接口时该等同性非常重要。\
以下代码演示了该等同性。

```csharp
public abstract class A
{
    // 以特性方式声明抽象方法
    // 没有声明`class`/`struct`约束，编译器认为存在歧义，会添加`where T : default`约束

    // 实际等同于public abstract T? F1<T>(); (也会默认添加where T : default约束)
    [return: MaybeNull] public abstract T F1<T>();
    // 实际等同于public abstract void F2<T>(T? t)
    public abstract void F2<T>([AllowNull] T t);
}

public class B : A
{
    // 重写时必须显式声明where T : default约束
    public override T? F1<T>() where T : default { return defalut(T); } // matches A.F1<T>()
    public override void F2<T>(T? t) where T : default {  }             // matches A.F2<T>()
}
```

> 使用`T?`或注解形式的可为NULL声明且不存在`class`/`struct`约束时，编译器认为存在歧义，会默认添加`where T : default`约束，表示没有约束`class`/`struct`。\
> 方法重写/实现接口时，必须声明`where T : default`约束，用来表示重写/实现的是不约束`class`/`struct`的方法。\

##### 关于歧义

参考如下代码，除泛型约束外，两个方法是一致的形式，但方法签名不包含泛型约束信息。理论上，两个方法不应同时存在。

```csharp
class C
{
    public virtual void F<T>(T? t) where T : struct { }
    public virtual void F<T>(T? t) where T : class { }
}
```

实际上，以上代码是合法的，两个方法是不同的签名。

C#8.0引入可为NULL引用类型支持，`T?`的意义取决于`T`是值类型或是引用类型。

| 泛型约束 | `T?`的含义 | 真实参数类型 |
| :- | :- | :- |
| `where T : struct` | 可为NULL值类型 | `Nullable<T>` |
| `where T : class` | 可为NULL引用类型 | `T`(带可为NULL元数据) |

以上代码在编译器视角中的实际形式如下。

```csharp
using System.Diagnostics.CodeAnalysis;

class C
{
    public virtual void F<T>(Nullable<T> t) where T : struct { }
    public virtual void F<T>([AllowNull] T t) where T : class { }
}
```

两个方法的参数在编译器视角中是不同的类型，函数签名不同，因此可以同时存在。\
但是对常规写法而言，用户读到的代码是一样的，因此便出现了歧义。

##### 消除歧义

显式`class`/`struct`约束的代码，重写/实现时可以通过显式约束消除歧义。

```csharp
class A1
{
    public virtual void F1<T>(T? t) where T : struct { }
    public virtual void F1<T>(T? t) where T : class { }
}

class B1 : A1
{
    public override void F1<T>(T? t) /*where T : struct*/ { }
    public override void F1<T>(T? t) where T : class { }
}
```

> 注: 显式`struct`约束的方法参数实际是`Nullable<T>`，相对于参数为`T`的方法，这是个约束更强(更具体)的版本，在编译器解析时具备更高的优先级。\
> 因此重写方法时的`where T : struct`约束可以省去，但非常不建议这样做。

而当存在有约束和无约束版本的方法时，可以使用`default`约束来消除歧义。

```csharp
class A2
{
    public virtual void F2<T>(T? t) where T : struct { }
    public virtual void F2<T>(T? t) { }
}

class B2 : A2
{
    public override void F2<T>(T? t) /*where T : struct*/ { }
    public override void F2<T>(T? t) where T : default { }
}
```

> `where T : default`声明此处重写的是无`class`/`struct`约束的版本。

#### `unmanaged`约束

该约束可用于期望以直接操作内存块的方式读写类型实例的代码，如下所示。

```csharp
unsafe public static byte[] ToByteArray<T>(this T argument) where T : unmanaged
{
    var size = sizeof(T);
    var result = new Byte[size];
    Byte* p = (byte*)&argument;
    for (var i = 0; i < size; i++)
        result[i] = *p++;
    return result;
}
```

> 由于对未知的类型`T`调用`sizeof`操作符，因此代码必须声明为不安全上下文(`unsafe` context)；
> 若没有将类型参数`T`约束为`unmanaged`，`sizeof`操作符不可用。

#### 委托约束

C#语言规范中未提供类似`where T : delegate`形式的约束，但可以用类型约束来实现类似的功能。 \
可以将`T`约束为`System.Delegate`/`System.MulticastDelegate`的子类，就可以在满足类型安全的前提下对委托进行操作。 \
代码演示如下所示。

```csharp
// 操作委托的扩展方法
// 合并相同相同类型的委托
public static T? TypeSafeCombine<T>(this T source, T target) where T : Delegate
    => Delegate.Combine(source, target) as T;

// 定义两个相同类型的委托
Action first = () => Console.WriteLine("this");
Action second = () => Console.WriteLine("that");
// 合并&调用
var combined = first.TypeSafeCombine(second);   // √
combined!();

// 定义一个不同类型的委托
Func<bool> test = () => true;
// 如下的调用是错误的
var badCombined = first.TypeSafeCombine(test);  // ×
```

#### 枚举约束

与委托调用类似，C#语言规范中并未直接提供纯粹的`where T : enum`约束(`unmanaged`约束允许传入枚举，但不是只允许枚举)，但可以用类型约束来实现类似功能。 \
可以将`T`约束为`System.Enum`的子类，就可以约束为仅允许枚举传入。 \
代码示例如下所示。

```csharp
// 操作枚举的扩展方法
// 将给定枚举的值和名称构造成字典对象
public static Dictionary<int, string> EnumNamedValues<T>() where T : Enum
{
    var result = new Dictionary<int, string>();
    var values = Enum.GetValues(typeof(T));

    foreach (int item in values)
    {
        result.Add(item, Enum.GetName(typeof(T), item)!);
    }
    return result;
}
// 定义枚举
enum SomeValue {A, B, C, D}
// 调用扩展方法并初始化字典
var dict = EnumNamedValues<SomeValue>();
```

#### 类型参数继承/实现声明的类/接口(F-Bound)

> 本质是F-Bound，此处仅简要介绍[官方文档](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters#type-arguments-implement-declared-interface)对该约束的介绍及演示(样例中涉及到对C#支持接口静态成员的语言功能)，请参考下文([F-Bound](#f-bound))对该技巧的详细介绍。

```csharp
// T必须实现接口本身
interface IAdditionSubtraction<T> where T : IAdditionSubtraction<T>
{
    // C#接口支持声明静态成员
    static abstract T operator +(T left, T right);
    static abstract T operator -(T left, T right);
}
```

#### `allows ref struct`约束

> 该约束是C#13.0新增的语言功能。

`allows ref struct`实际上是*反约束*，允许指定的类型参数可以是`ref struct`类型，因此该类型实例必须遵守如下规则：
+ 不能被装箱
+ 必须遵守[引用安全规则(ref safety rules)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/structs#16415-safe-context-constraint)
+ 不能在禁止使用`ref struct`的地方使用该类型，例如`static`字段
+ 实例可以使用`scoped`修饰符进行标记

### F-Bound

F-Bound是一种泛型编程技巧，通常用于面向对象编程中，帮助在继承层次结构中实现类型自参的自引用。简单来说，是指通过继承某个类型的泛型类，子类可以返回类型自己。这个技巧在做流式接口设计、构建DSL或者处理复杂类型时非常有用。

F-Bound通常用于实现以下模式：基类定义了一个泛型方法，该方法返回该类（或者子类）的类型。而子类继承基类时，能够实现这个方法并返回自己的类型。

以下代码演示基本应用。

```csharp
using System;

// 基类 Shape，使用 F-Bound 技巧
public abstract class Shape<T> where T : Shape<T>
{
    // 一个设置颜色的方法，返回当前类型（T）本身
    public T SetColor(string color)
    {
        Console.WriteLine($"Setting color to {color}");
        return (T)this;  // 返回当前类型本身
    }
    // 计算形状的面积（可以在子类中实现具体的面积计算）
    public abstract double GetArea();
}

// Circle 类，继承自 Shape<T>，并指定自己为 T
public class Circle : Shape<Circle>
{
    public double Radius { get; set; }
    public Circle(double radius)
    {
        Radius = radius;
    }
    public override double GetArea()
    {
        return Math.PI * Radius * Radius;
    }
    // 可以链式调用 SetColor 方法
    public Circle SetRadius(double radius)
    {
        Radius = radius;
        return this;
    }
}

// Rectangle 类，继承自 Shape<T>，并指定自己为 T
public class Rectangle : Shape<Rectangle>
{
    public double Width { get; set; }
    public double Height { get; set; }
    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }
    public override double GetArea()
    {
        return Width * Height;
    }
    // 可以链式调用 SetColor 方法
    public Rectangle SetDimensions(double width, double height)
    {
        Width = width;
        Height = height;
        return this;
    }
}

// 测试 F-Bound
class Program
{
    static void Main(string[] args)
    {
        // 创建一个 Circle 对象，设置颜色和半径
        Circle circle = new Circle(5);
        circle.SetColor("Red")
              .SetRadius(10);
        Console.WriteLine($"Circle Area: {circle.GetArea()}");

        // 创建一个 Rectangle 对象，设置颜色和尺寸
        Rectangle rectangle = new Rectangle(4, 5);
        rectangle.SetColor("Blue")
                 .SetDimensions(6, 7);
        Console.WriteLine($"Rectangle Area: {rectangle.GetArea()}");
    }
}
```


## 可变性

[Covariance and Contravariance (C#)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/covariance-contravariance/)


协变与逆变不是泛型约束，而是泛型类型参数的类型关系控制机制

### C#

#### 方法

#### 委托中


## 高阶泛型


### Higher Kind


### Higher Rank



## 参考链接

[Generic programming](https://en.wikipedia.org/wiki/Generic_programming)

[Parametric polymorphism](https://en.wikipedia.org/wiki/Parametric_polymorphism)


> 本文内容经过较长时间整理、
