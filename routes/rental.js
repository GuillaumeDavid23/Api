import express from 'express'
import * as RC from '../controllers/rental.js'
import auth from '../middleware/auth.js'
import checkAccess from '../middleware/checkAccess.js'
import {
	checkRentalBody,
	checkRentalExistence,
} from '../middleware/validation/rental.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

//(Create) Création d'une location
router.post(
	'/',
	auth,
	checkAccess(['agent']),
	checkRentalBody(),
	validation,
	RC.create
)

//(Update) Mise à jour d'une location
router.put(
	'/:id',
	auth,
	checkAccess(['agent']),
	checkRentalExistence(),
	checkRentalBody(),
	validation,
	RC.update
)

//(Delete) Suppression d'une location
router.delete(
	'/:id',
	auth,
	checkAccess(['agent']),
	checkRentalExistence(),
	validation,
	RC.erase
)

//(Get) Récupération de toutes les locations
router.get(
	'/:id',
	auth,
	checkAccess(['agent']),
	validateParamId(),
	validation,
	RC.getOne
)

//(Get) Récupération d'une location
router.get('/', auth, checkAccess(['agent']), RC.getAll)

export default router
