import express from 'express'
import * as PC from '../controllers/property.js'
import auth from '../middleware/auth.js'
import checkAccess from '../middleware/checkAccess.js'
import {
	test,
	checkPropertyBody,
	checkPropertyExistence,
} from '../middleware/validation/property.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'
import multer from '../middleware/multer-config.js'

const router = express.Router()
//(Update) Ajout d'un équipement dans lst_roomDetails
router.put('/equipment/:_id', auth, checkAccess(['agent']), PC.addEquipment)

//(Delete) Suppression d'un équipement dans lst_roomDetails
router.delete(
	'/equipment/:_id',
	auth,
	checkAccess(['agent']),
	PC.removeEquipment
)

//(Update) Ajout d'un équipement dans lst_roomDetails
router.put('/heater/:_id', auth, checkAccess(['agent']), PC.addHeater)

//(Delete) Suppression d'un équipement dans lst_roomDetails
router.delete('/heater/:_id', auth, checkAccess(['agent']), PC.removeHeater)

router.post(
	'/',
	auth,
	multer,
	checkPropertyBody(),
	validation,
	PC.createProperty
)
router.get('/', PC.getAllProperties)
router.get('/:_id', validateParamId(), validation, PC.getPropertyById)
router.put(
	'/:_id',
	auth,
	multer,
	checkPropertyExistence(),
	checkPropertyBody(),
	validation,
	PC.updateProperty
)
router.delete(
	'/:_id',
	auth,
	checkPropertyExistence(),
	validation,
	PC.deleteProperty
)

export default router
