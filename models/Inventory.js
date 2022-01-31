import mongoose from '../db/db.js'
import Buyer from '../models/Buyer.js'
import Agent from '../models/Agent.js'

const appointmentShema = mongoose.Schema({
	slot: { type: Date, required: true },
	adress: { type: String, required: true },
	outdoor: { type: Boolean, required: true },
	duration: { type: Number, required: true },
	id_buyer: {
		type: Schema.type.ObjectId,
		ref: Buyer,
		required: true,
	},
	id_agent: {
		type: Schema.type.ObjectId,
		ref: Agent,
		required: true,
	},
})

export default mongoose.model('Appointment', appointmentShema)
