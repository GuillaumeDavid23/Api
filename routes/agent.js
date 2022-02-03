import express from 'express'
import {
	create,
	getAgent,
	getAllAgents,
	checkAvailabilities,
} from '../controllers/agent.js'
import auth from '../middleware/auth.js'
import agentValidationRules from '../validation/agent.js'
import { validation } from '../util/functions.js'

const router = express.Router()

router.get('/', getAllAgents)
router.get('/:_id', getAgent)
router.post('/', auth, agentValidationRules(), validation, create)
router.post('/availabilities', checkAvailabilities)

export default router
