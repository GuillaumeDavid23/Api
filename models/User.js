import mongoose from '../db/db.js'

const userSchema = mongoose.Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	token: { type: String, required: false },
	phone: { type: String, required: false },
	newsletter: { type: String, required: false },
	status: { type: String, required: true },
	ref: { type: String, required: false },
})

export default mongoose.model('User', userSchema)
