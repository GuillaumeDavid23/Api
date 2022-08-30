import mongoose from '../db/db.js'
// import timeZone from 'mongoose-timezone'

const appointmentShema = mongoose.Schema(
	{
		dateBegin: { type: Date, required: true },
		dateEnd: { type: Date, required: true },
		address: { type: String, required: true },
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
		id_property: {
			type: 'ObjectId',
			ref: 'Property',
		},
	},
	{ timestamps: true }
)

// appointmentShema.plugin(timeZone)

export default mongoose.model('Appointment', appointmentShema)
