import Mongoose from '../db/db.js'
import User from './User.js'

const Buyer = User.discriminator(
	'Buyer',
	Mongoose.Schema(
		{
			budgetMin: { type: Number, required: false },
			budgetMax: { type: Number, required: false },
			city: { type: String, required: false },
			surfaceMin: { type: Number, required: false },
			surfaceMax: { type: Number, required: false },
			type: { type: String, required: false },
		},
		{ discriminatorKey: 'kind' }
	)
)

export default Buyer
