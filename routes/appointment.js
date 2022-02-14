import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getParticipants,
} from '../controllers/appointment.js'
import auth from '../middleware/auth.js'
import appointmentValidationRules from '../middleware/validation/appointment.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/', auth, appointmentValidationRules(), validation, create)
router.put(
	'/:_id',
	auth,
	validateParamId(),
	appointmentValidationRules(),
	validation,
	update
)
router.delete('/:_id', auth, validateParamId(), validation, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, validateParamId(), validation, getOne)
router.get(
	'/getParticipants/:_id',
	auth,
	validateParamId(),
	validation,
	getParticipants
)

export default router
