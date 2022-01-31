import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getParticipants,
} from '../controllers/appointment.js'

const router = express.Router()

router.post('/', create)
router.put('/:_id', update)
router.delete('/:_id', erase)
router.get('/', getAll)
router.get('/:_id', getOne)
router.get('/getParticipants/:_id', getParticipants)

export default router
