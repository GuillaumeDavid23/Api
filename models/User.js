import mongoose from '../db/db.js'

const userShema = mongoose.Schema({
	name: { type: String, required: true },
})

export default mongoose.model('User', userShema)
