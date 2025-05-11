---
title: Java语言功能更新
description: Java语言相关的功能更新(9->21(LTS))(2017-09->2023-09)
author: mxtao
categories: ["language basics"]
tags: ["language basics", "java"]
date: 2025-05-08
modified: 2025-05-11 09:00:00
---

# Java语言功能更新

> 当前整理范围: JDK9->JDK21(LTS)

## 参考链接

1. [A categorized list of all Java and JVM features since JDK 8 to 21](https://advancedweb.hu/a-categorized-list-of-all-java-and-jvm-features-since-jdk-8-to-21/) by [Dávid Csákvári](https://advancedweb.hu/dodie.html)
2. [New language features since Java 8 to 21](https://advancedweb.hu/new-language-features-since-java-8-to-21/) by [Dávid Csákvári](https://advancedweb.hu/dodie.html)
3. [Java 9 到 21 的语言特性更新](https://nanova.me/posts/Java-lang-updates) by [Alex Tan](https://nanova.me/posts/about_me) - *本文是引文2中文翻译&整理*
4. [Java Language and Virtual Machine Specifications](https://docs.oracle.com/javase/specs/index.html)
5. [Java Platform, Standard Edition Java Language Updates, Release 21](https://docs.oracle.com/en/java/javase/21/language/index.html) - Oracle官方整理的Java SE 9到特定版本的语言功能更新(修改URL中的版本号可以查看9到其他版本的功能更新)
6. [JEP 0: JEP Index](https://openjdk.org/jeps/0) 

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
>
> 其它相关内容: [Data Classes and Sealed Types for Java](https://openjdk.org/projects/amber/design-notes/records-and-sealed-classes); [Records Come to Java](https://blogs.oracle.com/javamagazine/post/records-come-to-java#anchor_4)

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

记录类设计为**浅层不可变数据(shallowly immutable data)**的**透明载体(transparent carriers)**，定义和使用都存在限制。

+ 记录类的字段默认`final`，实际上**不允许非`final`字段**。
+ 定义记录时必须提供所有字段，记录体内不允许定义额外字段。
+ 允许定义额外的构造方法来提供默认值，但无法隐藏包含所有字段的*标准构造方法(canonical constructor)*。
+ 不能继承其它类，是隐式`final`的，不能被继承。
+ 不能是抽象的。
+ 不能声明`native`方法。

记录类强调**不可变**性，字段赋值只能通过构造方法。
编译器自动添加的隐式标准构造方法和类具有一致的可见性，显式声明标准构造方法时其可见性不低于类本身。
可以自定义构造方法，可以是任意可见性，但其实现必须最终委派给标准构造方法完成初始化。

对于其中的每个字段，会自动生成其getter，名称与字段名一致。可以显式定义甚至重写。

记录类可以拥有静态方法和实例方法。

代码示例如下。
```java
record Point(int x, int y) {
    // 显式声明标准构造方法，对数据进行验证，只能保持或放大可见性
    public Point {
        if (x < 0) {
            throw new IllegalArgumentException("x >= 0");
        }
        if (y < 0) {
            // 只能在标准构造方法中进行赋值操作
            y = 0;
        }
    }
    // 声明额外构造方法，委派给标准构造方法，可以限制可见性
    Point(int i) {
        this(i, i);
    }
    // 声明额外构造方法，委派给其它构造方法，最终由标准构造方法完成初始化，可以限制可见性
    private Point() {
        this(0);
    }
    // 显式定义或重写默认为x提供的getter，同样可以处理hashCode equals toString
    @Override
    public int x() {
        // code...
        return x;
    }
    // 支持静态方法
    static Point zero() {
        // 调用了私有构造方法
        return new Point();
    }
    // 支持实例方法
    boolean isZero() {
        return x == 0 && y == 0;
    }
}
```

**记录类专注于承载数据**，因此定制性略有受限。但也是得益于这样的设计，序列化也十分容易且安全(相比于常规的类)。

> 记录类的实例能被序列化和反序列化。然而不能通过提供`writeObject` `readObject` `readObjectNoData` `writeExternal`或 `readExternal`方法来自定义其处理流程。记录类的组件（字段）负责序列化，而记录类的标准构造方法掌管反序列化。

序列化正好基于成员变量的状态，反序列化又总会调用标准构造方法，所以不可能创建一个无效状态的记录类。
从开发者角度看，序列化和反序列化与以往一样。

```java
public record Point(int x, int y) implements Serializable { }

public static void recordSerializationExample() throws Exception {
    Point point = new Point(1, 2);

    // 序列化
    ObjectOutputStream oos =
        new ObjectOutputStream(new FileOutputStream("tmp"));
    oos.writeObject(point);

    // 反序列化
    ObjectInputStream ois =
        new ObjectInputStream(new FileInputStream("tmp"));
    Point deserialized = (Point) ois.readObject();
}
```

关于记录类，推荐注意以下实践。

> 1. 使用本地记录类来构建中间转化变量

复杂的数据转换需要中间变量，Java 16之前的典型方案是依赖于`Pair`或三方库里相似的holder类，再或者是自己定义（可能是静态内部）类来承载数据。前者通常不够灵活，后者又在仅用于单个方法的上下文中引入了其它类，污染了命名空间。虽然也可以在方法体中定义类，但也因为其啰嗦的语法很少这么用。

Java 16进行了改进，可以在方法体中定义本地记录类。

```java
public List<Product> findProductsWithMostSaving(List<Product> products) {
    record ProductWithSaving(Product product, double savingInEur) {}

    products.stream()
        .map(p -> new ProductWithSaving(p, p.basePriceInEur * p.discountPercentage))
        .sorted((p1, p2) -> Double.compare(p2.savingInEur, p1.savingInEur))
        .map(ProductWithSaving::product)
        .limit(5)
        .collect(Collectors.toList());
}
```

记录类紧凑的语法正好契合 Steam API 紧凑的语法。

除了记录类外，这个改进也适用于**本地枚举**甚至**接口**。

> 2. 检查引用的类库

记录类没有遵循[JavaBeans](https://www.oracle.com/java/technologies/javase/javabeans-spec.html)的约定，一些遵循约定的工具类和记录类可能不能正常使用。
+ 没有默认的构造方法
+ 没有`setter`方法
+ 访问器方法不依照`getX()`格式

例如，**记录类不能用作JPA(例如Hibernate)的实体**。有一些关于[JPA遵循记录类规范的讨论](https://www.eclipse.org/lists/jpa-dev/msg00056.html)，但迄今为止没找到相关开发进度的报道。但也有文章指出将[记录类能应用到项目中](https://thorben-janssen.com/java-records-hibernate-jpa/)且没有问题。

大多数[Dávid Csákvári](https://advancedweb.hu/dodie.html)[试过的工具类](https://advancedweb.hu/working-with-structured-data-in-java/)（包括[Jackson](https://github.com/FasterXML/jackson)，[Apache Commons Lang](https://commons.apache.org/proper/commons-lang/)，[JSON-P](https://javaee.github.io/jsonp/)，[Guava](https://github.com/google/guava) ）都支持记录类，但还存在些小问题。比如，流行的JSON库Jackson较早就[支持记录类](https://github.com/FasterXML/jackson-future-ideas/issues/46)。它的大多数特性，包括对记录类和 JavaBeans 的序列化、反序列化都没什么问题，但[操控对象的特性还没适配](https://github.com/FasterXML/jackson-databind/issues/3079)。

[Spring](https://dzone.com/articles/jdk-14-records-for-spring-devs)也在许多情况下对记录类提供开箱即用的支持，包括序列化甚至依赖注入，但许多 Spring 应用程序使用的[ModelMapper库](https://github.com/modelmapper/modelmapper)[不支持将JavaBeans映射到记录类](https://github.com/modelmapper/modelmapper/issues/546)。

建议在使用记录类前先升级并检查使用的工具库，避免意外之喜，但大体上来说，可以认为流行的工具库已经涵盖了大部分特性。

参看[关于记录类的工具库集成试验](https://github.com/dodie/java-tutorials/tree/master/working-with-structured-data)。

> 3. 使用模式匹配快速访问字段

实践中建议考虑使用[`switch`模式匹配](#1-switch模式匹配)及[`instanceof`模式匹配](#2-instanceof模式匹配)与记录类结合使用，便捷地解构对象。

### 2. `instanceof`模式匹配

> 可用: 16-[JEP 394: Pattern Matching for instanceof](https://openjdk.org/jeps/394) (预览: 14-[JEP 305: Pattern Matching for instanceof (Preview)](https://openjdk.org/jeps/305); 15-[JEP 375: Pattern Matching for instanceof (Second Preview)](https://openjdk.org/jeps/375))

```java
// 传统形式代码，需要进行显式类型转换
if (obj instanceof String) {
    String s = (String) obj;
    // code
}

// 现在更简练
if (obj instanceof String s) {
    // code
}
```

该模式是类型检查(`obj instanceof String`)和模式变量(`s`)的组合，类型检查和旧的`instanceof`操作符几乎一样，但模式确定无法匹配的话会导致编译错误。示例如下。

```java
// 该模式匹配必定失败，因此在编译时报错
Integer i = 1;
if (i instanceof String s) { 
    // code
} 
```

仅在检查通过时，模式变量才会从目标变量中提取出来。几乎和常规的非`final`变量一样，**值能被修改**、**会隐藏(shadow)字段**、同名变量引发编译错误。但模式变量作用域是基于控制流分析确定的，仅限在**明确匹配(definitely matched)**的作用域内生效，甚至支持更复杂的情形。

```java
// 可以用于后续判断
if (obj instanceof String s && s.length() > 5) {
    // code...
}

// 也支持提前返回值或抛出异常
private static int getLength(Object obj) {
    if (!(obj instanceof String s)) {
        throw new IllegalArgumentException();
    }
    // 代码是正确的，此处是模式变量的作用域
    return s.length();
}
```

流程控制的作用域解析和现有的流程解析很相似，比如对[明确赋值(definite assignment)](https://docs.oracle.com/javase/specs/jls/se15/html/jls-16.html)的检查，代码示例如下。

```java
private static int getDoubleLength(String s) {
    int a; // 声明但未赋值
    if (s == null) {
        return 0; // 已返回
    } else {
        a = s.length(); // 赋值
    }
    // 已确定完成赋值 因此直接可用
    a = a * 2;
    return a;
}
```

相对于其它现代编程语言还是稍显啰嗦，例如kotlin无需声明模式变量，直接在原变量上调用方法。但实际上模式变量是确保向后兼容性的手段。改变`obj instanceof String `中的类型也就意味着，在其被用作重载方法参数的时候，调用可能会被解析成这个方法的不同版本。

```kotlin
if (obj is String) {
    print(obj.length)
}
```

> 在该版本中预览了记录类和模式匹配组合使用的“记录类模式”，该模式匹配将在下文详细介绍。

## Java 17 (LTS)

### 封闭类

> 可用: 17-[JEP 409: Sealed Classes](https://openjdk.org/jeps/409) (预览: 15-[JEP 360: Sealed Classes (Preview)](https://openjdk.org/jeps/360); 16-[JEP 397: Sealed Classes (Second Preview)](https://openjdk.org/jeps/397))

封闭类用于限定哪些类或接口可以被用于继承或实现它们。之前的机制是`final`结合访问修饰符，标记为`final`的类不允许被继承，配合访问修饰符就能确保仅同一包中的类才能继承。封闭类提供更细粒度的控制，让开发者能显式地列举其子类。

```java
// sealed声明封闭类，permits声明允许直接继承该封闭类的类型(实际上permits是要求必须直接继承封闭类)
public sealed class Shape
    permits Circle, Quadrilateral, WeirdShape {}

// final声明该类不允许再被继承
public final class Circle extends Shape {}

public sealed class Quadrilateral extends Shape
    permits Rectangle, Parallelogram {}
public final class Rectangle extends Quadrilateral {}
public final class Parallelogram extends Quadrilateral {}

// non-sealed声明该类可以被任意继承
public non-sealed class WeirdShape extends Shape {}
```

继承封闭类时，必须通过添加`final`/`sealed`/`non-sealed`显式定义出封闭类的边界，这也就使整条继承链的继承情况是明确定义的。

**被允许继承的类必须和父类（封闭类）在同一个包里**，如果是使用java模块，那它们必须在同一模块中。

如果类都比较简短，且大部分和数据相关，可以声明在同一个源文件，`permits`关键字可以忽略。

```java
public sealed class Shape {
    public final class Circle extends Shape {}

    public sealed class Quadrilateral extends Shape {
        public final class Rectangle extends Quadrilateral {}
        public final class Parallelogram extends Quadrilateral {}
    }

    public non-sealed class WeirdShape extends Shape {}
}
```

记录类是隐式`final`的，可以作为封闭类的子类。

> 推荐使用封闭类而非枚举

，比如：
java

enum Expression {
  ADDITION,
  SUBTRACTION,
  MULTIPLICATION,
  DIVISION
}

在封闭类出现前，只能用枚举类对固定可选项建模。然而所有的情况都要在同一个源文件中写完，且枚举类仅支持常量，不支持需要实例的情况，例如表示一个类型的单个消息。

封闭类提供一个比枚举类更好的选择，使得用普通类来为固定可选项建模成为可能。配合`switch`模式匹配就更能充分发挥其作用，封闭类能像枚举一样在`switch`表达式中使用，编译器能自动检查代码是否涵盖了全部情况。

枚举类的值可以使用`values`方法列举出来。对应到封闭类和封闭接口，可以使用`getPermittedSubclasses`方法例举出所有被允许继承的子类。

## Java 21 (LTS)

### 1. `switch`模式匹配

> 可用: 21-[JEP 441: Pattern Matching for switch](https://openjdk.java.net/jeps/441); 预览: 17-[JEP 406: Pattern Matching for switch (Preview)](https://openjdk.org/jeps/406); 18-[JEP 420: Pattern Matching for switch (Second Preview)](https://openjdk.org/jeps/420); 19-[JEP 427: Pattern Matching for switch (Third Preview)](https://openjdk.org/jeps/427); 20-[JEP 433: Pattern Matching for switch (Fourth Preview)](https://openjdk.org/jeps/433)

`switch`表达式可以对**任意类型**进行复杂的**模式匹配**，以下通过示例演示。

`switch`支持常量模式匹配，与传统的表达式用法基本一致

```java
// 对枚举值进行匹配
var symbol = switch (expr) {
    case ADDITION       -> "+";
    case SUBTRACTION    -> "-";
    case MULTIPLICATION -> "*";
    case DIVISION       -> "/";
};
```

`switch`支持类型模式匹配，类似[`instanceof`模式匹配](#2-instanceof模式匹配)

```java
return switch (expression) {
    case Addition expr       -> "+";
    case Subtraction expr    -> "-";
    case Multiplication expr -> "*";
    case Division expr       -> "/";
};
```

模式还支持**卫语句(guard)**，写法为`type pattern when guard expression`

```java
String formatted = switch (o) {
    case Integer i when i > 10 -> String.format("a large Integer %d", i);
    case Integer i             -> String.format("a small Integer %d", i);
    default                    -> "something else";
};
```

这与`instanceof`模式匹配是一致的，代码如下所示。

```java
if (o instanceof Integer i && i > 10) {
    return String.format("a large Integer %d", i);
} else if (o instanceof Integer i) {
    return String.format("a large Integer %d", i);
} else {
    return "something else";
}
```

模式变量作用域也类似，是分支敏感的。例如在`case Integer i && i > 10 -> String.format("a large Integer %d", i);`语句中，变量`i`作用域是卫语句及其右侧的表达式。

`switch`支持匹配`null`值。传统的`switch`语句接受到`null`时会抛出空指针异常，`switch`表达式为保持后向兼容性，当没有显式声明`null`模式时也会抛出异常。

```java
switch (s) {
    case null  -> System.out.println("Null");
    case "Foo" -> System.out.println("Foo");
    default    -> System.out.println("Something else");
}
```

`switch`表达式必须是详尽的，要求覆盖所有可能输入。该约束与枚举、封闭类和泛型能很好协作。若只有一组固定输入，那便可以略去默认分支。这对维护代码有很大帮助，例如当给枚举新增常量，那么涉及该枚举的所有缺失默认分支的匹配都会在编译时抛出错误。详尽性检查是在编译时进行，但如果在运行时有新的实现（例如来自单独的编译），编译器还会插入一个默认分支去抛出`MatchException`。

```java
sealed interface I<T> permits A, B {}
final class A<X> implements I<String> {}
final class B<Y> implements I<Y> {}

static int testGenericSealedExhaustive(I<Integer> i) {
    return switch (i) {
        case B<Integer> bi -> 42;
    };
}
```

以上代码来自[JEP 441: Pattern Matching for switch](https://openjdk.java.net/jeps/441)，展示了模式匹配与封闭类和泛型的写作，代码能正确通过编译是因为编译器可以检测到只有`A`和`B`是`I`的有效子类型，并且由于泛性参数`Integer`，该参数只能是`B<Integer>`的实例。

编译器也会执行与详尽性检查相反的操作，当编译器发现一个分支完全涵盖另一个分支时，会报出编译错误。代码示例如下。

```java
Object o = 1234;
// 编译错误，第二个条件已包含在第一个条件分支中
String formatted = switch (o) {
    case Integer i             -> String.format("a small Integer %d", i);
    case Integer i when i > 10 -> String.format("a large Integer %d", i);
    default                    -> "something else";
};
```

出于代码可读性及正确性原因，强烈建议将常量匹配放在其相应的类型匹配之前，使更具体的分支先被匹配到。考虑以下代码，如果将常量匹配与带卫语句的类型匹配交换次序，当传入`1`时，会得到不同的结果。

```java
switch(num) {
    case -1, 1 -> "special case";
    case Integer i when i > 0 -> "positive number";
    case Integer i -> "other integer";
}
```

> 原文说的是编译器强制要求常量置前，实测并非如此。

### 2. 记录类模式

可用: 21-[JEP 440: Record Patterns](https://openjdk.org/jeps/440) (预览: 19-[JEP 405: Record Patterns (Preview)](https://openjdk.org/jeps/405); 20-[JEP 432: Record Patterns (Second Preview)](https://openjdk.org/jeps/432))

记录类模式可以看作更强大的类型模式，在匹配时可以直接解构出对象的值(支持嵌套)。

```java
interface Point { }
record Point2D(int x, int y) implements Point { }
record Point3D(int x, int y, int z) implements Point { }

enum Color { RED, GREEN, BLUE }
record ColoredPoint(Point p, Color c) { }

// 构造对象
Point p1 = new ColoredPoint(new Point2D(3, 4), Color.GREEN);
Point p2 = new ColoredPoint(new Point2D(1, 2, 3), Color.RED);

// switch模式匹配解构对象
var length = switch (p) {
    case ColoredPoint(Point3D(int x, int y, int z), Color c) -> Math.sqrt(x*x + y*y + z*z);
    case ColoredPoint(Point2D(int x, int y), Color c) -> Math.sqrt(x*x + y*y);
    case ColoredPoint(Point p, Color c) -> 0;
}

// instanceof模式匹配也可以直接解构，实践中按需选择即可
if (p instanceof ColoredPoint(Point2D(int x, int y), Color c)) {
    // code
} else if (p instanceof ColoredPoint(Point3D(int x, int y, int z), Color c)) {
    // code
}
```

记录类模式简化了复杂的对象类型验证及字段提取工作，尤其是有嵌套对象的场景。

### 3. 其它预览功能

> JDK21中还有如下的预览语言功能，此处仅记录。待到下个LTS版本发布(Java 25 2025-09)再做详细整理。

1. 匿名模式和匿名变量 [JEP 443: Unnamed Patterns and Variables (Preview)](https://openjdk.org/jeps/443)
2. 字符串模板 [JEP 430: String Templates (Preview)](https://openjdk.org/jeps/430)
3. 未具名类和实例主方法 [JEP 445: Unnamed Classes and Instance Main Methods (Preview)](https://openjdk.org/jeps/445)

---

> 近期终于能稍微抽身，做些“新潮”的东西，动手时与时代的脱节感愈发强烈，甚至感觉无从下手。
> 翻看Git仓库，上次正经整理博客是2020年，已经是五年前的事情了。这五年感觉像是遗失的梦一般，倏忽跳跃到现在，向前回忆却想不到闪光之处。懈怠多年，轻易挥霍时光，对自己感到遗憾和抱歉。
> 学习应当是终生坚持的事情，无论是编程还是其他。重新出发，充实自己，永不止步。
