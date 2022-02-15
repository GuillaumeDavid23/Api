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
import {
	checkAppointmentBody,
	checkAppointmentExistence,
} from '../middleware/validation/appointment.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/', auth, checkAppointmentBody(), validation, create)
router.put(
	'/:_id',
	auth,
	checkAppointmentExistence(),
	checkAppointmentBody(),
	validation,
	update
)
router.delete('/:_id', auth, checkAppointmentExistence(), validation, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, validateParamId(), validation, getOne)
router.get(
	'/getParticipants/:_id',
	auth,
	checkAppointmentExistence(),
	validation,
	getParticipants
)

export default router
