import express from 'express'
import * as PC from '../controllers/property.js'
import auth from '../middleware/auth.js'
import {
	checkPropertyBody,
	checkPropertyExistence,
} from '../middleware/validation/property.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'
import multer from '../middleware/multer-config.js'

const router = express.Router()

router.post('/', checkPropertyBody(), validation, multer, PC.createProperty)
router.get('/', PC.getAllProperties)
router.get('/:_id', validateParamId(), validation, PC.getPropertyById)
router.put(
	'/:_id',
	auth,
	checkPropertyExistence(),
	checkPropertyBody(),
	validation,
	multer,
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
