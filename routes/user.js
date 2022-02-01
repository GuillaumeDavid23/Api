import express from 'express'
import {
	getOne,
	getAll,
	create,
	update,
	deleteOne,
	login,
	signup,
	forgotPass,
} from '../controllers/user.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/forgot', forgotPass)

router.post('/', create)
router.put('/:_id', update)
router.delete('/:_id', deleteOne)
router.get('/:_id', getOne)
router.get('/', getAll)

export default router
