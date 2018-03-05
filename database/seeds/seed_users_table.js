'use strict'

const faker = require('faker')
const { generateHash } = require('../../utils')

const table = 'users'
const password = generateHash('secret')

exports.seed = (knex, Promise) => {
  return knex(table).del().then(() => {
    const promises = Array(10).fill().map((_, i) => {
      return knex(table).insert([{
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: password
      }])
    })

    return Promise.all(promises)
  })
}
