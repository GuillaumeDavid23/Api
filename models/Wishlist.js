import mongoose from '../db/db.js'
import Buyer from '../models/Buyer.js'
import Property from '../models/Property.js'

const wishlistShema = mongoose.Schema(
	{
		id_buyer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Buyer',
			required: true,
		},
		properties: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Property',
			},
		],
	},
	{ timestamp: true }
)
export default mongoose.model('Wishlist', wishlistShema)
