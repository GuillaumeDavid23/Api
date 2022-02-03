import express from 'express'
import { create, update, erase, getOne } from '../controllers/wishlist.js'
import auth from '../middleware/auth.js'
import wishlistValidationRules from '../validation/wishlist.js'
import { validation } from '../util/functions.js'

const router = express.Router()

router.post('/', auth, wishlistValidationRules(), validation, create)
router.put('/_:id', auth, wishlistValidationRules(), validation, update)
router.delete('/:_id', auth, erase)
router.get('/:_id', auth, getOne)

export default router
