import express from 'express'
import { getOne, getAll } from '../controllers/rental.js'
import auth from '../middleware/auth.js'
// import roleValidationRules from '../validation/role.js'
// import { validation } from '../util/functions.js'

const router = express.Router()

router.get('/:id', auth, getOne)
router.get('/', auth, getAll)

export default router
