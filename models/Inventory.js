import mongoose from '../db/db.js'

const inventoryShema = mongoose.Schema({
	inOut: { type: Boolean, required: true },
	userReference: { type: String, required: true },
	date: { type: Date, required: true },
	previousBuyerRef: { type: String, required: true },
	lst_statsMeters: { type: Array, required: true },
	lst_roomDetails: { type: Array, required: true },
})

export default mongoose.model('Inventory', inventoryShema)
