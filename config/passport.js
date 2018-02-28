'use strict'

const bCrypt = require('bcrypt-nodejs')
const LocalStrategy = require('passport-local').Strategy
const { user } = require('../models')

const User = user

const configLocalStrategy = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then(user => {
        if (user) {
          done(null, user.get())
        }

        done(user.erros, null)
      })
  })

  passport.use('local-signup', new LocalStrategy(configLocalStrategy,
    function (req, email, password, done) {
      const generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
      }

      User.findOne({ where: { email: email } })
        .then(user => {
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken'))
          }

          const data = {
            email: email,
            password: generateHash(password),
            firstName: req.body.firstName,
            lastName: req.body.lastName
          }

          User.create(data)
            .then((newUser) => {
              if (!newUser) {
                return done(null, false)
              }

              return done(null, newUser)
            })
        })
    }))

  passport.use('local-signin', new LocalStrategy(configLocalStrategy,
    function (req, email, password, done) {
      const isValidPassword = function (userpass, password) {
        return bCrypt.compareSync(password, userpass)
      }

      User.findOne({ where: { email: email } })
        .then(user => {
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.'))
          }

          if (!isValidPassword(user.password, password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
          }

          return done(null, user.get())
        })
        .catch(err => {
          console.log('Error:', err)

          return done(null, false, req.flash('loginMessage', 'Something went wrong with your Signin'))
        })
    }))
}
