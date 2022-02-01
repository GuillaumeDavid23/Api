import express from 'express'
import * as PC from '../controllers/property.js'
import validation from '../validation/property.js'

const router = express.Router()

router.post('/', validation, PC.createProperty)
router.get('/', PC.getAllProperties)
router.get('/:_id', PC.getPropertyById)
router.put('/:_id', validation, PC.updateProperty)
router.delete('/:_id', PC.deleteProperty)

export default router
