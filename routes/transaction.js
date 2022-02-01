import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
} from '../controllers/transaction.js'
import validation from '../validation/transaction.js'

const router = express.Router()

router.post('/', validation, create)
router.put('/:_id', validation, update)
router.delete('/:_id', erase)
router.get('/', getAll)
router.get('/:_id', getOne)

export default router
