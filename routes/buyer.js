import express from 'express'
import { getAll, getOne, create, getWishlist } from '../controllers/buyer.js'
import auth from '../middleware/auth.js'
import validation from '../validation/buyer.js'

const router = express.Router()

router.post('/', auth, validation, create)
router.get('/', getAll)
router.get('/:_id', auth, getOne)
router.get('/:_id/wishlist', getWishlist)

export default router
