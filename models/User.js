import mongoose from '../db/db.js'
import Property from './Property.js'

const userSchema = mongoose.Schema(
	{
		// Commun:
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		token: { type: String },
		phone: { type: String },
		newsletter: { type: Boolean, default: 0 },
		status: { type: Boolean, required: true, default: true },
		ref: { type: String },

		//Roles:
		buyer: {
			wishlist: {
				type: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: Property,
					},
				],
				default: undefined,
			},
			budgetMin: { type: Number },
			budgetMax: { type: Number },
			city: { type: String },
			surfaceMin: { type: Number },
			surfaceMax: { type: Number },
			type: { type: String },
		},

		agent: {
			pro_phone_number: { type: String },
		},

		seller: {
			propertiesList: {
				type: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: Property,
					},
				],
				default: undefined,
			},
		},
	},
	{ timestamps: true }
)

export default mongoose.model('User', userSchema)
