import express from 'express'
import { create, update, erase, getAll, getOne } from '../controllers/rental.js'
import auth from '../middleware/auth.js'
import validation from '../validation/rental.js'

const router = express.Router()

router.post('/', auth, validation, create)
router.put('/:id', auth, validation, update)
router.delete('/:id', auth, erase)
router.get('/:id', auth, getOne)
router.get('/', auth, getAll)

export default router
