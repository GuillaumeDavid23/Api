import Mongoose from '../db/db.js'

const propertySchema = Mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	amount: { type: Number, required: true },
	location: { type: String, required: true },
	propertyType: { type: String, required: true },
	surface: { type: Number, required: true },
	roomNumber: { type: Number, required: true },
	transactionType: { type: String, required: true },
	list_equipments: { type: Array, required: true },
	list_heater: { type: Array, required: true },
	list_water: { type: Array, required: true },
	electricMeterRef: { type: String, required: true },
	gasMeterRef: { type: String, required: true },
	isToSell: { type: Boolean, required: true },
	propertyRef: { type: String, required: true },
})

export default Mongoose.model('Property', propertySchema)
