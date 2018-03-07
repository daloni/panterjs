'use strict'

module.exports = {
  secret: process.env.APP_KEY,
  name: 'panterjsId',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production'
  }
}
