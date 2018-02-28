'use strict'

const express = require('express')
const passport = require('passport')
const authController = require('../controllers/auth-controller')
const isAuthenticated = require('../middlewares/is-authenticated')

const web = express.Router()

web.get('/', isAuthenticated, (req, res) => {
  res.render('index', { title: 'Home', message: 'Hello there!', module: '/js/test.js' })
})

web.get('/signup', authController.signup)

web.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup'
}))

web.get('/signin', authController.signin)

web.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/signin'
}))

web.post('/logout', authController.logout)

module.exports = web
