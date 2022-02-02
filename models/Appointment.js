import mongoose from '../db/db.js'
const Schema = mongoose.Schema

import Buyer from './Buyer.js'
import Agent from './Agent.js'

const appointmentShema = Schema(
	{
		dateBegin: { type: Date, required: true },
		dateEnd: { type: Date, required: true },
		adress: { type: String, required: true },
		outdoor: { type: Boolean, required: true },
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
	},
	{ timestamps: true }
)

export default mongoose.model('Appointment', appointmentShema)
