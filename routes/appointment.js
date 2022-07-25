import express from 'express'
import * as AC from '../controllers/appointment.js'
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
	checkAccess(['user', 'agent']),
	checkAppointmentBody(),
	validation,
	AC.create
)

//(Update) Mise à jour d'un rendez-vous
router.put(
	'/:_id',
	auth,
	checkAccess(['user', 'agent']),
	checkAppointmentExistence(),
	checkAppointmentBody(),
	validation,
	AC.update
)

//(Delete) Suppression d'un rendez-vous
router.delete(
	'/:_id',
	auth,
	checkAccess(['user', 'agent']),
	checkAppointmentExistence(),
	validation,
	AC.erase
)

//(Get) Récupération de toutes les rendez-vous
router.get('/', auth, checkAccess(['agent']), AC.getAll)

//(Get) Récupération de toutes les rendez-vous pour un agent
router.get(
	'/getAllForAnAgent',
	auth,
	checkAccess(['agent']),
	AC.getAllForAnAgent
)

//(Get) Récupération d'une rendez-vous
router.get(
	'/:_id',
	auth,
	checkAccess(['user', 'agent']),
	validateParamId(),
	validation,
	AC.getOne
)

//(Get) Récupération des participant à un rendez-vous
router.get(
	'/getParticipants/:_id',
	auth,
	checkAccess(['user', 'agent']),
	checkAppointmentExistence(),
	validation,
	AC.getParticipants
)

export default router
