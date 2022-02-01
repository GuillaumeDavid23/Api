import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
} from '../controllers/property.js'

const router = express.Router()

router.post('/', create)
router.put('/:_id', update)
router.delete('/:_id', erase)
router.get('/', getAll)
router.get('/:_id', getOne)

export default router
