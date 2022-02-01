import mongoose from '../db/db.js'
import Agent from './Agent.js'

const inventoryShema = mongoose.Schema({
	id_agent: {
		type: Schema.type.ObjectId,
		ref: Agent,
		required: true,
	},
	inOut: { type: Boolean, required: true },
	userReference: { type: String, required: true },
	date: { type: Date, required: true },
	previousBuyerRef: { type: String, required: true },
	lst_statsMeters: { type: Array, required: true },
	lst_roomDetails: { type: Array, required: true },
})

export default mongoose.model('Inventory', inventoryShema)
