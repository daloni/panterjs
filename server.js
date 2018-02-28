'use strict'

require('dotenv').config()
const path = require('path')
const http = require('http')
const debug = require('debug')
const chalk = require('chalk')
const express = require('express')

const { handleFatalError } = require('./utils')
const webRoutes = require('./routes/web')
const apiRoutes = require('./routes/api')

const { sequelize } = require('./models')

const port = process.env.PORT || 8080
const app = express()
const passport = require('passport')
const flash = require('connect-flash')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const server = http.createServer(app)

// Set views diretory
app.set('views', path.join(__dirname, 'views'))

// Set view engine
app.set('view engine', 'pug')

// Set Static files
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Passport

if (!process.env.APP_KEY) {
  console.error(`${chalk.red('[fatal error]')} APP_KEY not provided`)
  process.exit(1)
}

require('./config/passport')(passport)

app.use(session({ secret: process.env.APP_KEY }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Router
app.use('/', webRoutes)
app.use('/api', apiRoutes)

// Express Error Handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

// Database
sequelize.authenticate()
  .then(() => {
    console.log(`${chalk.green('[panterjs:db]')} authenticated!`)
  })
  .catch(handleFatalError)

sequelize.sync({ force: false })
  .then(() => {
    console.log(`${chalk.green('[panterjs:db]')} database sync successfully!`)
  })
  .catch(handleFatalError)

// Catch Exception
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[panterjs:server]')} server listening on port ${port}`)
})
