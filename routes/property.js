import express from 'express'
import * as PC from '../controllers/property.js'
import auth from '../middleware/auth.js'
import validation from '../validation/property.js'
import multer from '../middleware/multer-config.js'

const router = express.Router()

router.post('/', validation, multer, PC.createProperty)
router.get('/', PC.getAllProperties)
router.get('/:_id', PC.getPropertyById)
router.put('/:_id', validation, multer, PC.updateProperty)
router.delete('/:_id', PC.deleteProperty)

export default router
