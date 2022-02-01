import Mongoose from '../db/db.js'
import User from './User.js'

const Agent = User.discriminator(
	'Agent',
	Mongoose.Schema({
		pro_phone_number: { type: String, required: true },
	})
)

export default Agent

// {
//     "dateBegin": "2022-02-01",
//     "dateEnd": "2022-02-01",
//     "adress": "33 grande rue",
//     "outdoor": true,
//     "id_buyer": "61f80338a0495a41d29c8c81",
//     "id_agent": "61f9089fef0fde98b0d03d00"
// }
