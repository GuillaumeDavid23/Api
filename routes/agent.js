import express from 'express'
import { create, getAll } from '../controllers/agent.js'

const router = express.Router()

router.get('/agents', getAll)
router.post('/create_agent', create)

export default router
