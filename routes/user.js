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
} from '../controllers/user.js'
import auth from '../middleware/auth.js'
import checkAccess from '../middleware/checkAccess.js'
import {
	checkUserCommonBody,
	checkBuyerBody,
	checkSellerBody,
	checkAgentBody,
	checkForLogin,
	checkForForgotPass,
	checkForResetToken,
	checkUserExistence,
} from '../middleware/validation/user.js'
import { checkPropertyExistence } from '../middleware/validation/property.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

router.post('/login', checkForLogin(), validation, login)
router.post(
	'/sellerSignup',
	checkUserCommonBody(),
	checkSellerBody(),
	validation,
	signup
)
router.post(
	'/buyerSignup',
	checkUserCommonBody(),
	checkBuyerBody(),
	validation,
	signup
)
router.post('/forgot', checkForForgotPass(), validation, forgotPass)
router.post(
	'/buyer',
	auth,
	checkUserCommonBody(),
	checkBuyerBody(),
	validation,
	create
)
router.post(
	'/seller',
	auth,
	checkUserCommonBody(),
	checkSellerBody(),
	validation,
	create
)
router.post(
	'/agent',
	auth,
	checkUserCommonBody(),
	checkAgentBody(),
	validation,
	create
)
router.put(
	'/buyer/:_id',
	auth,
	checkUserExistence(),
	checkUserCommonBody(),
	checkBuyerBody(),
	validation,
	update
)
router.put(
	'/seller/:_id',
	auth,
	checkUserExistence(),
	checkUserCommonBody(),
	checkSellerBody(),
	validation,
	update
)
router.put(
	'/agent/:_id',
	auth,
	checkUserExistence(),
	checkUserCommonBody(),
	checkAgentBody(),
	validation,
	update
)
router.delete('/:_id', auth, checkUserExistence(), validation, deleteOne)
router.get('/', auth, getAll)
router.get('/check/:token', checkForResetToken(), checkResetToken)
router.get(
	'/setNewsletter/:_id',
	auth,
	checkUserExistence(),
	validation,
	setNewsletter
)
router.get(
	'/unsetNewsletter/:_id',
	auth,
	checkUserExistence(),
	validation,
	unsetNewsletter
)
router.get(
	'/agents',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	getAgents
)
router.get(
	'/agentAvailabilities/:_id',
	auth,
	checkUserExistence(),
	checkAgentAvailabilities
)
router.post('/wishlist/:_id', auth, checkPropertyExistence(), addToWishlist)
router.delete(
	'/wishlist/:_id',
	auth,
	checkPropertyExistence(),
	removeOfWishlist
)
router.get('/buyers', auth, getBuyers)
router.get('/sellers', auth, getSellers)
router.get('/:_id', auth, validateParamId(), validation, getOne)

export default router
