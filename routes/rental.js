import express from 'express'
import { create, update, erase, getAll, getOne } from '../controllers/rental.js'
// import auth from '../middleware/auth'
import validation from '../validation/rental.js'

const router = express.Router()

router.post('/', validation, create)
router.put('/:id', validation, update)
router.delete('/:id', erase)
router.get('/:id', getOne)
router.get('/', getAll)

module.exports = router
