import mongoose from '../db/db.js'
const Schema = mongoose.Schema
import User from './User.js'

const appointmentShema = Schema(
	{
		dateBegin: { type: Date, required: true },
		dateEnd: { type: Date, required: true },
		address: { type: String, required: true },
		outdoor: { type: Boolean, required: true },
		id_buyer: {
			type: Schema.Types.ObjectId,
			ref: User,
			required: true,
		},
		id_agent: {
			type: Schema.Types.ObjectId,
			ref: User,
			required: true,
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Appointment', appointmentShema)
