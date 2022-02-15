import express from 'express'
import { create, update, erase, getAll, getOne } from '../controllers/rental.js'
import auth from '../middleware/auth.js'
import {
	checkRentalBody,
	checkRentalExistence,
} from '../middleware/validation/rental.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/', auth, checkRentalBody(), validation, create)
router.put(
	'/:id',
	auth,
	checkRentalExistence(),
	checkRentalBody(),
	validation,
	update
)
router.delete('/:id', auth, checkRentalExistence(), validation, erase)
router.get('/:id', auth, validateParamId(), validation, getOne)
router.get('/', auth, getAll)

export default router
