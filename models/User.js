import mongoose from '../db/db.js'

const userSchema = mongoose.Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		token: { type: String, required: false },
		phone: { type: String, required: false },
		newsletter: { type: Boolean, required: false },
		status: { type: Boolean, required: true, default: true },
		ref: { type: String, required: false },
	},
	{ timestamps: true }
)

export default mongoose.model('User', userSchema)
