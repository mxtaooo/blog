---
title: Spark相关内容随记
description: 随手记录Spark相关的问题、思考等
author: mxtao
categories: ["spark"]
tags: ["spark", "spark-notes"]
date: 2020-07-04
modified: 2021-04-29 20:30:00
---


# Spark 相关内容随记

随手记录Spark相关的问题、思考等

[Spark SQL在100TB上的自适应执行实践](https://cloud.tencent.com/developer/article/1038770)

[User Defined Aggregate Functions (UDAFs)](http://spark.apache.org/docs/latest/sql-ref-functions-udf-aggregate.html)

## Spark SQL - DataSource

通过实现Spark定义的DataSource接口为Spark新增自定义数据源

数据源API目前分V1和V2版本，~~到目前为止[*Spark 3.0.0*](https://spark.apache.org/releases/spark-release-3-0-0.html)似乎还没有完成进化~~，已在3.0.0版本完成V2版重构

[Data source V2 API refactoring](https://issues.apache.org/jira/browse/SPARK-25390)

预计将在3.2.0版本将V2版API稳定下来

[Stabilize Data Source V2 API](https://issues.apache.org/jira/browse/SPARK-25186)

https://jaceklaskowski.gitbooks.io/mastering-spark-sql/spark-sql-data-source-api-v2.html

https://jaceklaskowski.gitbooks.io/mastering-spark-sql/spark-sql-DataSourceV2.html

https://jaceklaskowski.gitbooks.io/mastering-spark-sql/spark-sql-DataSource.html

[Category: datasource-v2-series](http://blog.madhukaraphatak.com/categories/datasource-v2-series/)

[Category: datasource-v2-spark-three](http://blog.madhukaraphatak.com/categories/datasource-v2-spark-three/)

## Spark SQL - CSV

CSV类型文件中，出于各种原因可能导致Spark SQL解析数据会出错。

> 以下问题举例在Hadoop2.6.0-Spark2.1.1-Scala2.10.6-JDK1.7生产环境出现，较新版本中的Spark具体行为暂不可知。该Spark版本已被魔改且无代码，离线环境中只有Spark2.4.4-Scala2.11，尝试看下源代码发现该部分已被重构，抛异常的类都没有了

例如，有些字段里面包含了特殊字符，导致Spark SQL解析行数据时出现了字段截断错误，从而导致列错位，有些转换函数直接执行失败，进而导致整个任务失败。

问题解决方式是强制指定`mode=DROPMALFORMED`，直接将问题数据丢弃，这是Spark SQL直接支持的配置，看文档的时候可能看到了，但是无视掉了。。。

Spark文档中对于CSV支持的配置有详细介绍。

最新版本的参考文档：[DataFrameReader#csv](https://spark.apache.org/docs/latest/api/scala/org/apache/spark/sql/DataFrameReader.html#csv(paths:String*):org.apache.spark.sql.DataFrame)

Spark 2.4.6参考文档：[DataFrameReader#csv](https://spark.apache.org/docs/2.4.6/api/scala/index.html#org.apache.spark.sql.DataFrameReader@csv(paths:String*):org.apache.spark.sql.DataFrame)

## Spark CLI

要脱离灵活性太差的自研任务调度服务、逐渐开始习惯用原生CLI进行进行任务的提交

`spark-submit --name JOB-NAME --master yarn --deploy-mode cluster --conf spark.yarn.submit.waitAppCompletion=false --class com.mxtao.App --jars /xxx/xxx.jar,/xxx/xxxx.jar --queue xx --pincipal xxx@DOMAN --keytab xxx.keytab main-class-in-this-jar.jar args-for-main`

[Submitting Applications](https://spark.apache.org/docs/latest/submitting-applications.html)

[Running Spark on YARN - Spark Properties](https://spark.apache.org/docs/latest/running-on-yarn.html#spark-properties)

[Submitting Applications](https://spark.apache.org/docs/2.4.6/submitting-applications.html)

[Running Spark on YARN - Spark Properties](https://spark.apache.org/docs/2.4.6/running-on-yarn.html#spark-properties)
