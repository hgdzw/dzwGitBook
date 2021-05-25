## spark read parquet

```
df = spark.read.parquet("file:///tmp/test/zhongda")
```

## udf

```
>>> from pyspark.sql.functions import *
>>> from pyspark.sql.types import *
>>> test_f = udf(lambda x:x+1, LongType())
>>> df.select(test_f('ts').alias('ts_1'))
DataFrame[ts_1: bigint]
>>> df1=df.select(test_f('ts').alias('ts_1'))
>>>
>>> df1.printSchema()
root
 |-- ts_1: long (nullable = true)

>>> df1.show()
```

## filter

```
>>> df.filter('xid'== 1668297794).show()
>>> df.filter(df.xid== 1668297794).show()
```

## jdbc read mysql

```
def get_bounds(db, host, user, passwd,dt):
    timestamp_start,timestamp_end = get_day_timestamp(dt)
    query = "(select max(trade_id) as max_bound,min(trade_id) as min_bound from trade where transact_time >= {timestamp_start} and transact_time < {timestamp_end}) bound".format(timestamp_start=timestamp_start, timestamp_end=timestamp_end)
    print(query)
    db_url = "jdbc:mysql://%s:3306/%s?useSSL=false&zeroDateTimeBehavior=convertToNull" % (host, db)
    df = spark.read.format("jdbc") \
        .option("url", db_url) \
        .option("driver", "com.mysql.jdbc.Driver") \
        .option("dbtable",query) \
        .option("user", user) \
        .option("password", passwd) \
        .option("fetchsize", 1000000000) \
        .load()
    df.show()
    print(df.collect)
    return df
    
    ## sparksql concurrency
    .config("spark.sql.shuffle.partitions", "1000") \
```


## 自动分配资源

```
spark.dynamicAllocation.enabled
spark.dynamicAllocation.maxExecutors
```
	
## 单个container 并发

```
spark.executor.cores
```
 
## yarn command  应用调优
### yarn 显示应用

```
yarn application --list
```

### yarn 杀死应用

```
yarn application --kill {appid}
```

### 显示应用日志

```
yarn logs -applicationId {appid}
```

### 查看资源请情况

```
yarn top
```
## 部署

```
https://spark.apache.org/docs/latest/submitting-applications.html
```




## 实例代码
# -*- coding: utf-8 -*-

```
import sys
import os
from pyspark.sql import SparkSession
from pyspark import SparkContext, SparkConf
from pyspark.sql import SQLContext, DataFrame, Row, Window
from pyspark.sql.functions import *
from pyspark.sql.types import *
from pyspark import StorageLevel
import datetime
from dateutil.relativedelta import relativedelta
import traceback
import json
import calendar
import boto3
import time

# .config("spark.sql.parquet.binaryAsString", "true") \
spark = SparkSession.builder\
                    .appName("me_order_open_order") \
                    .config("hive.metastore.client.factory.class",
                            "com.amazonaws.glue.catalog.metastore.AWSGlueDataCatalogHiveClientFactory") \
                    .config("spark.driver.userClassPathFirst", "true") \
                    .config("spark.excutor.userClassPathFirst", "true") \
                    .config("hive.exec.dynamic.partition", "true") \
                    .config("hive.exec.dynamic.partition.mode", "nonstrict") \
                    .config("hive.execution.engine", "spark") \
                    .config("spark.io.compression.codec", "org.apache.spark.io.SnappyCompressionCodec") \
                    .config("spark.sql.shuffle.partitions", "1000") \
                    .config("spark.io.compression.codec", "snappy") \
                    .config("spark.dynamicAllocation.enabled", "true") \
                    .config("spark.hadoop.mapreduce.input.fileinputformat.split.minsize", "1024000000") \
                    .config("spark.broadcast.compress", "true") \
                    .config("spark.hadoop.mapreduce.fileoutputcommitter.algorithm.version", "2") \
                    .config("spark.sql.adaptive.enabled", "true") \
                    .config("spark.shuffle.spill", "false") \
                    .config("spark.sql.crossJoin.enabled", "true")\
                    .config("spark.sql.broadcastTimeout", "1000")\
                    .config("spark.sql.autoBroadcastJoinThreshold", "104857600")\
                    .enableHiveSupport() \
                    .getOrCreate()

sc = spark.sparkContext

def load_data(query, db, host, user, passwd,lower_bound,upper_bound):
    # query = "(select * from dim_kpi) dim_kpi"
    # conn_db = BaseHook.get_connection('mysql_report_kpi_db')
    db_url = "jdbc:mysql://%s:3306/%s?useSSL=false&zeroDateTimeBehavior=convertToNull" % (host, db)
    df = spark.read.format("jdbc") \
        .option("url", db_url) \
        .option("driver", "com.mysql.jdbc.Driver") \
        .option("dbtable", query) \
        .option("user", user) \
        .option("password", passwd) \
        .option("fetchsize", 1000000000) \
        .option("partitionColumn","transact_time") \
        .option("lowerBound", lower_bound) \
        .option("upperBound",upper_bound) \
        .option("numPartitions", 10) \
        .load()
    return df

def get_bounds(db, host, user, passwd,dt):
    timestamp_start,timestamp_end = get_day_timestamp(dt)
    query = "(select max(trade_id) as max_bound,min(trade_id) as min_bound from trade where transact_time >= {timestamp_start} and transact_time < {timestamp_end}) bound".format(timestamp_start=timestamp_start, timestamp_end=timestamp_end)
    print(query)
    db_url = "jdbc:mysql://%s:3306/%s?useSSL=false&zeroDateTimeBehavior=convertToNull" % (host, db)
    df = spark.read.format("jdbc") \
        .option("url", db_url) \
        .option("driver", "com.mysql.jdbc.Driver") \
        .option("dbtable",query) \
        .option("user", user) \
        .option("password", passwd) \
        .option("fetchsize", 1000000000) \
        .load()
    df.show()
    print(df.collect)
    return df

def get_day_timestamp(dt):
    day = datetime.datetime.strptime(dt, "%Y-%m-%d")
    day_1 = datetime.datetime.strptime(dt, "%Y-%m-%d") +datetime.timedelta(days=1)
    day_start = datetime.datetime(day.year, day.month, day.day, 0, 0, 0, 0)
    timestamp_start = int(time.mktime(day_start.timetuple()))*1000
    day_end = datetime.datetime(day_1.year, day_1.month, day_1.day, 0, 0, 0, 0)
    timestamp_end = int(time.mktime(day_end.timetuple()))*1000
    return (timestamp_start, timestamp_end)

def me_order_trade_merge(host,user,passwd,dt):

    db = 'me_order'
    # bound_df = get_bounds(db,host,user,passwd,dt)
    # max_bound = bound_df.collect()[0].max_bound
    timestamp_start,timestamp_end = get_day_timestamp(dt)
    query = """(select * from open_order) open_order"""
    print(query)

    me_order_df = load_data(query,db,host,user,passwd,timestamp_start,timestamp_end)
    me_order_df.createOrReplaceTempView('open_order')
    insert_sql = """insert overwrite table bnb_dw.me_order_open_order_day_snap
                    partition(dt={dt})
                    select
                        order_id,
                        symbol_id,
                        position_side,
                        account_id,
                        cl_ord_id,
                        side,
                        type,
                        time_in_force,
                        orig_qty,
                        executed_qty,
                        price,
                        stop_price,
                        activate_price,
                        price_rate,
                        iceberg_qty,
                        cum_qty,
                        cum_quote,
                        status,
                        transact_time,
                        working_indicator,
                        working_time,
                        working_type,
                        target_strategy,
                        liquidation_cp_type,
                        price_protect,
                        create_time,
                        create_update_id,		
                        update_time,	
                        last_update_id
                from open_order distribute by dt,cast(rand()*1 as int)""".format(dt=dt)
    spark.sql(insert_sql)

if __name__ == "__main__":
    host = sys.argv[1]
```

    user = sys.argv[2]
    passwd = sys.argv[3]
    dt = sys.argv[4]
    me_order_trade_merge(host,user,passwd,dt)