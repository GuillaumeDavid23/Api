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
	addToPropertyList,
	removeOfPropertyList,
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
//(Login) Connexion d'un utilisateur
router.post('/login', checkForLogin(), validation, login)

//(SignUp) Inscription d'un vendeur
router.post(
	'/sellerSignup',
	checkUserCommonBody(),
	checkSellerBody(),
	validation,
	signup
)

//(SignUp) Inscription d'un acheteur
router.post(
	'/buyerSignup',
	checkUserCommonBody(),
	checkBuyerBody(),
	validation,
	signup
)

//(Forgot) Mot de passe oublié
router.post('/forgot', checkForForgotPass(), validation, forgotPass)

//(Create) Création admin d'un acheteur
router.post(
	'/buyer',
	auth,
	checkAccess(['agent']),
	checkUserCommonBody(),
	checkBuyerBody(),
	validation,
	create
)

//(Create) Création admin d'un vendeur
router.post(
	'/seller',
	auth,
	checkAccess(['agent']),
	checkUserCommonBody(),
	checkSellerBody(),
	validation,
	create
)

//(Create) Création admin d'un agent
router.post(
	'/agent',
	auth,
	checkAccess(['agent']),
	checkUserCommonBody(),
	checkAgentBody(),
	validation,
	create
)

//(Update) Mise à jour d'un acheteur
router.put(
	'/buyer/:_id',
	auth,
	checkAccess(['agent', 'buyer']),
	checkUserExistence(),
	checkUserCommonBody(),
	checkBuyerBody(),
	validation,
	update
)

//(Update) Mise à jour d'un vendeur
router.put(
	'/seller/:_id',
	auth,
	checkAccess(['agent', 'seller']),
	checkUserExistence(),
	checkUserCommonBody(),
	checkSellerBody(),
	validation,
	update
)

//(Update) Mise à jour d'un agent
router.put(
	'/agent/:_id',
	auth,
	checkAccess(['agent']),
	checkUserExistence(),
	checkUserCommonBody(),
	checkAgentBody(),
	validation,
	update
)

//(Delete) Désactivation d'un utilisateur
router.put(
	'/delete/:_id',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	checkUserExistence(),
	validation,
	deleteOne
)

//(Get) Récuperation des utilisateurs
router.get('/', auth, checkAccess(['agent']), getAll)

//(Check) Vérification du token
router.get('/check/:token', checkForResetToken(), checkResetToken)

//(Update) Activation des newletters
router.get(
	'/setNewsletter/:_id',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	checkUserExistence(),
	validation,
	setNewsletter
)

//(Update) Désactivation des newletters
router.get(
	'/unsetNewsletter/:_id',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	checkUserExistence(),
	validation,
	unsetNewsletter
)

//(Get) Récupération de tous les agents
router.get(
	'/agents',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	getAgents
)

//(Get) Récupération de tous les acheteurs
router.get('/buyers', auth, checkAccess(['agent']), getBuyers)

//(Get) Récupération de tous les vendeurs
router.get('/sellers', auth, checkAccess(['agent']), getSellers)

//(Get) Récupération des disponibilité d'un agent
router.get(
	'/agentAvailabilities/:_id',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	checkUserExistence(),
	checkAgentAvailabilities
)

//(Update) Ajout d'un favoris dans la wishlist
router.put(
	'/wishlist/',
	auth,
	checkAccess(['buyer']),
	checkPropertyExistence(),
	addToWishlist
)

//(Delete) Suppression d'un favoris dans la wishlist
router.delete(
	'/wishlist/',
	auth,
	checkAccess(['buyer']),
	checkPropertyExistence(),
	removeOfWishlist
)

//(Update) Ajout d'une propriété dans la liste d'un vendeur
router.put(
	'/property/',
	auth,
	checkAccess(['agent']),
	checkPropertyExistence(),
	addToPropertyList
)

//(Delete) Suppression d'une propriété dans la liste d'un vendeur
router.delete(
	'/property/',
	auth,
	checkAccess(['agent']),
	checkPropertyExistence(),
	removeOfPropertyList
)

//(Get) Récupération d'un utilisateur
router.get('/:_id', auth, validateParamId(), validation, getOne)

export default router
