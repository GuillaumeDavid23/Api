import express from 'express'
import {getOne, create} from '../controllers/user.js'

const router = express.Router()

router.get('/:_id', getOne)
router.post('/', create)

export default router