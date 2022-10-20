import dotenv from 'dotenv'
import { destroyConnection } from '../config/knex.js'
import { isObject } from '../helper.js'

dotenv.config()

const corsWhitelist = JSON.parse(process.env.CORS_WHITE_LIST)

export default function handler(lambda) {
  return async function (event, context) {
    let json, statusCode

    try {
      console.log(event, 'incoming requests')
      // if (!isObject(event)) event = JSON.parse(event) // for testing, when we pass data as json
      if (event.body) event.body = JSON.parse(event.body)

      // Run the Lambda
      const responseLambda = await lambda(event, context)
      statusCode = responseLambda.statusCode || 200
      json = responseLambda.json

    } catch (e) {
      console.error(e)

      json = { error: e.message }
      statusCode = e.statusCode || 500
    }

    // close postgresql connection
    try {
      await destroyConnection()
    } catch (err) {
      json = { error: e.message }
      statusCode = e.statusCode || 500
    }

    // Return HTTP response
    const response = {
      statusCode,
      body: JSON.stringify(json)
    }

    if (corsWhitelist.includes(event.headers.origin)) {
      response.headers = {
        'Access-Control-Allow-Origin': event.headers.origin,
        'Access-Control-Allow-Methods': event.httpMethod
      }
    }

    return response
  }
}
