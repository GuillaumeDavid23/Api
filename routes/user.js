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
	getAgents,
	checkAgentAvailabilities,
	getBuyers,
	addToWishlist,
	removeOfWishlist,
	getSellers,
	checkAccess,
} from '../controllers/user.js'
import auth from '../middleware/auth.js'
import userValidationRules from '../middleware/validation/user.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/login', userValidationRules(), validation, login)
router.post('/signup', userValidationRules(), validation, signup)
router.post('/forgot', userValidationRules(), validation, forgotPass)

router.post('/', userValidationRules(), validation, create)
router.put(
	'/:_id',
	validateParamId(),
	userValidationRules(),
	validation,
	update
)
router.delete('/:_id', auth, validateParamId(), validation, deleteOne)
router.get('/', getAll)
router.get('/check/:token', checkResetToken)

router.get(
	'/setNewsletter/:_id',
	auth,
	validateParamId(),
	validation,
	setNewsletter
)
router.get(
	'/unsetNewsletter/:_id',
	auth,
	validateParamId(),
	validation,
	unsetNewsletter
)
router.get('/checkAccess/:_id', checkAccess)
router.get('/agents', auth, getAgents)
router.get('/agentAvailabilities', auth, checkAgentAvailabilities)
router.post('/wishlist', auth, addToWishlist)
router.delete('/wishlist', auth, removeOfWishlist)
router.get('/buyers', auth, getBuyers)
router.get('/sellers', auth, getSellers)
router.get('/:_id', auth, validateParamId(), validation, getOne)

export default router
