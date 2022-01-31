import mongoose from '../db/db.js'
import User from './User.js'

const sellerModel = User.discriminator(
	'Seller',
	mongoose.Schema({
		isSelling: { type: Boolean, required: true },
	})
)

export default sellerModel
