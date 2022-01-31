import express from 'express'
import {getOne, getAll, create} from '../controllers/user.js'

const router = express.Router()

router.get('/:_id', getOne)
router.get('/', getAll)
router.post('/', create)

export default router