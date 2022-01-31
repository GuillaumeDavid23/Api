import Mongoose from '../db/db.js'
import User from './User.js'

const Agent = User.discriminator(
	'Agent',
	Mongoose.Schema({
		pro_phone_number: { type: String, required: true },
	})
)

export default Agent
