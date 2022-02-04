import mongoose from '../db/db.js'

const userSchema = mongoose.Schema(
	{
		// Commun:
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		token: { type: String, required: false },
		phone: { type: String, required: false, unique: true },
		newsletter: { type: Boolean, required: false, default: 0 },
		status: { type: Boolean, required: true, default: true },
		ref: { type: String, required: false },
		role: { type: String, required: true },

		// Agent:
		pro_phone_number: { type: String, required: false, unique: true },

		// Buyer:
		budgetMin: { type: Number, required: false },
		budgetMax: { type: Number, required: false },
		city: { type: String, required: false },
		surfaceMin: { type: Number, required: false },
		surfaceMax: { type: Number, required: false },
		type: { type: String, required: false },

		wishlist: { type: Array, required: false },
		// wishlist: {
		// 	type: Mongoose.Schema.Types.ObjectId,
		// 	ref: 'Property',
		// },

		// Seller:
		isSelling: { type: Boolean, required: false },
	},
	{ timestamps: true }
)

export default mongoose.model('User', userSchema)
