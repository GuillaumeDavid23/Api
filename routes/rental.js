import express from 'express'
import { create, update, erase, getAll, getOne } from '../controllers/rental.js'
// import auth from '../middleware/auth'

const router = express.Router()

router.post('/', auth, create)
router.put('/:id', auth, update)
router.delete('/:id', auth, erase)
router.get('/:id', auth, getOne)
router.get('/', auth, getAll)

module.exports = router
