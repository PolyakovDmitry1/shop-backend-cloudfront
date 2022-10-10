export default function handler(lambda) {
  return async function (event, context) {
    let body, statusCode

    try {
      // Run the Lambda
      body = await lambda(event, context)
      statusCode = 200

    } catch (e) {
      console.error(e)

      body = { error: e.message }
      statusCode = e.statusCode || 500
    }

    // Return HTTP response
    return {
      headers: { 'Access-Control-Allow-Origin': '*' },
      statusCode,
      body: JSON.stringify(body)
    }
  }
}
