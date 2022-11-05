'use strict'
import csv from 'csv-parser'
import S3Client from 'aws-sdk/clients/s3.js'
import handler from '../../util/handler.js'

const S3 = new S3Client({ region: process.env.BUCKET_REGION })

const importFileParser = handler(async (event) => {
  const { Bucket, Key } = getKeysFromEvent(event)
  const streamFile = S3.getObject({ Bucket, Key }).createReadStream()

  const dataCSV = await getDataCSV(streamFile, { separator: ',' })
  console.log(dataCSV)

  try {
    await copyFile(event)
    console.log('The file successfully was copied to parsed folder')
  } catch (err) {
    console.log(err)
  }

  try {
    await deleteFile(event)
    console.log('The file successfully was deleted from upload folder')
  } catch (err) {
    console.log(err)
  }

})

const getDataCSV = (stream, optsCsv) => {
  return new Promise((resolve, reject) => {
  const results = []

  stream
    .pipe(csv(optsCsv))
    .on('data', (data) => results.push(data))
    .on('end', () => resolve(results))
    .on('error', reject)
  })
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
