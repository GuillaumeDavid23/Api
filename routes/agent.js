import express from 'express'
import { create, getAgent, getAllAgents } from '../controllers/agent.js'
import auth from '../middleware/auth.js'
import validation from '../validation/agent.js'

const router = express.Router()

router.get('/agents', getAllAgents)
router.get('/agents/:_id', getAgent)
router.post('/create_agent', auth, validation, create)

export default router
