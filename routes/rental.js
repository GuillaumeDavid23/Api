import express from 'express'
import { create, update, erase, getAll, getOne } from '../controllers/rental.js'
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
	create
)

//(Update) Mise à jour d'une location
router.put(
	'/:id',
	auth,
	checkAccess(['agent']),
	checkRentalExistence(),
	checkRentalBody(),
	validation,
	update
)

//(Delete) Suppression d'une location
router.delete(
	'/:id',
	auth,
	checkAccess(['agent']),
	checkRentalExistence(),
	validation,
	erase
)

//(Get) Récupération de toutes les locations
router.get(
	'/:id',
	auth,
	checkAccess(['agent']),
	validateParamId(),
	validation,
	getOne
)

//(Get) Récupération d'une location
router.get('/', auth, checkAccess(['agent']), getAll)

export default router
