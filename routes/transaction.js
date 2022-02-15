import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
} from '../controllers/transaction.js'
import auth from '../middleware/auth.js'
import {
	checkTransactionBody,
	checkTransactionExistence,
} from '../middleware/validation/transaction.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/', checkTransactionBody(), validation, create)
router.put(
	'/:_id',
	auth,
	checkTransactionExistence(),
	checkTransactionBody(),
	validation,
	update
)
router.delete('/:_id', auth, checkTransactionExistence(), validation, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, validateParamId(), validation, getOne)

export default router
