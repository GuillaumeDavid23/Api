import mongoose from '../db/db.js'

const rentalShema = mongoose.Schema(
	{
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		effectiveEndDate: { type: Date, required: true },
		amount: { type: Number, required: true },
		status: { type: Boolean, required: true },
		keysNumber: { type: Number, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model('Rental', rentalShema)
