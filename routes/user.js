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
import auth from '../middleware/auth.js'
import validation from '../validation/user.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/forgot', forgotPass)

// router.post('/login', validation, login)
// router.post('/signup', validation, signup)
// router.post('/forgot', validation, forgotPass)

router.post('/', auth, validation, create)
router.put('/:_id', auth, validation, update)
router.delete('/:_id', auth, deleteOne)
router.get('/:_id', auth, getOne)
router.get('/', auth, getAll)
router.get('/check/:token', checkResetToken)

export default router
