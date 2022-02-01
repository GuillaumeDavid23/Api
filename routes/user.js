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
	checkResetToken,
} from '../controllers/user.js'
import validation from '../validation/user.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/forgot', forgotPass)

// router.post('/login', validation, login)
// router.post('/signup', validation, signup)
// router.post('/forgot', validation, forgotPass)

router.post('/', validation, create)
router.put('/:_id', validation, update)
router.delete('/:_id', deleteOne)
router.get('/:_id', getOne)
router.get('/', getAll)
router.get('/check/:token', checkResetToken)

export default router
