'use strict'
import handler from '../../util/handler.js'
import { getProducts } from '../../repository/products.js'

const getProductsList = handler(async (_event, _context) => {
  const products = await getProducts()

  return {
    statusCode: 200,
    json: products
  }
})

export {
  getProductsList
}
