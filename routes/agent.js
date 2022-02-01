import express from 'express'
import { create, getAllAgents, getAgent } from '../controllers/agent.js'
import validation from '../validation/agent.js'

const router = express.Router()

router.get('/agents', getAllAgents)
router.get('/agents/:_id', getAgent)
router.post('/create_agent', validation, create)

export default router
