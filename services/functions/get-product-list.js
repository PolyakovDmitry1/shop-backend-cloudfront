'use strict';
import handler from '../../util/handler.js'
import { productList } from '../../mocks/products-list.js'

const getProductsList = handler(async (event) => {

  return {
    statusCode: 200,
    json: productList
  }
})

export {
  getProductsList
}
