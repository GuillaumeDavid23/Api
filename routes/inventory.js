import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getAllForOneUser,
	addRoomDetails,
	removeRoomDetails,
	addStatsMeters,
	removeStatsMeters,
} from '../controllers/inventory.js'
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
router.put('/room/:_id', auth, checkAccess(['agent']), addRoomDetails)

//(Delete) Suppression d'un état de pièce dans lst_roomDetails
router.delete('/room/:_id', auth, checkAccess(['agent']), removeRoomDetails)

//(Update) Ajout d'un relevé dans lst_statsMeters
router.put('/statsmeters/:_id', auth, checkAccess(['agent']), addStatsMeters)

//(Delete) Suppression d'un relevé dans lst_statsMeters
router.delete(
	'/statsmeters/:_id',
	auth,
	checkAccess(['agent']),
	removeStatsMeters
)

//(Create) Création d'un état des lieux
router.post(
	'/',
	auth,
	checkAccess(['agent']),
	checkInventoryBody(),
	validation,
	create
)

//(Update) Mise à jour d'un état des lieux
router.put(
	'/:_id',
	auth,
	checkAccess(['agent']),
	checkInventoryExistence(),
	checkInventoryBody(),
	validation,
	update
)

//(Delete) Suppression d'un état des lieux
router.delete(
	'/:_id',
	auth,
	checkAccess(['agent']),
	checkInventoryExistence(),
	validation,
	erase
)

//(Get) Récupération de tout les état des lieux
router.get('/', auth, checkAccess(['agent']), getAll)

//(Get) Récupération d'un état des lieux
router.get(
	'/:_id',
	auth,
	checkAccess(['agent']),
	validateParamId(),
	validation,
	getOne
)

//(Get) Récupération des état des lieux par rapport à un utilisateur
router.get(
	'/getAllForOneUser/:_id',
	auth,
	checkAccess(['agent']),
	checkUserExistence(),
	validation,
	getAllForOneUser
)

export default router
