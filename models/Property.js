import Mongoose from '../db/db.js'
import uniqueValidator from 'mongoose-unique-validator'

const propertySchema = Mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		amount: { type: Number, required: true },
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
			unique: true,
		},
		imageUrl: { type: Object },

		buyers: [
			{
				type: Mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],

		verified: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{ timestamps: true }
)

propertySchema.plugin(uniqueValidator)

export default Mongoose.model('Property', propertySchema)
