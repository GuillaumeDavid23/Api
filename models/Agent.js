import Mongoose from '../db/db.js'
import extend from 'mongoose-schema-extend'

const userShema = Mongoose.Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		token: { type: String, required: false },
		phone: { type: String, required: false },
		newsletter: { type: String, required: false },
		status: { type: String, required: true },
		ref: { type: String, required: false },
	},
	{ collection: 'users' }
)

const agentSchema = userShema.extend({
	pro_phone_number: { type: String, required: true },
})

const Agent = Mongoose.model('Agent', agentSchema)

const Ag = new Agent({
	firstname: 'Benjamin',
	lastname: 'RAULT',
	email: 'agent@agent.com',
	password: 'h4k3r',
	status: 'crepe',
	pro_phone_number: '0000000000',
})

console.log(Ag)

export default Agent
