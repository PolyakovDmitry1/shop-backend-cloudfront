import * as dotenv from 'dotenv'
dotenv.config()

const basicAuthorizer = async (event,  _context, cb) => {
  try {
    console.log('event => ', JSON.stringify(event, null, 2))
    const { methodArn, authorizationToken } = event
    const token = authorizationToken ? authorizationToken.split(' ')[1] : ''
    console.log('encoded token => ', token)

    const [login, password] = Buffer.from(token || '', 'base64').toString().split(':')
    const isValid = process.env.ACCOUNT_LOGIN === login && process.env.ACCOUNT_PASSWORD === password

    if (isValid) return generateAuthResponse(login, 'Allow', methodArn)

    return generateAuthResponse(login, 'Deny', methodArn)
  } catch (err) {
    console.log(err)
    cb(err)
  }
}

const generateAuthResponse = (principalId, effect, methodArn) => {
  const policyDocument = generatePolicyDocument(effect, methodArn)

  return {
      principalId,
      policyDocument
  }
}

const generatePolicyDocument = (effect, methodArn) => {
  if (!effect || !methodArn) return null

  return {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: methodArn
    }]
  }
}

export default basicAuthorizer
