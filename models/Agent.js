import Mongoose from '../db/db.js'
import User from './User.js'

const Agent = User.discriminator(
	'Agent',
	Mongoose.Schema({
		pro_phone_number: { type: String, required: true, unique: true },
	})
)

export default Agent
