import Mongoose from '../db/db.js'
import User from './User.js'

const Buyer = User.discriminator(
	'Buyer',
	Mongoose.Schema({
		budgetMin: { type: Number, required: true },
		budgetMax: { type: Number, required: true },
		city: { type: String, required: true },
		surfaceMin: { type: Number, required: true },
		surfaceMax: { type: Number, required: true },
		type: { type: String, required: true },
	})
)

export default Buyer
