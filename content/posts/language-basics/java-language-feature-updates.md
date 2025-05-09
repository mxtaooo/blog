---
title: Java语言功能更新
description: Java语言相关的功能更新(JDK9->JDK21(LTS))(2017-09->2023-09)
author: mxtao
categories: ["language basics"]
tags: ["language basics", "java"]
date: 2025-05-08
modified: 2025-05-09 17:00:00
---

# Java语言功能更新

> 当前整理范围: JDK9->JDK21(LTS)

## 参考链接

1. [A categorized list of all Java and JVM features since JDK 8 to 21](https://advancedweb.hu/a-categorized-list-of-all-java-and-jvm-features-since-jdk-8-to-21/) by [Dávid Csákvári](https://advancedweb.hu/dodie.html)
2. [New language features since Java 8 to 21](https://advancedweb.hu/new-language-features-since-java-8-to-21/) by [Dávid Csákvári](https://advancedweb.hu/dodie.html)
3. [Java 9 到 21 的语言特性更新](https://nanova.me/posts/Java-lang-updates) by [Alex Tan](https://nanova.me/posts/about_me) - *本文是引文2中文翻译&整理*
4. [Java Language and Virtual Machine Specifications](https://docs.oracle.com/javase/specs/index.html)
5. [Java Platform, Standard Edition Java Language Updates, Release 21](https://docs.oracle.com/en/java/javase/21/language/index.html) - Oracle官方整理的Java SE 9到特定版本的语言功能更新(修改URL中的版本号可以查看9到其他版本的功能更新)

> 参考以上内容进消化整理

## Java 9

> 该版本新增的语言功能详情可参考: [JEP 213: Milling Project Coin](https://openjdk.org/jeps/213)

### 1. 接口中允许私有方法

Java8允许接口实现默认方法，在Java9中允许接口实现私有方法。可以将期望复用但又不想公开暴露的代码放到私有方法中，由默认方法调用。

```java
public interface Interface {
    default void op1() {
        // code ...
        common();
    }
    
    default void op2() {
        // code ...
        common();
    }

    private void common() {
        // common code
    }
}
```

### 2. 匿名内部类的钻石操作符

Java7引入钻石操作符`<>`，调用构造器时允许编译器推断泛型类型，降低没必要的类型参数声明，例如：`List<Integer> numbers = new ArrayList<>();`。但该功能并不支持匿名内部类，相关邮件: [Diamond operator and anonymous classes](https://mail.openjdk.org/pipermail/coin-dev/2011-June/003283.html)。

相关问题已在Java9解决，此后以下代码可被接受了。

```java
Callable<Integer> task = new Callable<>() {
    public Integer call() {
        return doSomething();
    }
};

Comparator<MyClass> FORWARD = new Comparator<>() {
    @Override
    public int compare(MyClass first, MyClass second) {
        // comparator logic
    }
};
```

### 3. effectively-final变量在`try-with-resources`语句中可作为资源使用

Java7引入`try-with-resources`语句来简化资源释放，示例如下。

```java
// java7之前需要手动管理资源释放
BufferedReader br = new BufferedReader(...);
try {
    return br.readLine();
} finally {
    if (br != null) {
        br.close();
    }
}

// java7可以用该语句自动释放资源，减少样板代码
try (BufferedReader br = new BufferedReader(...)) {
    return br.readLine();
}
```

实际使用中，也会存在一些短板，示例如下。

```java
// 多个资源的时候代码有点难读
try (BufferedReader br1 = new BufferedReader(...);
    BufferedReader br2 = new BufferedReader(...)) {
    System.out.println(br1.readLine() + br2.readLine());
}

// 处理已有资源的时候仍需要定义变量
try (Closeable c = resouce) {
    // ...
}
```

Java9解决了这些问题，现在也可以处理不可变或实际不可变的局部变量，示例如下。

```java
BufferedReader br1 = new BufferedReader(...);
BufferedReader br2 = new BufferedReader(...);
try (br1; br2) {
    System.out.println(br1.readLine() + br2.readLine());
}
```

> 注意，由于变量在`try-with-resources`语句外可用，但此时资源已被释放，所以操作基本都会失败，要特别注意。示例如下。
> ```java
> BufferedReader br = new BufferedReader(...);
> try (br) {
>     System.out.println(br.readLine());
> }
> br.readLine(); // Boom!
> ```

### 4. 下划线不可作为标识符使用

Java8中将`_`作为标识符使用时，编译器会输出警告。Java9更进一步，将此情形视为错误，这是保留该符号未来做特殊使用。

```java
// java7-: 变量可用
// java8: 编译警告 变量可用
// java9 -> 20: 编译错误
// java21(开启预览功能): 编译通过 变量不可用
// java22+: 编译通过 变量不可用
int _ = 10;
```

### 5. 警告改进

`@SafeVarargs`注解只能用于不可被覆写的方法，此前只包括构造方法、静态方法、`final`实例方法。
实际上私有实例方法也算是，现在可以将`@SafeVarargs`注解在私有方法上用以抑制`Type safety: Potential heap pollution via varargs parameter`警告。
[可变参数](https://docs.oracle.com/javase/8/docs/technotes/guides/language/varargs.html)和[泛型](https://docs.oracle.com/javase/8/docs/technotes/guides/language/generics.html)两者结合使用时[可能产生问题](https://docs.oracle.com/javase/tutorial/java/generics/nonReifiableVarargsType.html)，编译器会输出警告，当程序员确保没有进行危险操作时，使用该注解抑制警告。
注解使用示例如下(参考自[Annotation Type SafeVarargs](https://docs.oracle.com/javase/8/docs/api/java/lang/SafeVarargs.html))。
```java
// 此前只能用于标记构造函数、static方法、final方法

@SafeVarargs // 实际上并不安全
static void m(List<String>... stringLists) {
    Object[] array = stringLists;
    List<Integer> tmpList = Arrays.asList(42);
    array[0] = tmpList; // 该赋值实际上不合法、但编译会正常通过
    String s = stringLists[0].get(0); // 运行时抛出ClassCastException
}
```

此外编译器不再为引入废弃类型告警，这些警告已经在调用的地方展示了。参考[JEP 211: Elide Deprecation Warnings on Import Statements](https://openjdk.org/jeps/211)

## Java 11 (LTS)

### 局部变量类型推断

> Java 10([JEP 286: Local-Variable Type Inference](https://openjdk.org/jeps/286))中引入(Lambda中尚不支持)，Java 11([JEP 323: Local-Variable Syntax for Lambda Parameters](https://openjdk.org/jeps/323))中得到改进

该功能允许声明局部变量时可以略去显式类型声明，变量类型由编译器推断，某些场景中可以使代码精炼易读。如下所示。

```java
var awesome = new MyAwesomeClass();
```

> 注意：**与动态类型无关**。

但也有些场景，使用显式类型声明更具优势，以下通过几个例子讨论。

在源码中移除显式的类型信息，可能会影响可读性。IDE能起到一定帮助，但是在代码评审或快速浏览代码时就会有影响。例如在工厂模式或构造者模式中，就要找到负责构建对象的代码，才能推断出其类型。参考以下示例。

```java
var date = LocalDate.parse("2019-08-13");   // LocalDate 
var dayOfWeek = date.getDayOfWeek();        // java.time.DayOfWeek
var dayOfMonth = date.getDayOfMonth();      // int
```

对以上示例，若使用Joda库，调用`date.getDayOfWeek()`时返回值为整型，同样的方法名在不同的库中返回值也不一定相同。
当代码较长时，翻看上下文确定类型变得更加困难，因此使用`var`要时刻考虑代码可读性。

> **时刻考虑可读性**

此外，`var`消除所有可用的类型信息，甚至导致无法被推断。绝大多数情形中编译器能捕获问题，例如`var`不能针对lambda和方法引用进行推断，因为编译器依赖于表达式左边的声明来确定类型。但也存在一些例外。

比如当和钻石操作符搭配使用时。例如`var map = new HashMap<>();`，语法上是可行的，编译器甚至不会报出警告。然而完全不指定泛型类型，类型推断会给出`Map<Object, Object>`的结果，这大概率并非预期。此时可以考虑常规语法`Map<String, String> map = new HashMap<>();`，或者替换掉类型操作符`var map = new HashMap<String, String>();`。

与基础类型使用时也会有问题，例如`byte b = 1`/`short s = 1`/`int i = 1`/`long l = 1`/`floate f = 1`/`double d = 1`，没有显式类型声明时，类型会被推断为`int`。处理基本类型时，要么使用类型字面量(例如`1L`/`1.0F`/`1.0D`)，要么完全不使用`var`。

> **保留重要的类型信息**

参考官方针对`var`的代码风格指南([Local Variable Type Inference *Style Guidelines*](https://openjdk.org/projects/amber/guides/lvti-style-guide))和常见问题([Local Variable Type Inference *Frequently Asked Questions*](https://openjdk.org/projects/amber/guides/lvti-faq))。

使用中尽量以保守的态度引入代码，在局部变量中使用，使之尽量在较小的作用域中生效。

仍需强调，**`var`并非是个新的关键字，而是个保留类名**。当它用作类型名的时候是有特殊含义的，其他场景下依然是个合法的标识符。例如`var var = 10`是个合法的声明。

目前尚不存在特定的关键字来声明不可变(例如`val`或`const`)，目前可以用`final var`达成预期。

> **参考官方的代码风格指南**

## Java 14

### `switch`表达式

> 可用: 14-[JEP 361: Switch Expressions](https://openjdk.org/jeps/361) (预览: 12-[JEP 325: Switch Expressions (Preview)](https://openjdk.org/jeps/325); 13-[JEP 354: Switch Expressions (Second Preview)](https://openjdk.org/jeps/354))

`switch`不再只是**语句**，可以是**表达式**，但要注意两者语法略有区别。

语句示例如下，官方文档请参考[The `switch` Statement](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html)

```java
// switch语句语法，逻辑上是if-else-if的简化。
// 接受的数据类型如下:
//  1. 基本数据类型: byte short int char
//  2. 包装数据类型: Byte Short Integer Character
//  3. 字符串(Java SE 7开始支持)
//  4. 枚举类型(Java SE 7开始支持)
// 注意：
//  1. 缺少break会导致的击穿(fall-through，即代码连续执行)；
//  2. null会导致抛出空指针异常
//  3. 所有case共享一个作用域(临时变量不允许重复定义)
switch (expr) {
    case value1:
        // code
        break;
    case value2:
    case value3:
        // code
        break;
    default:
        // code
}
```

表达式示例如下，可用于任何接受表达式的地方，例如函数参数。

```java
int numLetters = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY -> 7;
    default -> {
        String s = day.toString();
        int result = s.length();
        yield result;
    }
};
```

+ 表达式不存在击穿，可以为`case`指定多个常量，逗号分隔。
+ 分支可以是单个表达式，也可是语句块中的多条语句(必须以`yield value;`语句返回该语句块的求值结果)。
+ 分支是独立作用域，因此可以随意定义同名变量。
+ 表达式**必须覆盖所有条件**，对于常规的字符串、基本类型及其包装类型等，必须提供`default`分支；对于枚举，要么显式声明所有情况，要么提供`default`，前者是最佳实践，当枚举值变更时，编译阶段即可发现错误。

> 推荐使用表达式而不是语句

> 此处同时记录类似语句的冒号语法，但**强烈不建议使用**！
> 
> ```java
> int result = switch (s) {
>     case "foo":
>     case "bar":
>         yield 2;
>     default:
>         yield 3;
> };
> ```
> 
> 这种形式也能作为表达式使用，但**击穿**和**共享作用域**也出现了。强烈不推荐，使用箭头形式的表达式即可，避免所有问题。

## Java 15

### 1. 文本块

> 可用: 15-[JEP 378: Text Blocks](https://openjdk.org/jeps/378) (预览: 13-[JEP 355: Text Blocks (Preview)](https://openjdk.org/jeps/355); 14-[JEP 368: Text Blocks (Second Preview)](https://openjdk.org/jeps/368))

```java
String html = """
          <html>
            <body>
              <p>Hello, world</p>
            </body>
          </html>
          """;

System.out.println(html);
```

该功能简化多行文本初始化工作。文本块与字符串字面量相似，但换行和引号都不需要转义。

文本块以`"""`开始，后面紧跟换行；以`"""`结束，可以紧跟最后一行，也可以单独一行。源代码中每个换行的地方都会产生一个`\n`字符。

文本段可以和相邻的Java代码对齐，编译器会检查每行用于缩进的空格，找到缩进最少的行，然后将每行都转化为这个相同的最少缩进。若结尾的`"""`是在一个单独的行，注意它的缩进情况，有可能会整体的缩进发生改变。开头的`"""`不会影响缩进移除，所以文本块没有必要和其对齐。

`String`类提供了编程方式处理缩进的方法，`indent`方法接受一个整数参数，返回新的符合特定缩进级别的字符串；`stripIndent`方法返回移除所有缩进的字符串。

此外，使用文本块需要注意以下事项：
+ 尚不支持插值，当前可以用`String::formatted`及`String::format`来实现。
+ 行尾空格通常会被忽略掉，当需要行尾空格时，要在行尾添加`\s`或`\t`。
+ 换行使用`\n`，与当前操作系统或源代码采用的换行符无关，若存在兼容性问题，可以用`String::replace`进行替换。
+ 源代码可以采用任意类型的缩进：制表符、空格或者两者混用，但文本块的每行必须使用一致的缩进。

### 2. 携带详细信息的空指针异常

> 可用: 15-[Enable ShowCodeDetailsInExceptionMessages by default](https://bugs.openjdk.org/browse/JDK-8233014) (14-[JEP 358: Helpful NullPointerExceptions](https://openjdk.org/jeps/358) 启动程序时需指定`-XX:+ShowCodeDetailsInExceptionMessages`参数)

```java
node.getElementsByTagName("name").item(0).getChildNodes().item(0).getNodeValue();

// 以前的异常信息
Exception in thread "main" java.lang.NullPointerException
        at Unlucky.method(Unlucky.java:83)

// 现在的异常信息，包含不能被执行的步骤，及其失败原因
Exception in thread "main" java.lang.NullPointerException:
  Cannot invoke "org.w3c.dom.Node.getChildNodes()" because the return value of "org.w3c.dom.NodeList.item(int)" is null
        at Unlucky.method(Unlucky.java:83)
```

空指针异常扩展是在JVM层面实现的，即使代码编译为较老的Java版本或者其他的JVM语言(例如Scala或Kotlin)也同样能受益。

但并非所有的空指针异常都能得到这些额外的信息，仅仅是被JVM创建并抛出的才行：
+ 对`null`读写字段
+ 对`null`调用方法
+ 对`null`数据读写元素(索引信息不会输出)
+ 对`null`拆箱

此外，该功能不支持序列化。例如通过RMI方式远程调用代码发生异常时，异常信息里不会包含相关信息。

## Java 16

### 1. 记录类

> 可用: 16-[JEP 395: Records](https://openjdk.org/jeps/395) (预览: 14-[JEP 359: Records (Preview)](https://openjdk.org/jeps/359); 15-[JEP 397: Sealed Classes (Second Preview)](https://openjdk.org/jeps/397))

记录类给Java带来了数据类和封闭类型([Data Classes and Sealed Types for Java](https://openjdk.org/projects/amber/design-notes/records-and-sealed-classes))，用于携带不可变数据。记录类可以视为*元组(tuple)*。

```java
public record Point(int x, int y) {}
```

以上简练的语法声明了一个记录类`Point`，其具备以下定义
+ 两个`private final`字段`int x`和`int y`
+ 一个接受`x`和`y`作为参数的构造器
+ 字段getter方法`x()`和`y()`
+ 纳入字段`x`和`y`的方法`hashCode`、`equals`和`toString`

使用方式与普通类一致。

```java
var point = new Point(1, 2);
point.x(); // returns 1
point.y(); // returns 2
```

记录类设计为**浅层不可变数据(shallowly immutable data)**的**透明载体(transparent carriers)**，因此存在一些限制。




### 2. `instanceof`模式匹配

















## Java 21 (LTS)

### 1. `switch`模式匹配

> 可用: [JDK 21](https://openjdk.java.net/jeps/441); 预览: [JDK 20](https://openjdk.java.net/jeps/433), [JDK 19](https://openjdk.java.net/jeps/427), [JDK 18](https://openjdk.java.net/jeps/420)

`switch`表达式可以对**任意类型**进行复杂的**模式匹配**，以下通过示例演示。

#### 1.1 常量匹配

> 与传统的表达式用法基本一致

```java
// 对枚举值进行匹配
var symbol = switch (expr) {
    case ADDITION       -> "+";
    case SUBTRACTION    -> "-";
    case MULTIPLICATION -> "*";
    case DIVISION       -> "/";
};
```

#### 1.2 类型模式匹配

> 类似Java 16中支持的[`instanceof`模式匹配](#2-instanceof模式匹配)，可参考[JEP 394: Pattern Matching for instanceof](https://openjdk.java.net/jeps/394)

```java

```



---

> 近期终于能稍微抽身，做些“新潮”的东西，动手时与时代的脱节感愈发强烈，甚至感觉无从下手。
> 翻看Git仓库，上次正经整理博客是2020年，已经是五年前的事情了。这五年感觉像是遗失的梦一般，倏忽跳跃到现在，向前回忆却想不到闪光之处。懈怠多年，轻易挥霍时光，对自己感到遗憾和抱歉。
> 学习应当是终生坚持的事情，无论是编程还是其他。重新出发，充实自己，永不止步。
