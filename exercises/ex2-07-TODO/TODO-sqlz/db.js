const {Sequelize, DataTypes} = require('sequelize')

const db = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite', // this is the filename.
})
// const db = new Sequelize('postgres://postgres:postgres@localhost:5432/myDb1') // Example for postgres

module.exports = db
