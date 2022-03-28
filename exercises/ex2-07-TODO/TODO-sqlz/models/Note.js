const {DataTypes} = require('sequelize')
const db = require('../db.js')

// model definition
const Note = db.define(
	'notes',
	{
		// Model attributes are defined here
		notes: {
			type: DataTypes.ARRAY,
			// Data types: https://sequelize.org/master/manual/model-basics.html#data-types
			allowNull: false, // default: true
		},
	},
	{
		freezeTableName: true, // You can stop the auto-pluralization performed by Sequelize using the freezeTableName: true option.
		// Other model options go here
	}
)

module.exports = Note
