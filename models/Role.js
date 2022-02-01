import mongoose from '../db/db.js'

const roleShema = mongoose.Schema({
	name: { type: String, required: true },
})

export default mongoose.model('Role', roleShema)
