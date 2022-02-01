import express from 'express'
import { getAll, getOne } from '../controllers/seller.js'

const router = express.Router()

router.get('/:id', getOne)
router.get('/', getAll)

export default router
