import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const propertySchema = mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		amount: { type: Number, required: true },
		// 0: adresse
		// 1: PostalCode
		// 2: City
		// 3: Country
		location: { type: Array, required: true },
		propertyType: { type: String, required: true },
		surface: { type: Number, required: true },
		roomNumber: { type: Number, required: true },
		transactionType: { type: String, required: true },
		list_equipments: { type: Array },
		list_heater: { type: Array },
		electricMeterRef: { type: String },
		gasMeterRef: { type: String },
		isToSell: { type: Boolean, required: true },
		propertyRef: {
			type: String,
			required: true,
			unique: true
		},
		imageUrl: [
			{
				type: String
			}
		],

		buyers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		],

		verified: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date }
	},
	{ timestamps: true }
)

propertySchema.plugin(uniqueValidator)

export default mongoose.model('Property', propertySchema)
