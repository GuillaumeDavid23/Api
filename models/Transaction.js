import mongoose from '../db/db.js'
const Schema = mongoose.Schema
import User from './User.js'

const transactionShema = Schema(
	{
		lst_buyer: { type: Array, required: true },
		lst_seller: { type: Array, required: true },
		id_agent: {
			type: Schema.Types.ObjectId,
			ref: User,
			required: true,
		},
		amount: { type: Number, required: true },
		date: { type: Date, required: true },
		status: { type: Boolean, required: true, default: true },
	},
	{ timestamps: true }
)

export default mongoose.model('Transaction', transactionShema)
