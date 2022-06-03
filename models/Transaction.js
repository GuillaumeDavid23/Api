import mongoose from '../db/db.js'
import timeZone from 'mongoose-timezone'

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
		lst_buyer: [
			{
				type: 'ObjectId',
				ref: 'User',
				required: true,
			},
		],
		lst_seller: [
			{
				type: 'ObjectId',
				ref: 'User',
				required: true,
			},
		],
		amount: { type: Number, required: true },
		date: { type: Date, required: true },
		status: { type: Boolean, required: true, default: true },
	},
	{ timestamps: true }
)

transactionShema.plugin(timeZone)

export default mongoose.model('Transaction', transactionShema)
