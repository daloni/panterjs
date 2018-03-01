'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../../config/database')

const sequelize = new Sequelize(config)
let db = {}

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .map(file => {
    let model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).map(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
