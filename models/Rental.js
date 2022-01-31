import mongoose from 'mongoose'
import db from '../db/db.js'

const { DataTypes } = sequelize

export default db.define(
	'type_signalement',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING(60),
			allowNull: false,
		},
		portail: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
		},
	},
	{ timestamps: false, freezeTableName: true }
)
