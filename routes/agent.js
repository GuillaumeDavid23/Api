import express from 'express'
import {
	create,
	getAgent,
	getAllAgents,
	getAvailabilities,
} from '../controllers/agent.js'
import auth from '../middleware/auth.js'
import validation from '../validation/agent.js'

const router = express.Router()

router.get('/availabilities', getAvailabilities)
router.get('/', getAllAgents)
router.get('/:_id', getAgent)
router.post('/', validation, create)

export default router
