export class NotFound extends Error {  
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.statusCode = 400
  }
}
