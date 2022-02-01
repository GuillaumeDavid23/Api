import express from 'express'
import { getAll, getOne } from '../controllers/buyer.js'

const router = express.Router()

router.get('/', getAll)
router.get('/:_id', getOne)

export default router
