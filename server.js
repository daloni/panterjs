'use strict'

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const http = require('http')
const debug = require('debug')
const chalk = require('chalk')
const express = require('express')
const rfs = require('rotating-file-stream')

const { handleFatalError } = require('./app/helpers')
const webRoutes = require('./routes/web')
const apiRoutes = require('./routes/api')
const { Model } = require('objection')
const knexfile = require('./database/knexfile')
const Knex = require('knex')

const port = process.env.PORT || 8080
const app = express()
const passport = require('passport')
const passportConfig = require('./config/passport')
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const cors = require('cors')
const corsConfig = require('./config/cors')
const helmet = require('helmet')

const server = http.createServer(app)

if (!process.env.APP_KEY) {
  console.error(`${chalk.red('[fatal error]')} APP_KEY not provided`)
  process.exit(1)
}

// Set views diretory
app.set('views', path.join(__dirname, 'resources/views'))

// Set view engine
app.set('view engine', 'pug')

// Logs
if (process.env.NODE_ENV === 'production') {
  const logDirectory = path.join(__dirname, 'storage/logs')

  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

  const accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
  })

  app.use(morgan('combined', { stream: accessLogStream }))
} else {
  app.use(morgan('dev'))
}

// Set Static files
app.use(express.static(path.join(__dirname, 'public')))

// Before midlewares
app.use(helmet())
app.use(cors(corsConfig))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(cookieParser())
app.use(expressSession({ secret: process.env.APP_KEY, resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Config passport
passport.use('local-signup', passportConfig.localStrategySignUp)
passport.use('local-signin', passportConfig.localStrategySignIn)
passport.serializeUser(passportConfig.serializeUser)
passport.deserializeUser(passportConfig.deserializeUser)

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
const knex = Knex(knexfile)
Model.knex(knex)

knex.raw('select 1+1 as result')
  .then(() => {
    console.log(`${chalk.green('[panterjs:db]')} authenticated!`)
  })
  .catch(handleFatalError)

// Catch Exception
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[panterjs:server]')} server listening on port ${port}`)
})
