import express from 'express'
import { create, update, erase, getAll, getOne } from '../controllers/rental.js'
import auth from '../middleware/auth.js'
import rentalValidationRules from '../middleware/validation/rental.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/', auth, rentalValidationRules(), validation, create)
router.put(
	'/:id',
	auth,
	validateParamId(),
	rentalValidationRules(),
	validation,
	update
)
router.delete('/:id', auth, validateParamId(), validation, erase)
router.get('/:id', auth, validateParamId(), validation, getOne)
router.get('/', auth, getAll)

export default router
