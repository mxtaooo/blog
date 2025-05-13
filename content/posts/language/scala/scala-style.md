---
title: Scala Style
description: Scala Style
categories: ["language"]
tags: ["scala", "code style"]
author: mxtao
date: 2020-07-16
modified: 2020-08-10 21:20:00
---

# Scala Style

参照官方文档推荐的Scala代码风格[SCALA STYLE GUIDE](https://docs.scala-lang.org/style/index.html)

---

## 缩进和换行

该部分参考[INDENTATION](https://docs.scala-lang.org/style/indentation.html)

每个缩进级别都是2个空格

尽量保证每行不要超过80字符，若有表达式超出了，尽量考虑换行

```scala
// 缩进是2个空格
object Foo {
  def bar(): Unit = {
    val x = 10
    //...
  }
}

// ---

// 超长表达式的换行
val result = 1 + 2 + 3 + 4 + 5 + 6 +
  7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 +
  15 + 16 + 17 + 18 + 19 + 20

// 超多参数的函数调用，变量名超长时要注意方法在新一行开始调用
val myLongFieldNameWithNoRealPoint =
  foo(
    someVeryLongFieldName,
    andAnotherVeryLongFieldName,
    "this is a string",
    3.1415)
```

## 命名约定

该部分内容参考[NAMING CONVENTIONS](https://docs.scala-lang.org/style/naming-conventions.html)

绝大多数情况下，Scala采用小驼峰风格`lowerCamelCase`，一些缩写术语也作为普通单词对待`xHtml`/`maxId`，由于下划线在Scala语法中有特殊意义，因此非常不推荐使用（若要强行使用、编译器也不会主动拒绝此类代码）

### 类、特质

类和特质的命名应当遵循大驼峰风格，跟Java中对于类的命名约定是一致的

> 有时类或特质以及它们的成员是用于描述格式、文档或者某些协议，此时为了保持与输出一模一样，可以不遵循对类名和成员的命名约定。但应注意只能在这种特定用途使用，不能影响其余代码

### 对象

对象一般也遵循大驼峰命名风格，但是当之功能上模仿包或者函数的时候，可以不遵循这一约定

```scala
// 功能类似一个名为`ast`的包
object ast {
  sealed trait Expr

  case class Plus(e1: Expr, e2: Expr) extends Expr
  ...
}

// 功能类似一个名为`inc`的函数
object inc {
  def apply(x: Int): Int = x + 1
}
```

### 包

对包的命名应当遵循Java的命名约定，例如`com.foo.bar`

> 有时会出现必须用`_root_`指定包的全名的情况。但应注意不要过度使用`_root_`，以相对包路径方式来引用嵌套包是很推荐的做法，此外这十分有助于简化`import`语句

### 方法

Scala中，对于普通文本/字母名称的方法应当采用小驼峰风格

#### Accessors/Mutators 属性访问器、修改器

其功能可以直接对应成Java中常用的getter/setter，但是命名风格与Java完全不一致，Scala中采用一下约定

> 对于属性的访问器/Accessors，该方法的名称与属性名称保持完全一致
>
> 某些情况下，对于`Boolean`类型的访问器，允许在前面加上`is`（例如`isEmpty`），这种情况下也要保证没有相应的修改器才行。（[Lift](https://liftweb.net/)框架中，对此种情况的约定是在属性名后加`_?`，这是非标做法，注意不要滥用该做法）
>
> 对于修改器/Mutators，其方法名应当是在属性名后加`_=`。遵循该约定后，调用点对属性的赋值将映射为调用该修改器方法（这不再仅是个约定，而变成了语言的约束）

```scala
class Foo {
  def bar = ...
  def bar_=(bar: Bar) {
    ...
  }
  def isBaz = ...
}

val foo = new Foo
foo.bar             // accessor
foo.bar = bar2      // mutator
foo.isBaz           // boolean property
```

由于Java没有对于属性及其绑定的一等支持，因此有了getter/setter范式的存在。在Scala中，有专门的库用于做此类支持

```scala
class Company {
  val string: Property[String] = Property("Initial Value") // 一个不变的属性对象引用，但属性对象保存的值是可以修改的
}
```

#### 无参方法/函数的括号

定义和调用无参方法/函数时，应当注意并考虑清楚是否要带括号

```scala
def foo1() = ...
def foo2 = ...
```

以上两个方法在Scala中都是合法的，两者也是不同的。其中`foo2`只能无括号方式调用、但`foo1`可以带括号调用。

实际行为类似访问器的方法、而且方法调用无任何副作用，那么声明时不应当带括号。若有副作用，那么就应当带上括号。调用时也应当遵循此约定，若是要调用含副作用的方法，注意带上其括号

#### 符号方法名

尽量避免！

Scala语言库中符号用得很多，但实际编程中对于符号的使用还是应当慎重考虑，尤其是这一符号没有其标准意义时。两个合理的使用场景是：DSL中(`actor ! msg`)；数学操作符（`a + b` `c :: d`）。在标准的API设计领域，严格限制符号方法名只能使用在纯函数式操作中。可以定义`>>=`来进行单子的`bind`操作，但是不允许定义`<<`方法向输出流写东西。因为前者是有完备数学定义的，而且没有任何副作用，但后者既没有标准定义也不是无副作用的操作。

一般而言，能以符号命名的方法应当是广为人知或者能很好地自描述的。一旦需要解释这个方法到底在做什么，那么该方法就不适合用符号名称了。

### 常量、值、变量和方法

常量命名应采用大驼峰风格，例如`scala.math.Pi`；一般的值、变量和方法应采用小驼峰命名风格

### 类型参数（泛型）

简单的类型参数一般用一个大写字母即可，一般从A开始

```scala
class List[A] {
  def map[B](f: A => B): List[B] = ...
}
```

若是类型参数有特定意义，那么可以用具备描述性的单词，该单词遵循类型的命名规则（注意不是全大写）；当然，若是的类型参数的作用域足够小，直接用单个字母依然没有问题

```scala
// 可以用单词
class Map[Key, Value] {
  def get(key: Key): Value
  def put(key: Key, value: Value): Unit
}

// 也可以用字母
class Map[K, V] {
  def get(key: K): V
  def put(key: K, value: V): Unit
}
```

#### HKT

理论上讲，高阶类型参数跟一般类型参数没什么不同（当然高阶kind至少是`* => *`而不是简单的`*`）。一般而言，更倾向于使用更具描述性的单词，而不是一个简单的字母，例如`class HigherOrderMap[Key[_], Value[_]] { ... }`。对于一些基础概念，可以用简单的字母，例如`F[_]`来表述函子、`M[_]`表述单子。

### 注解

Scala中注解一般采用小驼峰

### 特别说明

由于Scala本质上是函数式编程语言，因此`def add(a: Int, b: Int) = a + b`这种名称短小、方法体简单的函数定义很常见。这种行为在Java中是个很不好的做法，但是在Scala中是很推荐的。

## 类型

该部分内容参考[TYPES](https://docs.scala-lang.org/style/types.html)

### 类型推断

在保证代码清晰的前提下，尽可能地用上类型推断的功能。在向外开放API的地方，注意显式给出类型信息。

对于私有字段或本地变量，几乎完全不用显式给出类型，因为它们的类型我们一般能直接从值上看出来，对于那些不那么明显的、或者比较复杂的，还是应该显式给出类型。对于所有的公共成员，必须明确给出类型信息。

特别地，Scala编译器对于函数值/λ表达式的类型推断做了特殊处理，对于需要传入函数的高阶函数调用，可以不必声明该表达式参数的类型。考虑`ints.map(i => i * 2)`，编译器可以直接推断出λ表达式的参数`i`的类型。

### 类型注解

类型注解该以如下方式写`value: Type`，例如`i: Int`、`d: Double`甚至`l: ::`

### Type ascription / 类型归属？

类型归属的语法跟类型注解是一致的，所以很容易搞混，例如`Nil: List[String]` `None: Option[String]` `"Str12": AnyRef` `Set(values: _*)`。类型归属是在向编译器声明我们期望该值的类型是什么，一般在做上转型操作，前三者例子便是如此；但Scala中更常见的可能是最后一例，当调用一个可变参数的方法时、期望将序列展开，因此用到`_*`（否则会变成可变参数列表仅接收到一个参数，该参数是个序列）

### 函数

函数的类型遵循`(argType1, argType2, ...) => retType`的写法。特别地，对于元数为1的函数，可以省去参数的括号，写作`argType => retType`


### 结构类型

若是结构类型的总长度小于50字符，那么应该写在一行里，否则就应写作多行，并且为之分配一个类型别名。

```scala
// 简单结构类型
def foo(a: { val bar: String }) = ...

// 复杂结构类型
private type FooParam = {
  val baz: List[String => String]
  def bar(a: Int, b: Int): String
}

def foo(a: FooParam) = ...
```

当把简单结构类型写在一行的时候，多个成员之间应该用一个分号和空格隔开，成员跟花括号之间也应有空格

> 结构类型是在运行时用反射实现的，因此性能较差。开发时还是应尽可能选择常规类型，除非结构类型能带来明显的益处

## 嵌套代码块

[NESTED BLOCKS](https://docs.scala-lang.org/style/nested-blocks.html)

### 代码块

左花括号必须跟它所归属定义的声明放在同一行

### 括号

当某表达式跨越多行且需要小括号包裹时，左右两小括号与其包裹的内容之间应当没有空格、并且与内容保持同一行；

```scala
(this + is a very ++ long *
  expression)
```

小括号也可用于禁用分号推断，因此允许更喜欢将操作符写在开头的开发者写出如下代码

```scala
(  someCondition
|| someOtherCondition
|| thirdCondition
)
```

## 声明

[DECLARATIONS](https://docs.scala-lang.org/style/declarations.html)

### 类

类、对象、特质的构造器应当尽可能放在一整行里，当这一行过长（比如超出100字符）的时候，那么需要将该行拆成多行，每个构造器参数及其跟随的逗号占一行，如下所示

```scala
// 单行形式
class Person(name: String, age: Int) {
  …
}

// 多行形式
class Person(
  name: String,
  age: Int,
  birthdate: Date,
  astrologicalSign: String,
  shoeSize: Int,
  favoriteColor: java.awt.Color,
) {
  def firstMethod: Foo = …
}
```

若是该类、对象、特质扩展了其他成员，采用同样的规则。尽可能放在一行里，若是单行超出100字符，那就拆成如下的多行形式

```scala
class Person(
  name: String,
  age: Int,
  birthdate: Date,
  astrologicalSign: String,
  shoeSize: Int,
  favoriteColor: java.awt.Color,
) extends Entity
  with Logging
  with Identifiable
  with Serializable {

  def firstMethod: Foo = …
}
```

#### 类中各元素的顺序

类、对象、特质中的所有成员之间一般都应当用一个空行隔开。对于`val`和`var`，如果定义足够简单（比如单行少于20字符）并且没有Scala Doc，那么多个`val`或`var`之间可以不加空行。

一般而言，字段定义应当在方法之前，但当字段求值是多行表达式的时候，此时字段实际上有点方法的味道了（例如在`List`上计算其长度）。这样的字段可以在文件靠后的位置，注意，仅限`val`和`lazy val`使用这一后放规则。注意千万不能把`var`在类里面放得遍地都是

#### 方法

方法应当以`def foo(bar: Baz): Bin = expr`形式进行声明，若是方法参数有默认值，应当在等号两侧加空格。注意，应当对于所有公有成员声明返回类型，既能显式描述方法返回类型，也能避免编译器推断的返回类型在实现修改后发生变化，从而导致二进制不兼容。本地方法或私有方法可以不显式给出返回类型

##### 过程式语法

编程实践中尽量不要用过程式语法

```scala
// don't do this
def printBar(bar: Baz) {
  println(bar)
}

// write this instead
def printBar(bar: Bar): Unit = {
  println(bar)
}
```

##### 方法修饰符

对方法的修饰符应当按以下顺序。注解、每个注解单独一行；重写标识符`override`；访问控制修饰符`protected`、`private`；隐式关键字`implicit`；`final`关键字；`def`关键字

##### 方法体

若是方法体只是一行简单表达式，那么不必用花括号包裹起来，若该表达式比较短（比如少于30字符），那么跟方法定义直接写在一行即可；该表达式比较长的话，那么就新起一行。具体选择哪种比较主观，总体思想是使代码可读性更好，若是方法声明很长但表达式很短，那也应当写在新一行里，避免使声明行过长。

对于仅有`match`表达式的方法，`xx match {`应与方法声明写在同一行。

方法体是多行表达式的时候，应注意必须用花括号。

##### 多参数列表

应当仅在有着充分理由的时候使用该语言功能，一般而言，有以下三方面原因驱使编写该风格代码：Fluent API设计、隐式参数、为了更好的类型推断

```scala
// 自定义流程控制API
def unless(exp: Boolean)(code: => Unit): Unit = if (!exp) code

unless(x < 5) {
  println("x was not less than five")
}

// 对于多参数列表，给出第一个参数后，其余参数可以用编译器类型推断来简化编写

// scala中，一般这样定义
def fold[U](unit: U)(op: (U, A) => U): U
// 这样调用
List("").fold(0)(_ + _.length)

// 若是这样定义
def fold[U](unit: U, op: (U, A) => U): U
// 只能这样声明具体类型的调用
List("").foldLeft[Int](0, _ + _.length)
// 下面这种调用是不对的
List("").fold(0, (i: Int, s: String) => i + s.length)
```

对于复杂DSL或者类型名称超长的类型，可能很难在一行中完整声明整个函数签名，这种情况可以每个参数列表占一行，左括号对齐

##### 高阶函数

在Scala中，只要在声明函数的时候稍微留心，那么调用高阶函数的时候可以有一些语法上的简化。考虑`fold`函数，SML中它的签名`fun fold (f: ('b * 'a) -> 'b) (init: 'b) (ls: 'a list)`，在Scala中，一般是相反的参数顺序`def fold[A, B](ls: List[A])(init: B)(f: (B, A) => B): B = ...`。把函数参数放在最后一个，那么调用该函数的时候，可以用上函数简化语法`fold(List(1,2,3,4))(0)(_+_)`

#### 字段

字段遵循的声明规则跟方法大约一致。此外，对于`lazy`的字段，`val`必须紧跟`lazy`关键字

### 函数值

Scala允许多种语法声明函数值，例如，以下几种方式都是正确的

```scala
val f1 = ((a: Int, b: Int) => a + b)
val f2 = (a: Int, b: Int) => a + b
val f3 = (_: Int) + (_: Int)
val f4: (Int, Int) => Int = (_ + _)
```

其中，第一种和第四种方式是建议写法，第二种相对也还行，但是当函数体多行的时候容易出现问题；第三种是最简洁的，但是可能比较难以理解，尤其是一眼看上去可能看不懂，得想一下才能懂什么意思。

函数值中，在小括号和它们包裹代码之间不应当有空格，但花括号与其代码见应用空格。

大部分函数可能不像上例给出的那样简要，它们可能都是有多行表达式。这种情况下，就将函数切分到多行去，这种情况下必须用第一种风格

```scala
val f1 = { (a: Int, b: Int) =>
  val sum = a + b
  sum
}
```

此外，函数值的声明和调用都应尽可能发挥编译器类型推断的功能。

## 控制结构

[CONTROL STRUCTURES](https://docs.scala-lang.org/style/control-structures.html)

所有的控制结构关键词`if`/`for`/`while`之后都必须紧跟一个空格

### 花括号

当控制结构表达的是一个纯函数式操作并且各个分支都只是单行表达式时应当省略花括号

+ `if`表达式：若是存在`else`分支，则应当省略花括号；否则必须用花括号包裹起来，哪怕只有单行表达式
+ `while`：必须带上花括号（因为它永远不可能描述一个纯函数式操作）
+ `for`：若是有`yield`语句，那么可以省略花括号；否则必须用花括号包裹循环体，哪怕仅有一行表达式
+ `case`: 省略花括号

```scala
val news = if (foo)
  goodNews()
else
  badNews()

if (foo) {
  println("foo was true")
}

news match {
  case "good" => println("Good news!")
  case "bad" => println("Bad news!")
}
```

### `for`-Comprehensions

在`for`语句中可以写多个生成器（即多个`<-`）对于存在`yield`语句的`for`表达式，当有多个生成器的时候，要用花括号包裹且每个生成器占一行；仅有一个生成器的时候，用小括号包裹，如下

```scala
// right
for (i <- 0 to 10) yield i

// wrong!
for (x <- board.rows; y <- board.files)
  yield (x, y)

// right!
for {
  x <- board.rows
  y <- board.files
} yield (x, y)
```

存在特例，对于那些没有`yield`的`for`表达式，这种情况属于普通的循环而不是函数式操作，此时使用小括号包裹一个或多个生成器

```scala
// wrong!
for {
  x <- board.rows
  y <- board.files
} {
  printf("(%d, %d)", x, y)
}

// right!
for (x <- board.rows; y <- board.files) {
  printf("(%d, %d)", x, y)
}
```

for-comprehensions可能会常倾向于链接`map`、`flatMap`、`filter`等调用，但是会导致代码可读性很差，因此这种情况要尽可能用增强的for表达式

### 细碎的条件判断

有些需要三元操作符`?`/`:`的场景，scala中无这样的操作符，但是可以直接用简单的`if`/`else`表达式来表述，例如`val res = if (foo) bar else baz`。要注意这种风格不要在命令式运用`if`/`else`时使用

## 方法调用

[METHOD INVOCATION](https://docs.scala-lang.org/style/method-invocation.html)

简要来讲，Scala中的方法调用遵循Java风格的约定。在调用对象、点、方法名之间没有空格，方法名和参数列表之间没有空格，参数之间应当以逗号和一个空格隔开。

Scala 2.8开始支持了命名参数，进行方法调用时，命名参数整体应当看作一个普通参数（即逗号加一个空格分隔），命名参数自身等号两侧应当各有一个空格

```scala
foo(42, bar)
target.foo(42, bar)
target.foo()

foo(x = 6, y = 7)
```

### 0元函数/无参函数

Scala允许省略0元函数调用时的括号。当要调用的方法没有任何副作用的时候才能用这种语法，否则必须带上括号。

```scala
xx.toString()     // √
xx.toString       // √

println()         // √
println           // x
```

#### Postfix Notation/后缀写法

此外，对于无参数函数，Scala也允许采用后缀写法，但是要尽可能避免，这里只是给出了有这种写法，但是非常不建议使用。仅限在某些DSL中才允许用这种写法。

```scala
names.toList    
names toList    // x
```

### 1元函数/单个参数 - 中缀写法

对于这类函数，Scala允许一种完全无需任何符号的语法，即中缀写法。通常情况下，应当注意避免这种语法，但当方法名是个符号参数部分是个函数的时候可以用，当然也必须保证是在纯函数的环境中用。

```scala
names.mkString(",")     // √
names mkString ","      // 有时会见到这种写法，但这种写法存在争议，要避免
javaList add item       // x
```

#### 符号方法、操作符

这种方法/函数必须要以中缀风格来进行调用。

```scala
"daniel" + " " + "spiewak"    // √
a + b                         // √

"daniel"+" "+"spiewak"        // x
a+b                           // x
a.+(b)                        // x
```

绝大多数情况下，遵循Java和Haskell中的约定。在某些灰色地带中，对那些方法名短小、实际效果类似操作符的函数，尤其是当它满足了交换律的时候，例如`max`，`x max y`这种写法也是相当常见的。

符号方法可能接受多个参数，这种情况下要用中缀语法来调用，`foo ** (bar, baz)`。这种方法其实相当少了，在设计API的时候应注意，尽可能避免设计出这样的API。Scala的集合API设计中存在`/:`和`:\`，尽量不要使用它们，转而使用更具意义的方法名`foldLeft`和`foldRight`。

#### 高阶函数

对于那些接受一个函数为参数的方法，应尽量使用的中缀语法。但是用中缀语法的时候不要带着多余的符号了

```scala
names.map { _.toUpperCase }                           // x
names.map { _.toUpperCase }.filter { _.length > 5 }   // √
names map { _.toUpperCase } filter { _.length > 5 }   // √
```

## 文件

[FILES](https://docs.scala-lang.org/style/files.html)

一般来讲，文件中应当只包含逻辑上的单个组件。所谓“逻辑上”的单个组件，指的是一个类型、特质或对象。当类或特质有其伴生对象时，要将伴生对象放在类或特质的同一文件中。文件名应当就是类、特质或对象的名称。此外，应当按照其包的结构放在相同目录结构中。

> Scala放宽了对于文件名、目录结构的限制，但实际编程中还是应注意遵循Java风格的约定。

```scala
package com.novell.coolness

class Inbox { ... }

// companion object
object Inbox { ... }
```

### 多元素文件

有些很特殊的情况就是要违反以上约定。

一个很常见的例子便是对于封闭抽象类、封闭特质及其子类的实现（一般是对ADT相关功能的实现）。因为封闭类、特质从语言级别就约束了其子类必须与其在同一个源文件中。

```scala
sealed trait Option[+A]

case class Some[A](a: A) extends Option[A]

case object None extends Option[Nothing]
```

另一个常见场景是多个类从逻辑上很内聚，它们基于同样的一组前提或者概念，为方便维护便放在了同一个源文件中。这种情况确实存在，但应仔细斟酌是否放到一个源文件中

> 所有的多元素文件都必须以小驼峰给文件命名

例如`option.scala`、`ast.scala`

## 文档

[SCALADOC](https://docs.scala-lang.org/style/scaladoc.html)

应当为所有的包、类、特质、方法及其他成员提供详细的文档。Scala文档遵循Java的文档风格，此外也提供了更丰富的功能用于简化文档的书写。

应当更关注文档的主旨和内容，而不是格式。文档以简短的概括开始，然后再给出更深入的细节描述。一下给出几种常见风格

```scala
// ---- Java doc 风格 ----

/**
 * Provides a service as described.
 *
 * This is further documentation of what we're documenting.
 * Here are more details about how it works and what it does.
 */
def member: Unit = ()

// ---- Scala doc 风格 （星号在第二列对齐） ----

/** Provides a service as described.
 *
 *  This is further documentation of what we're documenting.
 *  Here are more details about how it works and what it does.
 */
def member: Unit = ()

// ---- Scala doc 风格 （星号在第三列对齐） ----

/** Provides a service as described.
  *
  * This is further documentation of what we're documenting.
  * Here are more details about how it works and what it does.
  */
def member: Unit = ()

// ---- 某些特别简单的注释 ----

/** Does something very simple */
def simple: Unit = ()
```
[SCALADOC FOR LIBRARY AUTHORS](https://docs.scala-lang.org/overviews/scaladoc/for-library-authors.html)
