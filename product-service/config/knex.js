import knex from 'knex'
import dotenv from 'dotenv'
 dotenv.config()

let currentConnectionKnex

 const getConnectionKnex = () => {
  if (!currentConnectionKnex) {
    currentConnectionKnex = knex({
      client: 'pg',
      connection: {
        host : process.env.DATABASE_HOST,
        port : 5432,
        user : process.env.DATABASE_USERNAME,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE_NAME
      },
      pool: {
        min: 1,
        max: 1
      }
    })
  }

  return currentConnectionKnex
}

export const destroyConnection = async () => {
  if (!currentConnectionKnex) return

  await currentConnectionKnex.client.destroy()
  currentConnectionKnex = null
}

export default getConnectionKnex
