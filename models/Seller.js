import mongoose from '../db/db.js'
import User from './User.js'

const sellerShema = mongoose.Schema({
	isSelling: { type: Boolean, required: true },
})

export default mongoose.model('Seller', userShema)
