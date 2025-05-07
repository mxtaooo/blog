---
title: CSS选择器
description: CSS 选择器
categories: ["programming language"]
tags: ["programming language", "css"]
author: mxtao
date: 2017-07-29
---

# CSS 选择器

对CSS选择器的相关知识一直停留在有些印象的层面，到了用的时候还是要来金老师的网站翻PPT。虽然每次看一遍都觉得差不多了，但实际是代码写的太少，依旧是差得远了。对于html+css+js认知地水平还是很水的，也就是了解些基本的东西，任重道远。本文是对CSS选择器基本知识的复习（预习）。

## 基本选择器

+ 标记选择器

    设置HTML中某标签的样式

    ```css
    [label]{
        /*style content*/
    }

    /* for example */
    p {
        color: red;
        font-size: 25px
    }

    /* use it
    <p>This is a "p" label.</p>
    */
    ```

+ 类别选择器

    ```css
    .[class-name] {
        /*style content*/
    }

    /* for example */
    .red_large_text {
        color: red;
        font-size: 30px
    }

    /*
    <p class="red_large_text">this is a paragraph.</p>
    <a class="red_large_text" href="http://www.baidu.com">Baidu</a>
    */
    ```

+ ID选择器

    ```css
    #[id-name] {
        /* style content */
    }

    /* for example */
    #copyright
    {
        font-style:italic;
        font-size:16px;
    }

    /*
    <div id="copyright">Copyright ..... </div>
    */
    ```

+ 通用选择器

    `*`是一个通配符，它匹配任何元素

    ```css
    * {
        /* style content */
    }
    ```

## 复合选择器

将以上基本选择器组合应用

+ 交集选择器

    直接指定特定标记中，特定样式类或id的元素样式

    ```css
    [label-name][.[class-name]|#[id-name]] {
        /* style content */
        /* 选择器之间不能有字符 */
    }

    /* for example */
    p.special{
        /* 标记.类别选择器 */
        color:red;
    }

    p#special{
        /* id选择器 */
        color:green;
    }

    /*
    <p>
        本段未指定任何样式，以浏览器默认字体显示
    </p>
    <p class="special">
        本段指定了.special类别的样式，适用于交集选择器“p.special”，字体为红色
    </p>
    <p id="special">
        本段的id=special，适用于交集选择器“p#special”，字体为绿色
    </p>
    */
    ```

+ 并集选择器

    一次定义多个标签或类别或ID的样式

    ```css
    [label],[.[class-name]],[#[id-name]] {
        /* style content */
        /* 以逗号隔开各个选择器 */
    }

    /* for example */
    div,.special,#one {
        text-decoration:underline;
    }

    /* 凡是名字是<div>，其样式类名为special、id值为one的元素，其文本全都加上下划线 */
    ```

+ 后代选择器

    ```css
    [label1] [label2] {
        /* style content */
        /* 以空格隔开各个选择器 */
        /* 设定存在于元素label1中元素label2的样式 */
    }

    [label1]>[label2] {
        /* style content */
        /* 设定存在于元素label1中元素label2的样式，而且必须是label1的直接子元素 */
    }

    /* for example */
    p span{
        /*凡是<p>元素中的<span>元素，全部以红色显示。*/
        color:red;
    }
    div>h2 {
        /*只选择 h2 元素，并且这些元素都是 div 的 直接 子元素*/
        color:red;
    }
    ```

+ 兄弟选择器

    ```css
    [label1]+[label2] {
        /* style content */
        /* 选择label2元素，此元素是label1元素的弟弟（出现在label1下方），且是紧挨着的 */
    }
    [label1]~[label2] {
        /* style content */
        /* 选出所有label1的“弟弟”，不管是不是紧挨着的。 */
    }

    /* for example */
    ```

## 属性选择器

| 选择器 | 说明 |
| :- | :- |
| `a[href]` | 选择所有拥有指定href属性的a元素 |
| `a[href="home.htm"]` | 仅选择具有特定属性值的a元素 |
| `img[alt~="thumbnail"]` | 选择的img元素的alt属性中包容thumbnail单词（前后有空格） |
| `a[href^="http://"]` | 选择所有href属性以“http://”开头的a元素 |
| `a[href$=".pdf"]` | 选择所有href属性以“.pdf”结尾的a元素 |
| `div[id*="main"]` | 选择所有id属性值包容“main”的所有div元素 |

## 伪类选择器

+ `<a>`的伪类

    超链接标签`<a>`支持几个特殊的CSS样式类，用于定义超链接不同状态的样式，这些样式被称为伪类（pseudo class）

    | 属性 | 说明 |
    | :- | :- |
    | `a:link` | 超链接的普通样式，即正常浏览状态的样式 |
    | `a:visited` | 被点击之后的样式 |
    | `a:hover` | 鼠标指针悬停在超链接元素之上时呈现的样式 |
    | `a:active` | 单击超链接时呈现的样式 |

+ 通用的伪类选择器

    | 属性 | 说明 |
    | :- | :- |
    | `:enabled` | 元素激活时 |
    | `:disabled` | 元素被屏蔽时 |
    | `:checked` | 元素处于选中状态 |
    | `:focus` | 元素拥有焦点时 |

+ 伪类选择器的“条件运算”

  + 伪类选择器支持`not`

    `div:not(.myclass)`: 选择所有div元素，且其class属性不是myclass

  + 可以连续使用多个`not`

    `div:not(.myclass1):not(.myclass2)`: 选择所有div元素，其class属性不是.myclass1和.myclass2

  + 可以使用其他条件

    `div:not([id^=“main”])`: 选择所有div元素，其id属性不是以main打头的

+ `div:target`

+ 结构化选择器

    与DOM密切相关

    | 伪类选择器 | 说明 |
    | :- | :- |
    | `:root` | 选择根元素`<html>` |
    | `:empty` | 选择空元素，例如 `<p></p>` |
    | `:first-child` | 选择的元素是其父元素的第一个子元素 |
    | `:last-child` | 选择的元素是其父元素的最后一个子元素 |
    | `:first-of-type` | 指定元素类型的第一个儿子 |
    | `:last-of-type` | 指定元素类型的最后一个儿子 |
    | `:only-child` | 选中的元素是父元素的唯一儿子 |
    | `:only-of-type` | 在父元素的所有儿子中，选择那些只有一个元素的元素类型 |

+ `Nth`类型选择器

    | 选择器 | 说明 |
    | :- | :- |
    | `:nth-child(n)` | 第几个孩子 |
    | `:nth-last-child(n)` | 倒数第几个孩子 |
    | `:nth-of-type(n)` | 第几个元素类型 |
    | `:nth-last-of-type(n)` | 倒数第几个元素类型 |

    Nth类型支持简单的计算表达式

    + `:nth-child(even)`
    + `:nth-child(odd)`
    + `:nth-child(an+b)` a表示“步长”，为正表示向后，为负表示向前，b表示从第几个元素开始

## 伪元素

伪元素就是文档中若有实无的元素

+ `::first-letter`（首字母）和 `::first-line`（首行）

    ```css
    p::first-letter {
        /*段落首字符放大3倍*/
        font-size:300%;
    }
    ```

+ `::before` 和 `::after`

    ```css
    p.age::before {
        content:"Age: ";
    }
    p.age::after {
        content:" years.";
    }

    /*
    <p class="age">25</p>

    显示效果：
    Age: 25 years.
    */
    ```

## 继承与层叠原则

没有定义CSS规则的HTML元素从它的父元素中继承样式。

如果相互冲突： 行内元素 > ID样式 > 类别样式 > 标签样式