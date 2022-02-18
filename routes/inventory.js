import express from 'express'
import * as IC from '../controllers/inventory.js'
import auth from '../middleware/auth.js'
import checkAccess from '../middleware/checkAccess.js'
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
//(Update) Ajout d'un état de pièce dans lst_roomDetails
router.put('/room/:_id', auth, checkAccess(['agent']), IC.addRoomDetails)

//(Delete) Suppression d'un état de pièce dans lst_roomDetails
router.delete('/room/:_id', auth, checkAccess(['agent']), IC.removeRoomDetails)

//(Update) Ajout d'un relevé dans lst_statsMeters
router.put('/statsmeters/:_id', auth, checkAccess(['agent']), IC.addStatsMeters)

//(Delete) Suppression d'un relevé dans lst_statsMeters
router.delete(
	'/statsmeters/:_id',
	auth,
	checkAccess(['agent']),
	IC.removeStatsMeters
)

//(Create) Création d'un état des lieux
router.post(
	'/',
	auth,
	checkAccess(['agent']),
	checkInventoryBody(),
	validation,
	IC.create
)

//(Update) Mise à jour d'un état des lieux
router.put(
	'/:_id',
	auth,
	checkAccess(['agent']),
	checkInventoryExistence(),
	checkInventoryBody(),
	validation,
	IC.update
)

//(Delete) Suppression d'un état des lieux
router.delete(
	'/:_id',
	auth,
	checkAccess(['agent']),
	checkInventoryExistence(),
	validation,
	IC.erase
)

//(Get) Récupération de tout les état des lieux
router.get('/', auth, checkAccess(['agent']), IC.getAll)

//(Get) Récupération d'un état des lieux
router.get(
	'/:_id',
	auth,
	checkAccess(['agent']),
	validateParamId(),
	validation,
	IC.getOne
)

//(Get) Récupération des état des lieux par rapport à un utilisateur
router.get(
	'/getAllForOneUser/:_id',
	auth,
	checkAccess(['agent']),
	checkUserExistence(),
	validation,
	IC.getAllForOneUser
)

export default router
