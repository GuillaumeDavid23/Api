import express from 'express'
import { getOne } from '../controllers/rental.js'
// import auth from '../middleware/auth'
import validation from '../validation/role.js'

const router = express.Router()

router.get('/:id', getOne)

module.exports = router
