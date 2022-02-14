import mongoose from '../db/db.js'

const Schema = mongoose.Schema

const appointmentShema = Schema(
	{
		dateBegin: { type: Date, required: true },
		dateEnd: { type: Date, required: true },
		adress: { type: String, required: true },
		outdoor: { type: Boolean, required: true },
		id_buyer: {
			type: 'ObjectId',
			ref: 'User',
			required: true,
		},
		id_agent: {
			type: 'ObjectId',
			ref: 'User',
			required: true,
		},
		id_agent: {
			type: 'ObjectId',
			ref: 'Property',
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Appointment', appointmentShema)
