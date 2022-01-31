import mongoose from '../db/db.js'
const Schema = mongoose.Schema
import Agent from './Agent.js'

const transactionShema = Schema({
	lst_buyer: { type: Array, required: true },
	lst_seller: { type: Array, required: true },
	// id_agent: {
	// 	type: Schema.type.ObjectId,
	// 	ref: Agent,
	// 	required: true,
	// },
	amount: { type: Number, required: true },
	date: { type: Date, required: true },
	status: { type: Boolean, required: true },
})

export default mongoose.model('Transaction', transactionShema)
