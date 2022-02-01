import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getParticipants,
} from '../controllers/appointment.js'
import validation from '../validation/appointment.js'

const router = express.Router()

router.post('/', validation, create)
router.put('/:_id', validation, update)
router.delete('/:_id', erase)
router.get('/', getAll)
router.get('/:_id', getOne)
router.get('/getParticipants/:_id', getParticipants)

export default router
