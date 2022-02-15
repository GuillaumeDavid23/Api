import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
} from '../controllers/transaction.js'
import auth from '../middleware/auth.js'
import transactionValidationRules from '../middleware/validation/transaction.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/', transactionValidationRules(), validation, create)
router.put('/:_id', auth, transactionValidationRules(), validation, update)
router.delete('/:_id', auth, validateParamId(), validation, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, validateParamId(), validation, getOne)

export default router
