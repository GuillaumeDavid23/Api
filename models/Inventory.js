import mongoose from '../db/db.js'
import timeZone from 'mongoose-timezone'

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
		inOut: { type: Boolean, required: true }, // In == true // Out == false
		userReference: { type: String, required: true },
		date: { type: Date, required: true },
		keyNumber: { type: String, required: true },
		previousBuyerRef: { type: String, required: false },
		lst_statsMeters: { type: Array, required: false },
		lst_roomDetails: { type: Array, required: true },
		lst_equipements: { type: Array, required: true },
		lst_heater: { type: Array, required: true },
		lst_hotWater: { type: Array, required: true },
	},
	{ timestamps: true }
)

inventoryShema.plugin(timeZone)

export default mongoose.model('Inventory', inventoryShema)
