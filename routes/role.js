import express from 'express'
import { getOne, getAll } from '../controllers/rental.js'
import auth from '../middleware/auth.js'
// import validation from '../validation/role.js'

const router = express.Router()

router.get('/:id', auth, getOne)
router.get('/', auth, getAll)

export default router
