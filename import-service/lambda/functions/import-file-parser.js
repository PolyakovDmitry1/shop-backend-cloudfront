'use strict'
import csv from 'csv-parser'
import { v4 as uuidv4 } from 'uuid'
import awsClientsAll from 'aws-sdk/clients/all.js'
import handler from '../../util/handler.js'

const { S3: S3Client, SQS: sqsClient } = awsClientsAll

const S3 = new S3Client({ region: process.env.BUCKET_REGION })
const SQS = new sqsClient({ region: process.env.SQS_CATALOG_REGION })

const importFileParser = handler(async (event) => {
  const dataCSV = await getDataCSV(event, { separator: '|' })
  await sendDataInSQS(dataCSV)

  try {
    await copyFile(event) // it copies to parsed folder
    await deleteFile(event) // it removes from upload folder
  } catch (err) {
    console.log(err)
  }
})

const getDataCSV = (event, optsCsv) => {
  return new Promise((resolve, reject) => {
    const { Bucket, Key } = getKeysFromEvent(event)
    const streamFile = S3.getObject({ Bucket, Key }).createReadStream()
    const results = []

    streamFile
      .pipe(csv(optsCsv))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject)
    })
}

const sendDataInSQS = async (data = []) => {
  const batchSize  = 5

  for (let i = 0; i < data.length; i += batchSize) {
    const chunk = data.slice(i, i + batchSize)
    const params = {
      Entries: chunk.map((v) => ({
        Id: uuidv4(),
        MessageBody: JSON.stringify(v)
      })),
      QueueUrl: process.env.SQS_CATALOG_URL
    }

    await SQS.sendMessageBatch(params).promise()
  }
}

const getKeysFromEvent = (event) => {
  const Key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))

  return {
    Key,
    Bucket: event.Records[0].s3.bucket.name,
    fileName: Key.split('/').pop()
  }
}

const copyFile = (event) => {
  const { Key, Bucket, fileName } = getKeysFromEvent(event)
  const s3Params = {
    Bucket: Bucket,
    CopySource: `${Bucket}/${Key}`,
    Key: `parsed/${fileName}`
  }

  return S3.copyObject(s3Params).promise()
}

const deleteFile = (event) => { 
  const { Key, Bucket } = getKeysFromEvent(event)
  const s3Params = { Bucket, Key }

  return S3.deleteObject(s3Params).promise()
}

export default importFileParser
