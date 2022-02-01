import mongoose from '../db/db.js'
const Schema = mongoose.Schema

import Buyer from './Buyer.js'
import Agent from './Agent.js'

const appointmentShema = Schema({
	slot: { type: Date, required: true },
	adress: { type: String, required: true },
	outdoor: { type: Boolean, required: true },
	duration: { type: Number, required: true },
	id_buyer: {
		type: Schema.Types.ObjectId,
		ref: Buyer,
		required: true,
	},
	id_agent: {
		type: Schema.Types.ObjectId,
		ref: Agent,
		required: true,
	},
})

export default mongoose.model('Appointment', appointmentShema)
