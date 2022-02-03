import express from 'express'
import { getAll, getOne, create, getWishlist } from '../controllers/buyer.js'
import auth from '../middleware/auth.js'
import buyerValidationRules from '../validation/buyer.js'
import { validation } from '../util/functions.js'

const router = express.Router()

router.post('/', auth, buyerValidationRules(), validation, create)
router.get('/', auth, getAll)
router.get('/:_id', auth, getOne)
router.get('/:_id/wishlist', getWishlist)

export default router
