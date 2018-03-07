'use strict'

const cors = require('./cors')
const database = require('./database')
const passport = require('./passport')
const session = require('./session')

module.exports = {
  cors,
  database,
  passport,
  session
}
