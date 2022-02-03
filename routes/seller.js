import express from 'express'
import { create, getAll, getOne } from '../controllers/seller.js'
import auth from '../middleware/auth.js'
// import sellerValidationRules from '../validation/seller.js'
// import { validation } from '../util/functions.js'

const router = express.Router()

router.post('/', auth, create)
router.get('/:id', getOne)
router.get('/', getAll)

export default router
