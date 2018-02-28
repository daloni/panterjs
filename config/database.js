'use strict'

const debug = require('debug')('panterjs:db')

module.exports = {
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.DATABASE_NAME || 'panterjs',
  username: process.env.DATABASE_USERNAME || 'panterjs',
  password: process.env.DATABASE_PASSWORD || 'panterjs',
  dialect: 'postgres',
  logging: s => debug(s)
}
