'use strict'

const express = require('express')

const api = express.Router()

api.get('/', (req, res) => {
  res.send('api /')
})

module.exports = api
