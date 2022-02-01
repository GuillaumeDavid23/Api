import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
} from '../controllers/transaction.js'
import auth from '../middleware/auth.js'
import validation from '../validation/transaction.js'

const router = express.Router()

router.post('/', auth, validation, create)
router.put('/:_id', auth, validation, update)
router.delete('/:_id', auth, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, getOne)

export default router
