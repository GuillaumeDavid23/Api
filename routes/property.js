import express from 'express'
import * as PC from '../controllers/property.js'
import auth from '../middleware/auth.js'
import propertyValidationRules from '../middleware/validation/property.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'
import multer from '../middleware/multer-config.js'

const router = express.Router()

router.post(
	'/',
	propertyValidationRules(),
	validation,
	multer,
	PC.createProperty
)
router.get('/', PC.getAllProperties)
router.get('/:_id', validateParamId(), validation, PC.getPropertyById)
router.put(
	'/:_id',
	auth,
	validateParamId(),
	propertyValidationRules(),
	validation,
	multer,
	PC.updateProperty
)
router.delete('/:_id', auth, validateParamId(), validation, PC.deleteProperty)

export default router
