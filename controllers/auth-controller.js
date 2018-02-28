'use strict'

function signup (req, res) {
  res.render('signup', { message: req.flash('signupMessage') })
}

function signin (req, res) {
  res.render('signin', { message: req.flash('loginMessage') })
}

function logout (req, res) {
  req.session.destroy(err => {
    console.log('Error:', err)

    res.redirect('/')
  })
}

module.exports = {
  signup,
  signin,
  logout
}
