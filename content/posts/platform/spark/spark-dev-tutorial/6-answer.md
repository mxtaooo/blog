---
title: 6. 小测试参考思路
description: 小测试的参考思路
author: mxtao
categories: ["spark", "spark development tutorial"]
tags: ["spark", "scala"]
date: 2020-03-09
---

# 几个解答思路

---

提供几个思路以解答前面提出的问题。

其中理解门槛最低的是Spark SQL版，用SQL来描述业务逻辑，应该还是比较友好的。

两个Spark Core版本的解决方案没有这么直观，两者都需要开发者熟悉常用算子。此外，使用基本数据结构的版本，需要把数据结构的变换过程理解吃透；定义业务类的版本理解稍容易些，搞清楚Scala中`object`、`class`、`case class`的概念应该就可以了。

## 1. Spark SQL 

```scala
import org.apache.spark.sql.SparkSession

object Application {
  def main(args : Array[String]) {
    val spark = SparkSession.builder().appName("SparkApp").master("local[*]").getOrCreate()
    import spark.implicits._

    val scorebcp = "/mnt/c/Users/mxtao/Desktop/score.nb"
    val genderbcp = "/mnt/c/Users/mxtao/Desktop/gender.nb"

    // 加载数据
    val scoreSchema = "id string, name string, yw float, sx float, yy float"
    spark.read.option("sep", "\t").schema(scoreSchema).csv(scorebcp).createOrReplaceTempView("score")
    val genderSchema = "id string, gender string"
    spark.read.option("sep", "\t").schema(genderSchema).csv(genderbcp).createOrReplaceTempView("gender")

    // 过滤无效数据，顺便求了总成绩放在这
    spark.sql("select *, (yw + sx + yy) as total from score where id is not null and name is not null and yw is not null and sx is not null and yy is not null").createOrReplaceTempView("score")
    spark.sql("select * from gender where id is not null and gender is not null").createOrReplaceTempView("gender")

    // 按总成绩排名从高到底输出学号和姓名
    spark.sql("select id, name, total from score order by total desc").show()
    // 找出有不及格科目的同学
    spark.sql("select * from score where yw < 60 or sx < 60 or yy < 60").show()
    // 分别找出各个科目的第一名
    spark.sql("select * from score order by yw desc limit 1").show()
    spark.sql("select * from score order by sx desc limit 1").show()
    spark.sql("select * from score order by yy desc limit 1").show()
    // 分别找出男生和女生的第一名
    spark.sql("select s.id, s.name, g.gender, s.total from score s join gender g on s.id == g.id").createOrReplaceTempView("gscore")  // 其实也可以不创建临时表，直接作为子查询也可
    spark.sql("select * from gscore where gender == '男' order by total desc limit 1").show()
    spark.sql("select * from gscore where gender == '女' order by total desc limit 1").show()

    spark.stop()
  }
}
```


## 2. Spark Core + 定义业务类

```scala
import org.apache.spark.sql.SparkSession
import scala.util.Try

// ----------- 定义业务类 ------------
object StudentScore {
  // 尝试从字符串构造业务对象
  def tryApply(str: String): Option[StudentScore] = {
    if (verify(str))
      Some(StudentScore(str))
    else
      None
  }

  // 重载一个apply方法
  def apply(str: String): StudentScore = {
    // require(verify(str), "not a correct string!")
    val arr = str.split("\t")
    StudentScore(arr(0), arr(1), arr(2).toFloat, arr(3).toFloat, arr(4).toFloat)
  }

  // 验证外部输入的字符串或者数组是否合法
  def verify(str: String): Boolean = str!=null && str.nonEmpty && verify(str.split("\t"))
  def verify(arr: Array[String]): Boolean = arr!=null && arr.length==5 && arr.forall(_.nonEmpty) && arr.slice(2, 5).forall(s => Try(s.toFloat).isSuccess)
}
// 注意，这里是一个 case class，要理解清楚它与普通 class 有何不同
case class StudentScore(val id: String, val name: String, val yw: Float, val sx: Float, val yy: Float){
  def total: Float = yw + sx + yy
  def isPassed: Boolean = yw >= 60.0 && sx >= 60.0 && yy >= 60.0
  def notPassed: Boolean = !isPassed
}

// ----------- 主程序本体 --------------
object Application {
  def main(args : Array[String]) {
    val spark = SparkSession.builder().appName("SparkApp").master("local[*]").getOrCreate()
    val sc = spark.sparkContext
    import spark.implicits._

    val scorebcp = "/mnt/c/Users/mxtao/Desktop/score.nb"
    val genderbcp = "/mnt/c/Users/mxtao/Desktop/gender.nb"

    val score = sc.textFile(scorebcp)
      .map(s => StudentScore.tryApply(s))   // 尝试从字符串构造对象
      .filter(_.nonEmpty)                   // 把构造失败的过滤掉
      .map(_.get)                           // 取得对象本体，此时得到RDD[StudentScore]
    // 也可以用另一种处理办法
    // val score = sc.textFile(scorebcp)
    //   .filter(s => StudentScore.verify(s))   // 验证字符串是否正确，把不正确的字符串丢掉
    //   .map(s => StudentScore(s))             // 从字符串构造业务对象
    val gender = sc.textFile(genderbcp)
      .map(_.split("\t"))
      .filter(_.length == 2)
      .map(a => (a(0), a(1)))
      .filter(t => t._1.nonEmpty && t._2.nonEmpty)
    
    // 按总成绩排名从高到底输出学号和姓名
    score.sortBy(_.total, ascending = false)
      .map(s => s"${s.id}\t${s.name}")
      .collect()
      .foreach(println)

    // 找出有不及格科目的同学
    score.filter(_.notPassed).collect.foreach(println)
    
    // 分别找出各个科目的第一名
    score.sortBy(_.yw, ascending = false).take(1).foreach(print)
    score.sortBy(_.sx, ascending = false).take(1).foreach(print)
    score.sortBy(_.yy, ascending = false).take(1).foreach(print)

    // 分别找出男生和女生的第一名
    val score2 = score.map(s => (s.id, s)).join(gender).map(_._2)
    score2.filter(_._2 == "男").map(_._1).sortBy(_.total, ascending = false).take(1).foreach(println)
    score2.filter(_._2 == "女").map(_._1).sortBy(_.total, ascending = false).take(1).foreach(println)

    spark.close()
  }
}
```

## 3. Spark Core + 基本数据结构

```scala
import org.apache.spark.sql.SparkSession
import scala.util.Try

object Application {
  
  def main(args : Array[String]) {
    val spark = SparkSession.builder().appName("SparkApp").master("local[*]").getOrCreate()
    val sc = spark.sparkContext
    import spark.implicits._

    val scorebcp = "/mnt/c/Users/mxtao/Desktop/score.nb"
    val genderbcp = "/mnt/c/Users/mxtao/Desktop/gender.nb"

    // 读取文件，过滤无效数据
    val score = sc.textFile(scorebcp)
      .map(_.split("\t"))
      .filter(_.length == 5)    // 过滤掉字段有缺失的数据
      .map(a => (a(0), a(1), a(2), a(3), a(4)))     // 把数组转换成元组
      .filter(t => t._1.nonEmpty && t._2.nonEmpty && t._3.nonEmpty && t._4.nonEmpty && t._5.nonEmpty)           // 保证必要字段不为空
      .filter(t => Try(t._3.toFloat).isSuccess && Try(t._4.toFloat).isSuccess && Try(t._5.toFloat).isSuccess)   // 保证成绩字段是合法的
      .map(t => (t._1, t._2, t._3.toFloat, t._4.toFloat, t._5.toFloat))     // 转换成 (学号, 姓名, 语文, 数学, 英语) 形式
    val gender = sc.textFile(genderbcp)
      .map(_.split("\t"))
      .filter(_.length == 2)
      .map(a => (a(0), a(1)))
      .filter(t => t._1.nonEmpty && t._2.nonEmpty)
    
    // 按总成绩排名从高到底输出学号和姓名
    score.map(t => (t._1, t._2, t._3 + t._4 + t._5))    // 转换成 (学号, 姓名, 总成绩) 形式
      .sortBy(_._3, ascending = false)                  // 以总成绩为key，按从低到高排序
      .map(t => s"${t._1}\t${t._2}")                    // 格式化数据，为输出做准备
      .collect()                                        // 将分布在各个节点的数据拿到本地
      .foreach(println)                                 // 打印到控制台

    // 找出有不及格科目的同学
    score.filter(t => t._3 < 60.0 || t._4 < 60.0 || t._5 < 60.0)
      .collect()
      .foreach(println)
    
    // 分别找出各个科目的第一名
    score.sortBy(_._3, ascending = false)
      .take(1)
      .foreach(println)
    score.sortBy(_._4, ascending = false)
      .take(1)
      .foreach(println)
    score.sortBy(_._5, ascending = false)
      .take(1)
      .foreach(println)

    // 分别找出男生和女生的第一名
    val score2 = score.map(t => (t._1, (t._1, t._2, t._3 + t._4 + t._5)))   // 转换成二元组，为join做准备，此处转换成了 (学号, (学号, 姓名, 总成绩)) 形式
      .join(gender)     // 与gender数据集(结构为：(学号,性别))关联碰撞，策略为丢弃所有未关联数据，结果结构为: (学号, ((学号, 姓名, 总成绩), 性别))
      .map(_._2)        // 丢掉不再使用的key，然后结构变为：((学号, 姓名, 总成绩), 性别)
    score2.filter(_._2 == "男")
      .map(_._1)
      .sortBy(_._3, ascending = false)
      .take(1)
      .foreach(println)
    score2.filter(_._2 == "女")
      .map(_._1)
      .sortBy(_._3, ascending = false)
      .take(1)
      .foreach(println)

    spark.close()
  }
}
```
