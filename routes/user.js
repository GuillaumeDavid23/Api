import express from 'express'
import {getOne, getAll, create, update, deleteOne} from '../controllers/user.js'

const router = express.Router()


router.post('/', create)
router.put('/:_id', update)
router.delete('/:_id', deleteOne)
router.get('/:_id', getOne)
router.get('/', getAll)

export default router