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
import checkAccess from '../middleware/checkAccess.js'
import {
	checkAppointmentBody,
	checkAppointmentExistence,
} from '../middleware/validation/appointment.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

//(Create) Création d'un rendez-vous
router.post(
	'/',
	auth,
	checkAccess(['seller', 'buyer', 'agent']),
	checkAppointmentBody(),
	validation,
	create
)

//(Update) Mise à jour d'un rendez-vous
router.put(
	'/:_id',
	auth,
	checkAccess(['seller', 'buyer', 'agent']),
	checkAppointmentExistence(),
	checkAppointmentBody(),
	validation,
	update
)

//(Delete) Suppression d'un rendez-vous
router.delete(
	'/:_id',
	auth,
	checkAccess(['seller', 'buyer', 'agent']),
	checkAppointmentExistence(),
	validation,
	erase
)

//(Get) Récupération de toutes les rendez-vous
router.get('/', auth, checkAccess(['agent']), getAll)

//(Get) Récupération d'une rendez-vous
router.get(
	'/:_id',
	auth,
	checkAccess(['seller', 'buyer', 'agent']),
	validateParamId(),
	validation,
	getOne
)

//(Get) Récupération des participant à un rendez-vous
router.get(
	'/getParticipants/:_id',
	auth,
	checkAccess(['seller', 'buyer', 'agent']),
	checkAppointmentExistence(),
	validation,
	getParticipants
)

export default router
