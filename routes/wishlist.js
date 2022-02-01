import express from 'express'
import { create, update, erase, getOne } from '../controllers/wishlist.js'
import auth from '../middleware/auth.js'
import validation from '../validation/wishlist.js'

const router = express.Router()

router.post('/', auth, validation, create)
router.put('/_:id', auth, validation, update)
router.delete('/:_id', auth, erase)
router.get('/:_id', auth, getOne)

export default router
