import express from 'express'
import { getAll, getOne } from '../controllers/seller.js'
import auth from '../middleware/auth.js'
import validation from '../validation/seller.js'

const router = express.Router()

router.get('/:id', auth, getOne)
router.get('/', auth, getAll)

export default router
