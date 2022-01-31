import express from 'express'
import {getOne, getAll, create, update} from '../controllers/user.js'

const router = express.Router()


router.post('/', create)
router.put('/:_id', update)
router.get('/:_id', getOne)
router.get('/', getAll)

export default router