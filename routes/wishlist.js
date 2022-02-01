import express from 'express'
import { create, update, erase, getOne } from '../controllers/wishlist.js'
import validation from '../validation/wishlist.js'

const router = express.Router()

router.post('/', validation, create)
router.put('/_:id', validation, update)
router.delete('/:_id', erase)
router.get('/:_id', getOne)

export default router
