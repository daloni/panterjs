'use strict'

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const databaseConfig = require('../config/database')

module.exports = {
  client: 'pg',
  connection: {
    host: databaseConfig.host,
    database: databaseConfig.database,
    password: databaseConfig.password,
    user: databaseConfig.user
  },
  seeds: {
    directory: path.join(__dirname, 'seeds')
  }
}
