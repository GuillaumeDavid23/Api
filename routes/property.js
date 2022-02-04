import express from 'express'
import * as PC from '../controllers/property.js'
import auth from '../middleware/auth.js'
import propertyValidationRules from '../validation/property.js'
import { validation } from '../util/functions.js'
import multer from '../middleware/multer-config.js'

const router = express.Router()

router.post(
	'/',

	multer,
	PC.createProperty
)
router.get('/', PC.getAllProperties)
router.get('/:_id', PC.getPropertyById)
router.put(
	'/:_id',
	auth,
	propertyValidationRules(),
	validation,
	multer,
	PC.updateProperty
)
router.delete('/:_id', auth, PC.deleteProperty)

export default router
