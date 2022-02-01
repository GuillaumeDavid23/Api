import express from 'express'
import { getOne } from '../controllers/rental.js'
// import auth from '../middleware/auth'

const router = express.Router()

router.get('/:id', getOne)

export default router
