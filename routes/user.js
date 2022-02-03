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
	setNewsletter,
	unsetNewsletter,
} from '../controllers/user.js'
import auth from '../middleware/auth.js'
import userValidationRules from '../validation/user.js'
import { validation } from '../util/functions.js'

const router = express.Router()

router.post('/login', userValidationRules(), validation, login)
router.post('/signup', userValidationRules(), validation, signup)
router.post('/forgot', userValidationRules(), validation, forgotPass)

router.post('/', auth, userValidationRules(), validation, create)
router.put('/:_id', auth, userValidationRules(), validation, update)
router.delete('/:_id', auth, deleteOne)
router.get('/:_id', auth, getOne)
router.get('/', auth, getAll)
router.get('/check/:token', checkResetToken)

router.get('/setNewsletter/:_id', auth, setNewsletter)
router.get('/unsetNewsletter/:_id', auth, unsetNewsletter)

export default router
