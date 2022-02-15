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
import {
	checkInventoryBody,
	checkInventoryExistence,
} from '../middleware/validation/inventory.js'
import { checkUserExistence } from '../middleware/validation/user.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/', auth, checkInventoryBody(), validation, create)
router.put(
	'/:_id',
	auth,
	checkInventoryExistence(),
	checkInventoryBody(),
	validation,
	update
)
router.delete('/:_id', auth, checkInventoryExistence(), validation, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, validateParamId(), validation, getOne)
router.get(
	'/getAllForOneUser/:_id',
	auth,
	checkUserExistence(),
	validation,
	getAllForOneUser
)

export default router
