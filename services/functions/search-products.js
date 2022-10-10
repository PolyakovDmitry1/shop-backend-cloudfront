'use strict';
import handler from '../../util/handler.js'
import { productList } from '../../mocks/products-list.js'
import { NotFound } from '../errors.js'

const getProductsById = handler(async (event) => {
  const productId = event.pathParameters && event.pathParameters.productId
  const foundProduct = productList.find(({ id }) => id === productId) || null

  if (!foundProduct) throw new NotFound(`Product ${productId} not found`)

  return {
    statusCode: 200,
    body: foundProduct
  }
})

export {
  getProductsById
}
