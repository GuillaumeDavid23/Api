import mongoose from '../db/db.js'

const transactionShema = mongoose.Schema(
	{
		id_agent: {
			type: 'ObjectId',
			ref: 'User',
			required: true,
		},
		id_property: {
			type: 'ObjectId',
			ref: 'Property',
			required: true,
		},

		lst_buyer: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
			required: true,
			default: [],
		},
		lst_seller: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
			required: true,
			default: [],
		},
		amount: { type: Number, required: true },
		date: { type: Date, required: true },
		status: { type: Boolean, required: true, default: true },
	},
	{ timestamps: true }
)

export default mongoose.model('Transaction', transactionShema)
