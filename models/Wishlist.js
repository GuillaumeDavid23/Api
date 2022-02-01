import mongoose from '../db/db.js'
import Buyer from '../models/Buyer.js'
import Property from '../models/Property.js'

const wishlistShema = mongoose.Schema({
	createdAt: { type: Date, required: true },
	id_buyer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Buyer,
		required: true,
	},
	id_property: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Property,
		required: true,
	},
})

export default mongoose.model('Wishlist', wishlistShema)
