import getConnectionKnex from '../config/knex.js'
import { isUuid, removeEmptyKeys } from '../helper.js'

const getProducts = async (filters = {}) => {
  const products = getConnectionKnex()
    .table('products AS p')
    .select('p.id', 'p.title', 'p.price', 's.count', 'p.description')
    .join('stocks AS s', 'p.id', 's.product_id')

  if (isUuid(filters.id)) products.where({ 'p.id': filters.id })

  return products
}

const createProduct = async (product = {}) => {
  const newProduct = removeEmptyKeys({
    title: product.title,
    price: product.price,
    description: product.description
  })

  const [{ id }] = await getConnectionKnex()('products').insert(newProduct).returning('id')

  const stock = removeEmptyKeys({ product_id: id, count: product.count })
  await getConnectionKnex()('stocks').insert(stock)

  return id
}

export {
  getProducts,
  createProduct
}
