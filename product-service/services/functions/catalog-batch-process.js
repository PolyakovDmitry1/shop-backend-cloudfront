'use strict'
import snsClient from 'aws-sdk/clients/sns.js'
import handler from '../../util/handler.js'
import * as productRepository from '../../repository/products.js'

const SNS = new snsClient({ region: process.env.SNS_CREATE_PRODUCT_TOPIC_REGION })

const catalogBatchProcess = handler(async (event) => {
  const records = event.Records
  if (!records) return

  for (const record of records) {
    await productRepository.createProduct(JSON.parse(record.body))
  }

  const expensiveProductInList = Math.max(records.map((record) => (JSON.parse(record.body)).price))

  const snsParams = {
    Subject: 'Creating products',
    Message: `Products: ${records.map((record) => record.body)}
      The products successfully were created`,
    TopicArn: process.env.SNS_CREATE_PRODUCT_TOPIC_ARN,
    MessageAttributes: {
      expensive_product_in_list: {
        DataType: 'Number',
        StringValue: expensiveProductInList.toString()
      }
    }
  }

  await SNS.publish(snsParams).promise()

  return {
    statusCode: 201,
    json: 'The products successfully were created'
  }
})

export {
  catalogBatchProcess
}
 