import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getAllForOneUser,
} from '../controllers/inventory.js'
import auth from '../middleware/auth.js'
import inventoryValidationRules from '../validation/inventory.js'
import { validation } from '../util/functions.js'

const router = express.Router()

router.post('/', auth, inventoryValidationRules(), validation, create)
router.put('/:_id', auth, inventoryValidationRules(), validation, update)
router.delete('/:_id', auth, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, getOne)
router.get('/getAllForOneUser/:_id', auth, getAllForOneUser)

export default router
