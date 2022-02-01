import express from 'express'
import { create, update, erase, getAll, getOne } from '../controllers/rental.js'
// import auth from '../middleware/auth'

const router = express.Router()

router.post('/', create)
router.put('/:id', update)
router.delete('/:id', erase)
router.get('/:id', getOne)
router.get('/', getAll)

module.exports = router
