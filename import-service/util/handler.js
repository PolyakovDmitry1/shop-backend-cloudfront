
import * as dotenv from 'dotenv'
dotenv.config()

export default function handler(lambda) {
  return async function (event, context) {
    let json, statusCode

    try {
      console.log(JSON.stringify(event, null, 4), 'incoming request')
      if (event.body) event.body = JSON.parse(event.body)

      // Run the Lambda
      const responseLambda = await lambda(event, context) || {}
      statusCode = responseLambda.statusCode || 200
      json = responseLambda.json

    } catch (e) {
      console.error(e)

      json = { error: e.message }
      statusCode = e.statusCode || 500
    }

    // Return HTTP response
    const response = {
      statusCode,
      body: JSON.stringify(json)
    }

    const corsWhitelist = JSON.parse(process.env.CORS_WHITE_LIST)
    if (corsWhitelist.includes(event.headers && event.headers.origin)) {
      response.headers = {
        'Access-Control-Allow-Origin': event.headers.origin,
        'Access-Control-Allow-Methods': event.httpMethod
      }
    }

    return response
  }
}
