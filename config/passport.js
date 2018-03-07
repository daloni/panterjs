'use strict'

const { generateHash, isValidPassword } = require('../app/helpers')
const LocalStrategy = require('passport-local').Strategy
const User = require('../app/models/user')

const configLocalStrategy = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

const serializeUser = (user, done) => {
  done(null, user.id)
}

const deserializeUser = async (id, done) => {
  const user = await User.query().findById(id)

  if (user) {
    done(null, user)
  }

  done(null, false)
}

const localStrategySignUp = new LocalStrategy(configLocalStrategy, async (req, email, password, done) => {
  const user = await User.query().findOne({ email: email })

  if (user) {
    return done(null, false, req.flash('signupMessage', 'That email is already taken'))
  }

  const newUser = await User.query().insert({
    email: email,
    password: generateHash(password),
    first_name: req.body.firstName,
    last_name: req.body.lastName
  })

  if (!newUser) {
    return done(null, false)
  }

  return done(null, newUser)
})

const localStrategySignIn = new LocalStrategy(configLocalStrategy, async (req, email, password, done) => {
  const user = await User.query().findOne({ email: email })

  if (!user) {
    return done(null, false, req.flash('loginMessage', 'No user found.'))
  }

  if (!isValidPassword(user.password, password)) {
    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
  }

  return done(null, user)
})

module.exports = {
  serializeUser,
  deserializeUser,
  localStrategySignUp,
  localStrategySignIn
}
