import mongoose from 'mongoose'
// import mongoose from '../db/db.js'
import Property from './Property.js'

const userSchema = mongoose.Schema(
	{
		// Commun:
		firstname: { type: String },
		lastname: { type: String },
		email: { type: String, required: true, unique: true },
		password: { type: String },
		token: { type: String },
		phone: { type: String },
		newsletter: { type: Boolean, default: false },
		status: { type: Boolean, default: true },
		ref: { type: String },
		deletedAt: { type: Date },
		roles: { type: String, default: 'user' },
		//Roles:
		buyer: {
			agent: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				default: undefined,
			},
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
			propertyType: { type: String },
			rooms: { type: Number },
		},

		agent: {
			position: { type: String },
			phonePro: { type: String },
			customers: {
				type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
				default: undefined,
			},
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
