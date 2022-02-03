import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	getParticipants,
} from '../controllers/appointment.js'
import auth from '../middleware/auth.js'
import appointmentValidationRules from '../validation/appointment.js'
import { validation } from '../util/functions.js'

const router = express.Router()

router.post('/', auth, appointmentValidationRules(), validation, create)
router.put('/:_id', auth, appointmentValidationRules(), validation, update)
router.delete('/:_id', auth, erase)
router.get('/', auth, getAll)
router.get('/:_id', auth, getOne)
router.get('/getParticipants/:_id', auth, getParticipants)

export default router
