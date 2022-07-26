import express from 'express'
import * as UC from '../controllers/user.js'
import * as CHK from '../middleware/validation/user.js'
import auth from '../middleware/auth.js'
import checkAccess from '../middleware/checkAccess.js'
import { checkPropertyExistence } from '../middleware/validation/property.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'
import multer from '../middleware/multer/agent.js'

const router = express.Router()
//(Login) Connexion d'un utilisateur
router.post('/login', CHK.checkForLogin(), validation, UC.login)

//(Login) Connexion d'un utilisateur
router.post('/loginAgent', CHK.checkForLogin(), validation, UC.agentLogin)
// //(SignUp) Inscription d'un vendeur
// router.post(
// 	'/sellerSignup',
// 	CHK.checkUserCommonBody(),
// 	CHK.checkSellerBody(),
// 	validation,
// 	UC.signup
// )

router.post('/checkBearer', UC.checkBearer)

// //(SignUp) Inscription d'un acheteur
// router.post(
// 	'/buyerSignup',
// 	CHK.checkUserCommonBody(),
// 	CHK.checkBuyerBody(),
// 	validation,
// 	UC.signup
// )

//(SignUp) Inscription standard
router.post('/signup', CHK.checkUserCommonBody(), validation, UC.signup)

// Push d'une photo d'un agent:
router.post('/pushAgentAvatar', multer, (req, res) => {
	res.status(200).json({ status_code: 200, message: 'Avatar ajouté !' })
})

//(Check) Verification token pour validation de compte
router.get('/emailVerification/:token', UC.verifyEmail)

//(GET) Récupération du vendeur d'une propriété:
router.get('/getSellerForOneProperty/:propertyId', UC.getSellerForOneProperty)

//(Mailing) Demande de rendez-vous
router.post('/emailAppointment', UC.askForAppointment)

//(Forgot) Mot de passe oublié
router.post('/forgot', CHK.checkForForgotPass(), validation, UC.forgotPass)

//(Create) Création admin d'un acheteur
router.post(
	'/',
	auth,
	checkAccess(['agent']),
	CHK.checkUserCommonBody(),
	validation,
	UC.create
)
router.post(
	'/buyer',
	auth,
	checkAccess(['agent']),
	CHK.checkUserCommonBody(),
	CHK.checkBuyerBody(),
	validation,
	UC.create
)

//(Create) Création admin d'un vendeur
router.post(
	'/seller',
	auth,
	checkAccess(['agent']),
	CHK.checkUserCommonBody(),
	CHK.checkSellerBody(),
	validation,
	UC.create
)

//(Create) Création admin d'un agent
router.post(
	'/agent',
	auth,
	checkAccess(['agent']),
	CHK.checkUserCommonBody(),
	CHK.checkAgentBody(),
	validation,
	UC.create
)

//(Update) Mise à jour d'un user
router.put(
	'/:_id',
	auth,
	checkAccess(['agent', 'buyer']),
	CHK.checkUserExistence(),
	// CHK.checkUserCommonBody(),
	// CHK.checkBuyerBody(),
	// CHK.checkSellerBody(),
	validation,
	UC.update
)

// //(Update) Mise à jour d'un acheteur
// router.put(
// 	'/buyer/:_id',
// 	auth,
// 	checkAccess(['agent', 'buyer']),
// 	CHK.checkUserExistence(),
// 	CHK.checkUserCommonBody(),
// 	CHK.checkBuyerBody(),
// 	validation,
// 	UC.update
// )

// //(Update) Mise à jour d'un vendeur
// router.put(
// 	'/seller/:_id',
// 	auth,
// 	checkAccess(['agent', 'seller']),
// 	CHK.checkUserExistence(),
// 	CHK.checkUserCommonBody(),
// 	CHK.checkSellerBody(),
// 	validation,
// 	UC.update
// )

//(Update) Mise à jour d'un agent
router.put(
	'/agent/:_id',
	auth,
	checkAccess(['agent']),
	CHK.checkUserExistence(),
	CHK.checkUserCommonBody(),
	CHK.checkAgentBody(),
	validation,
	UC.update
)

//(Delete) Désactivation d'un utilisateur
router.put(
	'/delete/:_id',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	CHK.checkUserExistence(),
	validation,
	UC.deleteOne
)

//(PUT) Création d'un client:
router.put(
	'/createSeller/:userId/:propertyId',
	auth,
	checkAccess(['agent']),
	// CHK.checkUserExistence(),
	// validation,
	UC.createSeller
)

// Formulaire de contact:
router.post('/sendMessage', UC.sendMessage)

//(Get) Récuperation des utilisateurs
router.get('/', auth, checkAccess(['agent']), UC.getAll)

//(GET) Recherche d'un client:
router.get(
	'/searchClient/:lastname',
	auth,
	checkAccess(['agent']),
	UC.searchClient
)

//(Check) Vérification du token
router.get(
	'/checkResetToken/:token',
	CHK.checkForResetToken(),
	validation,
	UC.checkResetToken
)

//(Update) Activation des newletters
router.get(
	'/setNewsletter/:_id',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	CHK.checkUserExistence(),
	validation,
	UC.setNewsletter
)

//(Update) Désactivation des newletters
router.get(
	'/unsetNewsletter/:_id',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	CHK.checkUserExistence(),
	validation,
	UC.unsetNewsletter
)

// SetNewsletter pour non-connecté
router.post('/setNewsletterForUnknown', UC.setNewsletterForUnknown)

//(Get) Récupération de tous les agents
router.get('/agents', UC.getAgents)

//(Get) Récupération de tous les acheteurs
router.get('/buyers', auth, checkAccess(['agent']), UC.getBuyers)

//(Get) Récupération de tous les vendeurs
router.get('/sellers', auth, checkAccess(['agent']), UC.getSellers)

//(Get) Récupération des disponibilité d'un agent
router.get(
	'/agentAvailabilities',
	auth,
	checkAccess(['buyer', 'seller', 'agent']),
	UC.checkAgentAvailabilities
)

//(Update) Ajout d'un favoris dans la wishlist
router.get(
	'/wishlist/:_id',
	auth,
	checkAccess(['buyer']),
	checkPropertyExistence(),
	validation,
	UC.addToWishlist
)

//(Delete) Suppression d'un favoris dans la wishlist
router.delete(
	'/wishlist/:_id',
	auth,
	checkAccess(['buyer']),
	checkPropertyExistence(),
	validation,
	UC.removeOfWishlist
)

//(Update) Ajout d'une propriété dans la liste d'un vendeur
router.get(
	'/property/:_id',
	auth,
	checkAccess(['agent']),
	checkPropertyExistence(),
	validation,
	UC.addToPropertyList
)

//(Delete) Suppression d'une propriété dans la liste d'un vendeur
router.delete(
	'/property/:_id',
	auth,
	checkAccess(['agent']),
	checkPropertyExistence(),
	validation,
	UC.removeOfPropertyList
)

// Check Token Reset Password
router.post('/checkTokenResetPassword', UC.checkTokenResetPassword)

// Reset Password
router.post('/resetPassword', UC.resetPassword)

//(Get) Récupération d'un utilisateur
router.get('/:_id', auth, validateParamId(), validation, UC.getOne)

router.delete(
	'/anonymize/:_id',
	auth,
	checkAccess(['agent']),
	CHK.checkUserExistence(),
	validation,
	UC.anonymize
)

export default router
