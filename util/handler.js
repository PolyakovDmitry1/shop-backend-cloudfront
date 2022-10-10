export default function handler(lambda) {
  return async function (event, context) {
    let json, statusCode

    try {
      // Run the Lambda
      const responseLambda = await lambda(event, context)
      statusCode = responseLambda.statusCode || 200
      json = responseLambda.json

    } catch (e) {
      console.error(e)

      body = { error: e.message }
      statusCode = e.statusCode || 500
    }

    // Return HTTP response
    return {
      headers: { 'Access-Control-Allow-Origin': '*' },
      statusCode,
      body: JSON.stringify(json)
    }
  }
}
