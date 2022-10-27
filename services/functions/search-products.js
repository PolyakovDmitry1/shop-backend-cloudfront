'use strict';
import handler from '../../util/handler.js'
import { isUuid } from '../../helper.js'
import { NotFound } from '../errors.js'
import { getProducts } from '../../repository/products.js'

const getProductsById = handler(async (event) => {
  const productId = event.pathParameters && event.pathParameters.productId
  const [foundProduct] = await getProducts({ id: productId })

  if (!isUuid(productId) || !foundProduct) throw new NotFound(`Product ${productId} not found`)

  return {
    statusCode: 200,
    json: foundProduct
  }
})

export {
  getProductsById
}
