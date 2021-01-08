
大数据前驱知识  
   * hadoop: 一个大数据计算框架,使用hdfs作为存储,多个廉价的集群组成集群
   * hive：丰富的SQL查询方式来分析存储在Hadoop分布式文件系统中的数据：可以将结构化的数据文件映射为一张数据库表，并提供完整的SQL查询功能；
   * mapreduce: 一个计算任务被拆分为多个部分,分配到集群下的计算机,多台计算机并行计算并将结果汇总.

### 一、背景介绍
   spark 是和hadoop 一样的分布式数据计算框架,但是hadoop是基于HDFS 文件存储的,而 spark 是基于内存的 所以速度上来说 是要比hadoop要快的.其根本在于将**数据转成表**  
   #### 主要部件
   ![image](../image/spark组件.png)
   * spark core
        - RDD:弹性分布式数据集,只读的分区记录的集合，只能基于在稳定物理存储中的数据集和其他已有的RDD上执行确定性操作来创建,人话就是  
        - DAG:有向无环图,即从一个点出发历经数点之后回不到这个点(没有环), 在spark中是对RDD的关系进行建模,描述RDD的依赖关系.
   * spark sql :  以sql写计算逻辑
        
   
   这里是python 操作所需要知道的名词
   * SparkContext: 任何spark功能的入口点, 主要用于创建和操作RDD
   * SparkSession: 在1.2之前操作不同的功能需要不同的context,现在直接用SparkSession 是他们的组合 他们的功能都可以用
        - 创建和操作RDD时，使用SparkContext
        - 使用Streaming时，使用StreamingContext
        - 使用SQL时，使用sqlContext
        - 使用Hive时，使用HiveContext
   * DataFrame: 基本的表,以二维表格的形式存储数据,还有schema(数据的结构信息),性能比RDD高 并且有存储结构信息
   * DateSet： 比DateFrame更细致 能知道每个字段的类型

   #### 环境安装
   * windows 操作系统
   * python 3.7
   * pySpark 库
   
   
###  连接数据的方案
  
  
  
#### RDD,DateFrame,DateSet的区别和共性
   * 相同点
     - 首先都是惰性加载的,只有遇到action和foreach时才会计算
     - 三者都有partition的概念,三者有许多共同的函数，如filter，排序等
     - 三者都会根据spark的内存情况自动缓存运算，这样即使数据量很大，也不用担心会内存溢出
   * 不同点: 感觉控制力度不一样 一个一个更细致
      
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  