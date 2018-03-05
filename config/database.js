'use strict'

module.exports = {
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.DATABASE_NAME || 'panterjs',
  password: process.env.DATABASE_PASSWORD || 'panterjs',
  user: process.env.DATABASE_USERNAME || 'panterjs'
}
