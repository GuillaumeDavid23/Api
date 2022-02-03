import express from 'express'
import { create, update, erase, getAll, getOne } from '../controllers/rental.js'
import auth from '../middleware/auth.js'
import rentalValidationRules from '../validation/rental.js'
import { validation } from '../util/functions.js'

const router = express.Router()

router.post('/', auth, rentalValidationRules(), validation, create)
router.put('/:id', auth, rentalValidationRules(), validation, update)
router.delete('/:id', auth, erase)
router.get('/:id', auth, getOne)
router.get('/', auth, getAll)

export default router
