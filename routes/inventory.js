import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getAllForOneUser,
} from '../controllers/inventory.js'
import auth from '../middleware/auth.js'
import inventoryValidationRules from '../middleware/validation/inventory.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/', auth, inventoryValidationRules(), validation, create)
router.put(
	'/:_id',
	auth,
	validateParamId(),
	inventoryValidationRules(),
	validation,
	update
)
router.delete('/:_id', auth, validateParamId(), validation, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, validateParamId(), validation, getOne)
router.get(
	'/getAllForOneUser/:_id',
	auth,
	validateParamId(),
	validation,
	getAllForOneUser
)

export default router
