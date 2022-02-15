import mongoose from '../db/db.js'

const rentalShema = mongoose.Schema(
	{
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		effectiveEndDate: { type: Date },
		amount: { type: Number, required: true },
		status: { type: Boolean, required: true },
		keysNumber: { type: Number, required: true },
		id_property: {
			type: 'ObjectId',
			ref: 'Property',
			required: true,
		},
		id_buyers: [
			{
				type: 'ObjectId',
				ref: 'User',
				required: true,
			},
		],
		id_inventories: [
			{
				type: 'ObjectId',
				ref: 'Inventory',
			},
		],
	},
	{ timestamps: true }
)

export default mongoose.model('Rental', rentalShema)
