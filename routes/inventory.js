import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getAllForOneUser,
} from '../controllers/inventory.js'

const router = express.Router()

router.post('/', create)
router.put('/:_id', update)
router.delete('/:_id', erase)
router.get('/', getAll)
router.get('/:_id', getOne)
router.get('/getAllForOneUser/:_id', getAllForOneUser)

export default router
