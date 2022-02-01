import express from 'express'
import { create, getAll } from '../controllers/agent.js'
import auth from '../middleware/auth.js'
import validation from '../validation/agent.js'

const router = express.Router()

router.get('/agents', getAll)
router.post('/create_agent', auth, validation, create)

export default router
