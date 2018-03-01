'use strict'

module.exports = function (sequelize, Sequelize) {
  const User = sequelize.define('user', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    lastName: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  return User
}
