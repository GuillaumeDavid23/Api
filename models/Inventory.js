import mongoose from '../db/db.js'
import User from './User.js'
const inventoryShema = mongoose.Schema(
	{
		id_agent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
			required: true,
		},
		inOut: { type: Boolean, required: true },
		userReference: { type: String, required: true },
		date: { type: Date, required: true },
		previousBuyerRef: { type: String, required: true },
		lst_statsMeters: { type: Array, required: true },
		lst_roomDetails: { type: Array, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model('Inventory', inventoryShema)
