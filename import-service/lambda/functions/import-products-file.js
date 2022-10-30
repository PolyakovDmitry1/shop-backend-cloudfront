'use strict'
import handler from '../../util/handler.js'
import S3Client from 'aws-sdk/clients/s3.js'
import { NotFound } from '../errors.js'

const importProductsFile = handler(async ({ queryStringParameters, headers }) => {
  const fileName = queryStringParameters && queryStringParameters.name || null
  if (!fileName) throw new NotFound('not found name in queryStringParameters')

  const bucketParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${fileName}`,
    Expires: 60 * 60,
    ContentType: 'text/csv' // headers['Content-Type']
  }

  const S3 = new S3Client({ region: process.env.BUCKET_REGION })
  const url = await S3.getSignedUrlPromise('putObject', bucketParams)

  return {
    statusCode: 201,
    json: url
  }
})


export default importProductsFile
