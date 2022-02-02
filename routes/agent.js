import express from 'express'
import {
	create,
	getAgent,
	getAllAgents,
	checkAvailabilities,
	makeTransaction,
} from '../controllers/agent.js'
import auth from '../middleware/auth.js'
import validationAg from '../validation/agent.js'
import validationTr from '../validation/transaction.js'

const router = express.Router()

router.get('/', getAllAgents)
router.get('/:_id', getAgent)
router.post('/', auth, validationAg, create)
router.post('/transaction', auth, validationTr, makeTransaction)
router.post('/availabilities', checkAvailabilities)

export default router
