'use strict'
import handler from '../../util/handler.js'
import * as productRepository from '../../repository/products.js'
import { NotFound } from '../errors.js'

const createProduct = handler(async (event, _context) => {
  const { body } = event

  if (!body || !body.title) throw new NotFound(`You should specify the title of product`)

  const createdProductId = await productRepository.createProduct(body)
  const [createdProduct] = await productRepository.getProducts({ id: createdProductId })

  return {
    statusCode: 200,
    json: createdProduct
  }
})

export {
  createProduct
}
