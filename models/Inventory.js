import mongoose from '../db/db.js'

const inventoryShema = mongoose.Schema(
	{
		id_agent: {
			type: 'ObjectId',
			ref: 'User',
			required: true,
		},
		id_rental: {
			type: 'ObjectId',
			ref: 'Rental',
			required: true,
		},
		inOut: { type: Boolean, required: true },
		userReference: { type: String, required: true },
		date: { type: Date, required: true },
		previousBuyerRef: { type: String, required: false },
		lst_statsMeters: { type: Array, required: true },
		lst_roomDetails: { type: Array, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model('Inventory', inventoryShema)
