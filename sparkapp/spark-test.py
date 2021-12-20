from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import IntegerType, StringType, StructType, TimestampType

spark = SparkSession.builder \
          .appName('SparkApp') \
          .getOrCreate()

simpleData = "{value: [, {product: '1', price: '20'}, {product: '2', price: '30'}]}"

df=spark.createDataFrame([(1, "{product: '1', price: '10'}")],["product","price"])
df.show(truncate=False)


#trackingMessages = kafkaMessages.select(
#    # Extract 'value' from Kafka message (i.e., the tracking data)
#    from_json(
#        column("value").cast("string"),
#        trackingMessageSchema
#    ).alias("json")
#).withColumnRenamed('json.product', 'product')




#df = spark.createDataFrame(data = simpleData)
#df.printSchema()