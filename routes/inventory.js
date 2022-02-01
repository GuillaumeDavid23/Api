import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getAllForOneUser,
} from '../controllers/inventory.js'
import validation from '../validation/inventory.js'

const router = express.Router()

router.post('/', validation, create)
router.put('/:_id', validation, update)
router.delete('/:_id', erase)
router.get('/', getAll)
router.get('/:_id', getOne)
router.get('/getAllForOneUser/:_id', getAllForOneUser)

export default router
