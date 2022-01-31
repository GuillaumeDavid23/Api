import mongoose from '../db/db.js'

const transactionShema = mongoose.Schema({
	lst_buyer: { type: Array, required: true },
	lst_seller: { type: Array, required: true },
	id_agent: { type: Number, required: true },
	amount: { type: Number, required: true },
	date: { type: Date, required: true },
	status: { type: Boolean, required: true },
})

export default mongoose.model('Transaction', transactionShema)
