---
title: 范畴论笔记 - 序
description: CTFP博客系列及视频笔记，序章
author: mxtao
categories: ["category theory", "category theory notes"]
tags: ["category theory", "category theory for programmers"]
date: 2020-03-15
modified: 2025-05-06 15:25:00
---

# Category Theory for Programmers

《面向程序员的范畴论》是Bartosz Milewski写的一系列文章，向程序员介绍范畴论的一些概念，并以代码进行概念演示。

该系列博客被整理成一个Github仓库，用于生成可下载PDF，并加入其它语言的代码样例。

国内也有大神对系列博客的第一部分进行了翻译。

这一博客系列整理为阅读笔记，期望能在读完之后对范畴论能有自己的理解。

---

作者博客：[Bartosz Milewski's Programming Cafe](https://bartoszmilewski.com/)

作者的YouTube：[Bartosz Milewski](https://www.youtube.com/user/DrBartosz/)

作者的讲解视频：[Bartosz Milewski's YouTube playlists](https://www.youtube.com/user/DrBartosz/playlists) (Category Theory videos)

CTFP-PDF：[hmemcpy/milewski-ctfp-pdf](https://github.com/hmemcpy/milewski-ctfp-pdf)

中文译者个人首页：[garfileo - SegmentFault](https://segmentfault.com/u/garfileo)

一些有趣的文章：

[单子，想弄不懂都很难](https://segmentfault.com/a/1190000012435966)

---

## ~~阅读笔记~~

本部分阅读笔记是对于翻译版和原文的对照阅读进行记录，后期比较草率。翻译版本仅第一部分，已重新写了其他笔记，并对内容进行了理解和延申

1. [Category: The Essence of Composition](./part-1/1.category-the-essence-of-composition.md)
2. [Types and Functions](./part-1/2.types-and-functions.md)
3. [Categories Great and Small](./part-1/3.categories-great-and-small.md)
4. [Kleisli Categories](./part-1/4.kleisli-categories.md)
5. [Products and Coproducts](./part-1/5.products-and-coproducts.md)
6. [Simple Algebraic Data Type](./part-1/6.simple-algebraic-data-type.md)
7. [Functors](./part-1/7.functors.md)
8. [Functoriality](./part-1/8.functoriality.md)
9. [Function Type](./part-1/9.function-type.md)
10. [Natural Transformations](./part-1/10.natural-transformations.md)

> 以上Markdown文件链接可能失效，可以查看系列[Part-1](../part-1/)和[Part-2](../part-2/)

## Table of Contents

[The Preface](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

### Part One

1. [Category: The Essence of Composition](https://bartoszmilewski.com/2014/11/04/category-the-essence-of-composition/)
2. [Types and Functions](https://bartoszmilewski.com/2014/11/24/types-and-functions/)
3. [Categories Great and Small](https://bartoszmilewski.com/2014/12/05/categories-great-and-small/)
4. [Kleisli Categories](https://bartoszmilewski.com/2014/12/23/kleisli-categories/)
5. [Products and Coproducts](https://bartoszmilewski.com/2015/01/07/products-and-coproducts/)
6. [Simple Algebraic Data Types](https://bartoszmilewski.com/2015/01/13/simple-algebraic-data-types/)
7. [Functors](https://bartoszmilewski.com/2015/01/20/functors/)
8. [Functoriality](https://bartoszmilewski.com/2015/02/03/functoriality/)
9. [Function Types](https://bartoszmilewski.com/2015/03/13/function-types/)
10. [Natural Transformations](https://bartoszmilewski.com/2015/04/07/natural-transformations/)

### Part Two

1. [Category Theory and Declarative Programming](https://bartoszmilewski.com/2015/04/15/category-theory-and-declarative-programming/)
2. [Limits and Colimits](https://bartoszmilewski.com/2015/04/15/limits-and-colimits/)
3. [Free Monoids](https://bartoszmilewski.com/2015/07/21/free-monoids/)
4. [Representable Functors](https://bartoszmilewski.com/2015/07/29/representable-functors/)
5. [The Yoneda Lemma](https://bartoszmilewski.com/2015/09/01/the-yoneda-lemma/)
6. [Yoneda Embedding](https://bartoszmilewski.com/2015/10/28/yoneda-embedding/)

### Part Three

1. [It’s All About Morphisms](https://bartoszmilewski.com/2015/11/17/its-all-about-morphisms/)
2. [Adjunctions](https://bartoszmilewski.com/2016/04/18/adjunctions/)
3. [Free/Forgetful Adjunctions](https://bartoszmilewski.com/2016/06/15/freeforgetful-adjunctions/)
4. [Monads: Programmer’s Definition](https://bartoszmilewski.com/2016/11/21/monads-programmers-definition/)
5. [Monads and Effects](https://bartoszmilewski.com/2016/11/30/monads-and-effects/)
6. [Monads Categorically](https://bartoszmilewski.com/2016/12/27/monads-categorically/)
7. [Comonads](https://bartoszmilewski.com/2017/01/02/comonads/)
8. [F-Algebras](https://bartoszmilewski.com/2017/02/28/f-algebras/)
9. [Algebras for Monads](https://bartoszmilewski.com/2017/03/14/algebras-for-monads/)
10. [Ends and Coends](https://bartoszmilewski.com/2017/03/29/ends-and-coends/)
11. [Kan Extensions](https://bartoszmilewski.com/2017/04/17/kan-extensions/)
12. [Enriched Categories](https://bartoszmilewski.com/2017/05/13/enriched-categories/)
13. [Topoi](https://bartoszmilewski.com/2017/07/22/topoi/)
14. [Lawvere Theories](https://bartoszmilewski.com/2017/08/26/lawvere-theories/)
15. [Monads, Monoids, and Categories](https://bartoszmilewski.com/2017/09/06/monads-monoids-and-categories/)

## 中文翻译版

[<译> 写给程序猿的范畴论 · 序](https://segmentfault.com/a/1190000003882331)

### 第一部分

1. [<译> 范畴：复合的本质](https://segmentfault.com/a/1190000003883257)
2. [<译> 类型与函数](https://segmentfault.com/a/1190000003888544)
3. [<译> 范畴，可大可小](https://segmentfault.com/a/1190000003894116)
4. [<译> Kleisli 范畴](https://segmentfault.com/a/1190000003898795)
5. [<译> 积与余积](https://segmentfault.com/a/1190000003913079)
6. [<译> 简单的代数数据类型](https://segmentfault.com/a/1190000003943687)
7. [<译> 函子](https://segmentfault.com/a/1190000003954370)
8. [<译> 函子性](https://segmentfault.com/a/1190000003993662)
9. [<译> 函数类型](https://segmentfault.com/a/1190000004631638)
10. [<译> 自然变换](https://segmentfault.com/a/1190000012381561)


## YouTube Videos

there are 3 playlists.

### [Category Theory](https://www.youtube.com/playlist?list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_)

1. [Category Theory 1.1: Motivation and Philosophy](https://www.youtube.com/watch?v=I8LbkfSSR58&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_)
2. [Category Theory 1.2: What is a category?](https://www.youtube.com/watch?v=p54Hd7AmVFU&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=2)
3. [Category Theory 2.1: Functions, epimorphisms](https://www.youtube.com/watch?v=O2lZkr-aAqk&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=3)
4. [Category Theory 2.2: Monomorphisms, simple types](https://www.youtube.com/watch?v=NcT7CGPICzo&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=4)
5. [Category Theory 3.1: Examples of categories, orders, monoids](https://www.youtube.com/watch?v=aZjhqkD6k6w&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=5)
6. [Category Theory 3.2: Kleisli category](https://www.youtube.com/watch?v=i9CU4CuHADQ&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=6)
7. [Category Theory 4.1: Terminal and initial objects](https://www.youtube.com/watch?v=zer1aFgj4aU&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=8)
8. [Category Theory 4.2: Products](https://www.youtube.com/watch?v=Bsdl_NKbNnU&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=9)
9. [Category Theory 5.1: Coproducts, sum types](https://www.youtube.com/watch?v=LkIRsNj9T-8&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=9)
10. [Category Theory 5.2: Algebraic data types](https://www.youtube.com/watch?v=w1WMykh7AxA&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=10)
11. [Category Theory 6.1: Functors](https://www.youtube.com/watch?v=FyoQjkwsy7o&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=11)
12. [Category Theory 6.2: Functors in programming](https://www.youtube.com/watch?v=EO86S2EZssc&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=12)
13. [Category Theory 7.1: Functoriality, bifunctors](https://www.youtube.com/watch?v=pUQ0mmbIdxs&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=13)
14. [Category Theory 7.2: Monoidal Categories, Functoriality of ADTs, Profunctors](https://www.youtube.com/watch?v=wtIKd8AhJOc&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=14)
15. [Category Theory 8.1: Function objects, exponentials](https://www.youtube.com/watch?v=REqRzMI26Nw&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=15)
16. [Category Theory 8.2: Type algebra, Curry-Howard-Lambek isomorphism](https://www.youtube.com/watch?v=iXZR1v3YN-8&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=16)
17. [Category Theory 9.1: Natural transformations](https://www.youtube.com/watch?v=2LJC-XD5Ffo&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=17)
18. [Category Theory 9.2: bicategories](https://www.youtube.com/watch?v=wrpxBXXgLCI&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=18)
19. [Category Theory 10.1: Monads](https://www.youtube.com/watch?v=gHiyzctYqZ0&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=19)
20. [Category Theory 10.2: Monoid in the category of endofunctors](https://www.youtube.com/watch?v=GmgoPd7VQ9Q&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_&index=20)

### [Category Theory II](https://www.youtube.com/playlist?list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm)

1. [Category Theory II 1.1: Declarative vs Imperative Approach](https://www.youtube.com/watch?v=3XTQSx1A3x8&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=1)
2. [Category Theory II 1.2: Limits](https://www.youtube.com/watch?v=sx8FELiIPg8&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=2)
3. [Category Theory II 2.1: Limits, Higher order functors](https://www.youtube.com/watch?v=9Qt664lfDRE&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=3)
4. [Category Theory II 2.2: Limits, Naturality](https://www.youtube.com/watch?v=1AOHbF6Ex8E&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=4)
5. [Category Theory II 3.1: Examples of Limits and Colimits](https://www.youtube.com/watch?v=TtvVHokhSoM&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=5)
6. [Category Theory II 3.2: Free Monoids](https://www.youtube.com/watch?v=FbnN0uomy-A&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=6)
7. [Category Theory II 4.1: Representable Functors](https://www.youtube.com/watch?v=KaBz45nZEZw&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=7)
8. [Category Theory II 4.2: The Yoneda Lemma](https://www.youtube.com/watch?v=BiWqNdtptDI&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=8)
9. [Category Theory II 5.1: Yoneda Embedding](https://www.youtube.com/watch?v=p_ydgYm9-yg&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=9)
10. [Category Theory II 5.2: Adjunctions](https://www.youtube.com/watch?v=TnV9SQGPcLY&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=10)
11. [Category Theory II 6.1: Examples of Adjunctions](https://www.youtube.com/watch?v=7Q8E2ZBS7pQ&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=11)
12. [Category Theory II 6.2: Free-Forgetful Adjunction, Monads from Adjunctions](https://www.youtube.com/watch?v=hjGDEfG2iRU&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=12)
13. [Category Theory II 7.1: Comonads](https://www.youtube.com/watch?v=C5oogxdX_Bo&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=13)
14. [Category Theory II 7.2: Comonads Categorically and Examples](https://www.youtube.com/watch?v=7XQZJ4TLgX8&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=14)
15. [Category Theory II 8.1: F-Algebras, Lambek's lemma](https://www.youtube.com/watch?v=zkDVCQiveEo&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=15)
16. [Category Theory II 8.2: Catamorphisms and Anamorphisms](https://www.youtube.com/watch?v=PAqzQMzsUU8&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=16)
17. [Category Theory II 9.1: Lenses](https://www.youtube.com/watch?v=9_iYlp8smc8&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=17)
18. [Category Theory II 9.2: Lenses categorically](https://www.youtube.com/watch?v=rAa3pGp97IM&list=PLbgaMIhjbmElia1eCEZNvsVscFef9m0dm&index=18)

### [Category Theory III](https://www.youtube.com/playlist?list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL)

1. [Category Theory III 1.1: Overview part 1](https://www.youtube.com/watch?v=F5uEpKwHqdk&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=1)
2. [Category Theory III 1.2: Overview part 2](https://www.youtube.com/watch?v=CfoaY2Ybf8M&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=2)
3. [Category Theory III 2.1: String Diagrams part 1](https://www.youtube.com/watch?v=eOdBTqY3-Og&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=3)
4. [Category Theory III 2.2, String Diagrams part 2](https://www.youtube.com/watch?v=lqq9IFSPp7Q&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=4)
5. [Category Theory III 3.1, Adjunctions and monads](https://www.youtube.com/watch?v=9p6_U5yV0ro&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=5)
6. [Category Theory III 3.2, Monad Algebras](https://www.youtube.com/watch?v=uXfBmsQJsN4&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=6)
7. [Category Theory III 4.1, Monad algebras part 2](https://www.youtube.com/watch?v=-wlT81LQ4Oc&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=7)
8. [Category Theory III 4.2, Monad algebras part 3](https://www.youtube.com/watch?v=9f8PumwS2gU&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=8)
9. [Category Theory III 5.1, Eilenberg Moore and Lawvere](https://www.youtube.com/watch?v=5PaxKu2TXno&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=9)
10. [Category Theory III 5.2, Lawvere Theories](https://www.youtube.com/watch?v=zCTAn_nIrS0&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=10)
11. [Category Theory III 6.1, Profunctors](https://www.youtube.com/watch?v=XJgfrF3O6iE&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=11)
12. [Category Theory III 6.2, Ends](https://www.youtube.com/watch?v=TAPxt26YyEI&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=12)
13. [Category Theory III 7.1, Natural transformations as ends](https://www.youtube.com/watch?v=DseY4qIGZV4&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=13)
14. [Category Theory III 7.2, Coends](https://www.youtube.com/watch?v=jQUebw8uac0&list=PLbgaMIhjbmEn64WVX4B08B4h2rOtueWIL&index=14)

## Table of Contents in Detail

The Preface

### Part One

1. Category: The Essence of Composition
   1. Arrows as Functions
   2. Properties of COmposition
   3. Composition is the Essence of Programming
   4. Challenges
2. Types and Functions
   1. Who Needs Types?
   2. Types Are About Composability
   3. What Are Types?
   4. Why Do We Need a Mathematical Model?
   5. Pure and Dirty Functions
   6. Examples of Types
   7. Challenges
3. Categories Great and Small
   1. No Objects
   2. Simple Graphs
   3. Orders
   4. Monoid as Set
   5. Monoid as Category
   6. Challenges
4. Kleisli Categories
   1. The Writer Category
   2. Writer in Haskell
   3. Kleisli Categories
   4. Challenges
5. Products and Coproducts
   1. Initial Object
   2. Terminal Object
   3. Duality
   4. Isomorphisms
   5. Products
   6. Coproduct
   7. Asymmetry
   8. Challenges
   9. Bibliography
6. Simple Algebraic Data Types
   1. Product Types
   2. Records
   3. Sum Types
   4. Algebra Types
   5. Challenges
7. Functors
   1. Functors in Programming
      1. The Maybe Functor
      2. Equational Reasoning
      3. Optional
      4. Typeclasses
      5. Functor in C++
      6. The List Functor
      7. The Reader Functor
   2. Functors as Containers
   3. Functor Composition
   4. Challenges
8. Functoriality
   1. Bifuncotrs
   2. Product and Coproduct Bifunctors
   3. Functorial Algebraic Data Types
   4. Functors in C++
   5. The Writer Functor
   6. Covariant and Contravariant Functors
   7. Profunctors
   8. The Hom-Functor
   9. Challenges
9. Function Types
   1. Universal Construction
   2. Curring
   3. Exponentials
   4. Cartesian Closed Categories
   5. Exponentials and Algebraic Data Types
      1. Zeroth Power
      2. Powers of One
      3. First Power
      4. Exponentials of Sums
      5. Exponentials of Exponentials
      6. Exponentials over Products
   6. Curry-Howard Isomorphism
   7. Bibliography
10. Natural Transformations
    1. Polymorphic Functions
    2. Beyond Naturality
    3. Functor Category
    4. 2-Categories
    5. Conclusion
    6. Challenges

### Part Two

11. Declarative Programming
12. Limits and Colimits
    1. Limit as Natural Isomorphism
    2. Examples of Limits
    3. Colimits
    4. Continuity
    5. Challenges
13. Free Monoids
    1. Free Monoid in Haskell
    2. Free Monoid Universal Construction
    3. Challenges
14. Representable Functors
    1. The Hom Functor
    2. Representable Functors
    3. Challenges
    4. Bibliography
15. The Yoneda Lemma
    1. Yoneda in Haskell
    2. Co-Yoneda
    3. Challenges
    4. Bibliography
16. Yoneda Embedding
    1. The Embedding
    2. Application to Haskell
    3. Preorder Example
    4. Naturality
    5. Challenges

### Part Three

17. It's All About Morphisms
    1. Functors
    2. Commuting Diagrams
    3. Natural Transformations
    4. Natural Isomorphisms
    5. Hom-Sets
    6. Hom-set Isomorphisms
    7. Asymmetry of Hom-Sets
    8. Challenges
18. Adjunctions
    1. Adjunction and Unit/Counit Pair
    2. Adjunction and Hom-Sets
    3. Product from Adjunction
    4. Exponential from Adjunction
    5. Challenges
19. Free/Forgetful Adjunctions
    1. Some Intuitions
    2. Challenges
20. Monads: Programmer's Definition
    1. The Klesli Category
    2. Fish Anatomy
    3. The do Notation
21. Monads and Effects
    1. The Problem
    2. The Solution
       1. Partiality
       2. Nondeterminism
       3. Read-Only State
       4. Write-Only State
       5. State
       6. Exceptions
       7. Continuations
       8. Interactive Input
       9. Interactive Output
    3. Conclusion
22. Monads Categorically
    1. Monoidal Categories
    2. Monoid in a Monoidal Category
    3. Monads as Monoids
    4. Monads from Adjunctions
23. Comonads
    1. Programming with Comonads
    2. The Product Comonad
    3. Dissecting the Composition
    4. The Stream Comonad
    5. Comonad Categorically
    6. The Store Comonad
    7. Challenges
24. F-Algebras
    1. Recursion
    2. Category of F-Algebras
    3. Natural Numbers
    4. Catamorphisms
    5. Folds
    6. Coalgebras
    7. Challenges
25. Algebras for Monads
    1. T-algebras
    2. The Kleisli Category
    3. Coalgebras for Comonads
    4. Lenses
    5. Challenges
26. Ends and Coends
    1. Dinatural Transformations
    2. Ends
    3. Ends as Equalizers
    4. Natural Transformations as Ends
    5. Coends
    6. Ninja Yoneda Lemma
    7. Profunctor Composition
27. Kan Extensions
    1. Right Kan Extension
    2. Kan Extension as Adjunction
    3. Left Kan Extension
    4. Kan Extensions as Ends
    5. Kan Extensions in Haskell
    6. Free Functor
28. Enriched Categories
    1. Why Monoidal Category?
    2. Monoidal Category
    3. Enriched Category
    4. Preorders
    5. Metric Spaces
    6. Enriched Functors
    7. Self Enrichment
    8. Relation to 2-Categories
29. Topoi
    1. Subobject Classifier
    2. Topos
    3. Topoi and Logic
    4. Challenges
30. Lawvere Theories
    1. Universal Algebra
    2. Lawvere Theories
    3. Models of Lawvere Theories
    4. The Theory of Monoids
    5. Lawvere Theories and Monads
    6. Monads as Coends
    7. Lawvere Theory of Side Effects
    8. Challenges
    9. Further Reading
31. Monads, Monoids, and Categories
    1. Bicategories
    2. Monads
    3. Challenges
    4. Bibliography

