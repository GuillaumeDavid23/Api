import express from 'express'
import { getAll, getOne, create } from '../controllers/buyer.js'
import auth from '../middleware/auth.js'
import validation from '../validation/buyer.js'

const router = express.Router()

router.post('/', auth, validation, create)
router.get('/', auth, getAll)
router.get('/:_id', auth, getOne)

export default router
