import express from 'express'
import { getAll, getOne } from '../controllers/buyer.js'
import auth from '../middleware/auth.js'
import validation from '../validation/buyer.js'

const router = express.Router()

router.get('/', auth, getAll)
router.get('/:_id', auth, getOne)

export default router
