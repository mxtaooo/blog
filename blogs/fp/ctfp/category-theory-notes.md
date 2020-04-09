---
author: mxtao
date: 2020-04-07
---

# 范畴论

## 一些概念

+ 范畴 / Category

    一些事物（称为对象/object）及事物之间的关系（称为态射/morphism）构成一个范畴。

    > 编程语言中，一般是类型体现为对象，函数体现为态射。

+ 复合 / Composition

    范畴的本质是复合，或者说复合的本质是范畴。若有从对象A到对象B的态射，也有从对象B到对象C的态射，那么必定存在从对象A到对象C的复合态射。

    数学中，一般以 $g \circ f$ 表示函数复合（复合顺序从右向左，即 $g \circ f = \lambda x.g \lparen f \lparen x \rparen \rparen$，可读作“g after f”）。下以几种函数式编程语言进行复合思想的演示

    ```haskell
    -- Haskell

    -- Haskell中，小写字母表示类型参数，具体类型是大写字母开头
    f :: a -> b     -- 接受a返回b的函数
    g :: b -> c     -- 接受b返回c的函数
    -- 用`.`符进行复合，同数学写法一致，从右向左
    g . f           -- f g 复合，其签名 `a -> c`
    ```

    ```fsharp
    // F#
    
    // F# 中无 `Bottom Type` 的概念。F#中以`'`作为前缀的类型名称视为类型参数
    let f : 'a -> 'b = fun x -> failwith "not implement"
    // let f<'a, 'b> : 'a -> 'b = failwith "not implement" -- 另一种方式
    let g : 'b -> 'c = fun x -> failwith "not implement"

    // 用内置操作符`>>` `<<`进行复合，前者从左向右，后者从右向左
    f >> g          // 从左向右复合
    g << f          // 从右向左复合
    ```

    ```scala
    // Scala

    // Scala 中 `???` 是个 `Nothing` 类型值，`Nothing` 是Scala中的"Bottom Type"

    // Scala中的方法/Method 函数/Function 函数值/Function Value 概念存在区别和联系
    //   方法强调的是“实例方法”，是在“对象实例”上进行调用的。在trait、class中以`def`关键字定义的有参值是方法（Scala模糊了无参方法和属性的界限，无参方法可以不带括号调用求值）
    //   函数无需任何实例即可调用，一般只能进行形如`func(arg)`的调用求值操作。在object、函数中以`def`关键字定义的可视为函数
    //   函数值可视为一个函数实例，可以调用其实例方法。以λ给出的值、函数经`func _`转换的值、方法经`obj.method _`转换的值都是函数值，可将该值绑定到`funcVal`上
    //      `funcVal.apply(arg)` 传入参数求值（可以直接这样用`funcVal(arg)`，会转换成对`apply`方法的调用）
    //      `funcVal.compose(funcVal')` 传入另一个函数值，进行函数复合，其顺序从右向左
    //      `funcVal.andThen(funcVal')` 传入另一个函数值，进行函数复合，其顺序从左向右
    //      ...
    //      注：`andThen` `compose`方法混入自`Function1`特质 (仅`Function1`特质定义了此方法，换言之，仅单参数列表、单参数函数才能进行复合)
    //
    // Scala中的函数和方法可以是参数多态/泛型的，但函数值必定是确定类型的

    // Scala中函数不是自动柯里化/Currying，只能以定义多参数列表函数的形式进行显式柯里化（λ表达式写出柯里化不需任何特殊处理）
    //      def func(x: A)(y: B)(z: C): X = ???
    //      val func = (x: A) => (y: B) => (z: C) => ???
    //      val func: A => B => C => X = x => y => z => ???

    val f : A => B = ???
    val g : B => C = ???
    g compose f     // 从右向左复合，方法作为中缀操作符形式
    g.compose(f)    // 从右向左复合，实例方法调用形式
    f andThen g     // 从左向右复合，方法作为中缀操作符形式
    f.andThen(g)    // 从左向右复合，实例方法调用形式
    ```

    态射的复合需要满足以下两个性质

    1. 结合律 / associative

        复合要满足结合律。若有三个态射 $f$ $g$ $h$ 可被复合（即对象可被首尾相连），必有 $h \circ \lparen g \circ f \rparen$ = $\lparen h \circ g \rparen \circ f$ = $h \circ g \circ f$。下面编程语言中以伪代码演示该性质（编程语言未定义“函数相等”）

        ```haskell
        -- Haskell
        f :: A -> B
        g :: B -> C
        h :: C -> D
        h . (g . f) == (h . g) . f == h . g . f
        ```

        ```fsharp
        // F#
        let f : 'a -> 'b = fun x -> failwith "not implement"
        let g : 'b -> 'c = fun x -> failwith "not implement"
        let h : 'c -> 'd = fun x -> failwith "not implement"
        h << (g << f) == (h << g) << f == h << g << f   // 从右向左复合
        f >> (g >> h) == (f >> g) >> h == f >> g >> h   // 从左向右复合
        ```

        ```scala
        // Scala
        val f : A => B = ???
        val g : B => C = ???
        val h : C => D = ???
        h compose g compose f       // 从右向左复合
        f andThen g andThen h       // 从左向右复合
        ```

        对于函数复合的结合律，以上演示应当还是比较显而易见，但是在其它范畴中，可能结合律并不是那么显然。

    2. 恒等态射 / identity morphism

        范畴中的任一对象，都存在恒等态射。这个态射从自身出发又返回自身。它是复合的最小单位。恒等态射与任何（符合复合条件的）态射复合，得到的都是后者自身。恒等态射称为$id_A$（意为 identity on A，即A与自身恒等）。

        在数学中，若有接受$A$返回$B$的函数$f$，则有$f \circ id_A = f$ 和 $id_B \circ f = f$

        编程语言中的实现很简单，只需要简单地把输入返回即可（一般函数式编程语言标准库中已有该基本元素）

        ```haskell
        -- Haskell

        id :: a -> a        -- `id` 的函数签名，接受任意类型并返回此类型
        id x = x            -- `id` 的定义   注：Haskell标准库（称为Prelude）已定义
        
        f :: a -> b         -- 它与恒等函数复合之后还是其自身， 注：Haskell中是从右向左复合
        id . f == f         -- 这里的 `id` 是 `id_b`
        f . id == f         -- 这里的 `id` 是 `id_a`
        ```

        ```fsharp
        // F#

        // FSharp.Core 中 `id` 的定义、并以特性方式注明了编译成程序集之后的名称
        [<CompiledName("Identity")>]
        let id x = x    // F#具备自动泛化/Automatic Generalization特性，其类型是 `id : 'a -> 'a`

        let f : 'a -> 'b = fun x -> failwith "not implement"

        id >> f == f    // 从左向右复合，此处 `id` 是 `id_a`
        f >> id == f    // 从左向右复合，此处 `id` 是 `id_b`

        id << f == f    // 从右向左复合，此处 `id` 是 `id_b`
        f << id == f    // 从右向左复合，此处 `id` 是 `id_a`
        ```

        ```scala
        // Scala

        // scala-library 中 `identity` 的定义，标注了 `@inline`
        @inline def identity[A](x: A): A = x

        val f : a => b = ???

        (identity[b] _) compose f == f      // 从右向左复合，此处 `identity` 是 `identity_b`
        f compose identity[a] == f          // 从右向左复合，此处 `identity` 是 `identity_a`

        f andThen identity[b] == f          // 从左向右复合，此处 `identity` 是 `identity_b`
        (identity[a] _) andThen f == f      // 从左向右复合，此处 `identity` 是 `identity_a`
        ```

+ 函数 / Function

    数学上的函数是值到值的映射。在编程语言中，可以实现数学上的函数：一个函数，给它一个输入值，它就计算出一个结果。每次调用时，对于相同输入，总能得到相同的输出。

    编程语言中，给出相同输入保证得到相同输出，且对外界环境无关的函数，称为纯函数。纯函数式语言Haskell中，所有函数都是纯的。对其它语言，可以构造一个纯的子集，谨慎对待副作用。之后将会看到单子如何只借助纯函数对副作用进行建模。

+ **Set**

    **Set**是集合的范畴。在**Set**中，对象是集合，态射是函数。

    存在一个空集 $\emptyset$，它不包含任何元素；也存在只有一个元素的集合。函数可以将一个集合中的元素映射到另一个集合；也能将两个元素映射为一个。但是函数不能将一个元素映射成两个。恒等函数可以将一个元素映射为本身。

+ 类型 / Type

    范畴中，并非任意两个态射皆可复合。当某态射的源与另一态射的目标是同一对象时，两态射才能复合。在编程语言中，类型关乎复合。在参数及返回类型上，两函数必须满足复合条件，这样在类型意义上程序才是安全的（当然，这一般仅是程序通过编译的保证，并非逻辑正确的保证）。

    对于类型，一个直观理解是：类型是值的集合。例如，`Bool`类型是2个元素`True` `False`的集合，`Char`类型是所有Unicode字符的集合。集合可能是有限的（例如`Bool`），也可能是无限的（例如`String`）。当声明`x :: Integer`时，是在说`x`是整型数集中的一个元素。

    理想世界中，可以说Haskell的数据类型是集合，Haskell的函数是集合之间的数学函数。但由于“数学函数只知道答案，不可被执行”，Haskell必须要计算才能得出答案。若是可以在有限步骤内计算完毕，这没有什么问题，但有些计算是递归的，可能永远不会终止。在Haskell中无法阻止无终止的计算（停机问题）。Haskell为每个类型添加了一个特殊值，称为底/Bottom，用符号表示为`_|_`或`⊥`。这个值与无休止计算有关。若一个函数声明为`f :: a -> Bool`，它可以返回`True` `False`或`_|_`，后者表示它不会终止。

    将**底**作为类型系统的一部分之后，可以将运行时错误作为**底**对待，甚至可以允许函数显式地返回底（一般用于未定义表达式）。例如声明`f :: a -> Bool` 定义`f x = undefined`。因为`undefined`求值结果是**底**，它可以是任何类型的值，因此该定义可以通过类型检查。（甚至`f = undefined`，因为**底**也是`a -> Bool`这种类型的值）。

    可以返回**底**的函数称为偏函数；全函数则可以保证对任意参数返回有效的结果。

    > 由于**底**的存在，Haskell的类型与函数的范畴称为**Hask**而不是**Set**。从实用的角度看，可以暂时无视掉这些无终止的函数与**底**，将**Hask**视为一个友善的**Set**即可。

    > 注：Scala中也有**底**类型的概念存在，`Nothing`是任何类型/`Any`的子类型，`Null`是所有引用类型/`AnyRef`的子类型。F#中没有这一概念。

    基于类型是集合的直觉，思考一些特殊情形。

    + 空集

        在Haskell中，空集是`Void`，这是个没有任何值的类型。可以定义一个接受`Void`的函数，但是无法调用它。因为无法提供一个`Void`类型的值（这种值不存在）。该函数的返回值没有任何限制，这是个多态返回类型的函数。Haskell中该函数称为`absurd :: Void -> a`。这种类型与函数，在逻辑学上有更深入的解释。`Void`表示谎言，`absurd`函数的类型相当于“由谎言可以推出任何结论”，这也就是逻辑学中的“爆炸原理”。

        > F# 和 Scala 中似乎没有 空集/`Void` 的概念 ？

    + 单例集合

        这是只有一个值的类型。它实际上是其它编程语言如C++/Java中常见的`void`类型。考虑一个函数`int f42() {return 42;}`。已知无法调用不接受任何值的函数，函数`f42`被调用时发生了什么？从概念上说，接受了一个空值。由于不会有第二个空值，所以没有显式强调它。在Haskell中为空值提供了一个符号`()`（读作"unit"，该符号既是类型也是值）

        > F#中，空值的类型为`unit`，值为`()`；Scala中空值类型为`Unit`，值为`()`，它是`AnyVal`的子类型。

        注意，每个接受unit的函数都等同于从目标类型中选择一个值的函数。实际上，可以将`f42`作为数字`42`的另一种表示方法，这也演示了如何通过与函数交互来代替显式给出集合中某个元素。这证实了数据与计算过程在本质上是没有区别的。从unit到类型A的函数就相当于集合A中的元素。

        考虑让函数返回一个unit的情形。在C++等其它编程语言中，这样的函数通常担当含有副作用的函数，这并非数学意义上的函数。一个返回unit类型的纯函数，它什么也不做；或者说，唯一做的就是丢弃接受的输入。

        ```haskell
        -- Haskell 中的 `unit` 函数
        unit :: a -> ()
        unit _ = ()
        ```

        ```fsharp
        // F# 中的 `ignore` 函数
        // ignore : 'a -> unit
        [<CompiledName("Ignore")>]
        let inline ignore _ = ()
        ```

        Scala中好像没有类似的函数

    + 二元集合

        二元集合一般对应编程语言中的布尔类型。命令式/面向对象编程语言中，该类型一般是内置的`bool`。但在Haskell中可以自行定义 `data Bool = True | False`（读作`Bool`要么是`True`要么是`False`）。（F#中也可以直接进行定义`type Bool = True | False`，Scala中需要借助封闭抽象类/sealed abstract class来定义）

        > 接受`Bool`的纯函数只是从目标类型中选择了两个值，一个关联了`True`，另一个关联了`False`。返回`Bool`的函数被称为“谓词/predicate”。

        > 注： 二元集合并非只有`Bool`，自定义类型也可能是个二元集合（例如`type Gender = Male | Female`）