import express from 'express'
import { create, getAgent, getAllAgents } from '../controllers/agent.js'
import auth from '../middleware/auth.js'
import validation from '../validation/agent.js'

const router = express.Router()

router.get('/', getAllAgents)
router.get('/:_id', getAgent)
router.post('/', auth, validation, create)

export default router
