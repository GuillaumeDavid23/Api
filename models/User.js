import mongoose from '../db/db.js'
import Property from './Property.js'
// import seeder from 'mongoose-seeder'

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
		status: { type: Boolean, default: false },
		ref: { type: String },
		deletedAt: { type: Date },

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
			phonePro: { type: String },
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

// try {
// 	seeder.seed({
// 		firstname: 'Anonymous',
// 		lastname: 'Anonymous',
// 		email: 'anonymous@anonymous.com',
// 		password: 'Anonymous0',
// 		newsletter: false,
// 		status: true,
// 	})
// } catch (error) {
// 	console.log(error.message)
// }

export default mongoose.model('User', userSchema)
