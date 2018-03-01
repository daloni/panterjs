'use strict'

const inquirer = require('inquirer')
const chalk = require('chalk')
const minimist = require('minimist')
const { handleFatalError } = require('../helpers')

const { sequelize } = require('../models')

const args = minimist(process.argv)
const prompt = inquirer.createPromptModule()

async function setup () {
  if (!args.yes) {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure?'
      }
    ])

    if (!answer.setup) {
      return console.log('Nothing happened :)')
    }
  }

  await sequelize.authenticate()
    .then(() => {
      console.log(`${chalk.green('[panterjs:db]')} authenticated`)
    })
    .catch(err => {
      handleFatalError(err)
    })

  await sequelize.sync({ force: true })
    .then(() => {
      console.log(`${chalk.green('[panterjs:db]')} database recreate successfully!`)
    })
    .catch(handleFatalError)

  process.exit(0)
}

setup()
