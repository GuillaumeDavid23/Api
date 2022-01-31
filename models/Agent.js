import Mongoose from 'mongoose'

const agentSchema = Mongoose.Schema({
	pro_phone_number: { type: String, required: true },
})

export default Mongoose.model('Agent', agentSchema)
