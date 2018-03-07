'use strict'

const chalk = require('chalk')
const bCrypt = require('bcrypt-nodejs')

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

function generateHash (password, salt = 8) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(salt), null)
}

function isValidPassword (userpass, password) {
  return bCrypt.compareSync(password, userpass)
}

module.exports = {
  handleFatalError,
  generateHash,
  isValidPassword
}
