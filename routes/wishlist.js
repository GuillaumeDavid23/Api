import express from 'express'
import { create, update, erase, getOne } from '../controllers/wishlist.js'

const router = express.Router()

router.post('/', create)
router.put('/_:id', update)
router.delete('/:_id', erase)
router.get('/:_id', getOne)

export default router
