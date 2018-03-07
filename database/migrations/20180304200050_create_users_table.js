'use strict'

exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary().unsigned()
      table.string('first_name')
      table.string('last_name')
      table.string('email').unique()
      table.string('password')
      table.timestamps()
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
}
