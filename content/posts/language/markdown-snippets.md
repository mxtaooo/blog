---
title: Markdown语法记录
description: 偶尔需要查阅语法的内容类型
author: mxtao
categories: ["language"]
tags: ["markdown"]
date: 2025-05-12
modified: 2025-05-12 16:30:00
---

# Markdown语法记录

常规内容语法此处不再详细介绍，仅记录偶尔需要查阅语法的内容类型。

## 参考链接

+ [CommonMark Spec](https://spec.commonmark.org/)
+ [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
+ [GitLab Flavored Markdown (GLFM)](https://docs.gitlab.com/user/markdown/)

## 硬换行

> 文档: [CommonMark Spec - 6.7 Hard line breaks](https://spec.commonmark.org/0.31.2/#hard-line-breaks)

连续的多行内容若不加特殊处理总是会渲染成没有换行的整个段落，手动换行可以通过插入空行、行尾空格(两个及以上)、反斜杠(`\`)来实现。

## 删除线

> 文档: [GitHub Flavored Markdown Spec - 6.5 Strikethrough (extension)](https://github.github.com/gfm/#strikethrough-extension-)\
> 该功能由`strikethrough`扩展支持，但一般默认启用。

一对`~~`包裹的连续内容会用删除线格式化。

`~~删除线~~` -> ~~删除线~~

## 任务列表

> 文档: [GitHub Flavored Markdown Spec - 5.3 Task list items (extension)](https://github.github.com/gfm/#task-list-items-extension-)\
> 该功能由`tasklist`扩展支持，但一般默认启用。

```markdown
+ [ ] 任务一
+ [x] 任务二
```

+ [ ] 任务一
+ [x] 任务二

## diff code block

该语法是用于展示代码增删情况，开启该功能一般不需要特殊配置。

代码块语言类型需声明为`diff`，在删除的行前加`-`，在新增的行前加`+`。

<!-- `~~~`也可以作为代码块的标识符 -->
~~~
```diff
[dependencies.bevy]
git = "https://github.com/bevyengine/bevy"
rev = "11f52b8c72fc3a568e8bb4a4cd1f3eb025ac2e13"
- features = ["dynamic"]
+ features = ["jpeg", "dynamic"]
```
~~~

```diff
[dependencies.bevy]
git = "https://github.com/bevyengine/bevy"
rev = "11f52b8c72fc3a568e8bb4a4cd1f3eb025ac2e13"
- features = ["dynamic"]
+ features = ["jpeg", "dynamic"]
```

## GitHub Alerts

> 文档: [Basic writing and formatting syntax - Alerts](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)

```markdown
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

## GitLab Alerts 

> 文档: [GitLab Flavored Markdown (GLFM) - Alerts](https://docs.gitlab.com/user/markdown/#alerts)\
> GitLab >= 17.10

```markdown
> [!note]
> The following information is useful.

> [!tip]
> Tip of the day.

> [!important]
> This is something important you should know.

> [!warning]
> The following would be dangerous.

> [!caution]
> You need to be very careful about the following.
```

此外还支持设定标题。

```markdown
> [!warning] Data deletion
> The following instructions will make your data unrecoverable.
```

也支持GitLab段落语法

```markdown
>>> [!note] Things to consider
You should consider the following ramifications:

1. consideration 1
1. consideration 2
>>>
```

## 图表

> [Mermaid](https://mermaid.js.org/)提供支持，文档: [Diagram Syntax](https://mermaid.js.org/intro/syntax-reference.html)\
> 语法随版本升级变动频繁，需要确认平台集成的版本情况。

~~~markdown
```mermaid
info
```
~~~
